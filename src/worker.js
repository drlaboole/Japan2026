/**
 * Cloudflare Worker — Japan2026 API
 *
 * Public routes (no auth) :
 *   GET    /api/posts
 *   GET    /api/expenses
 *   GET    /api/settings/:key
 *   GET    /api/photo/:key            (R2)
 *   GET    /api/auth/me               (returns current user or null)
 *
 * Auth routes :
 *   POST   /api/auth/login            body {key}  → cookie
 *   POST   /api/auth/logout
 *
 * Editor-only routes (write actions) :
 *   POST   /api/posts                 → also auto-fills author from session
 *   DELETE /api/posts/:id
 *   POST   /api/expenses
 *   DELETE /api/expenses/:id
 *   PUT    /api/settings/:key
 *   POST   /api/upload
 *
 * Admin-only routes :
 *   GET    /api/admin/editors
 *   POST   /api/admin/editors         body {name, email}
 *   PUT    /api/admin/editors/:id     body {name, email, active}
 *   DELETE /api/admin/editors/:id     (hard delete)
 *   POST   /api/admin/editors/:id/regenerate
 *
 * Static assets fallback via env.ASSETS.
 *
 * Configuration (Worker bindings) :
 *   - DB       : D1 database
 *   - PHOTOS   : R2 bucket
 *   - ASSETS   : static assets
 * Configuration (Worker secrets/vars) :
 *   - ADMIN_KEY    : secret  → la clé admin (URL : /login.html?key=ADMIN_KEY)
 *   - ADMIN_EMAIL  : var     → optionnel, pour affichage
 *   - ADMIN_NAME   : var     → optionnel, défaut "David"
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Family-Password",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400",
};

const SESSION_DAYS = 30;
const COOKIE_NAME = "japan2026_session";

// ---------- Helpers ----------
function jsonResp(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS, ...extraHeaders },
  });
}
function errorResp(message, status = 400) { return jsonResp({ error: message }, status); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 9); }
function randomKey(prefix = "") { return prefix + crypto.randomUUID().replace(/-/g, ""); }

function parseCookies(request) {
  const header = request.headers.get("Cookie") || "";
  const out = {};
  header.split(";").forEach(c => {
    const eq = c.indexOf("=");
    if (eq > 0) {
      const k = c.slice(0, eq).trim();
      const v = decodeURIComponent(c.slice(eq + 1).trim());
      if (k) out[k] = v;
    }
  });
  return out;
}
function buildSetCookie(name, value, maxAgeSeconds) {
  const v = value === null || value === "" ? "" : encodeURIComponent(value);
  const maxAge = value === null || value === "" ? 0 : maxAgeSeconds;
  return `${name}=${v}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

async function getSession(request, env) {
  const cookies = parseCookies(request);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const row = await env.DB.prepare(
    "SELECT * FROM sessions WHERE token = ? AND expires_at > ?"
  ).bind(token, new Date().toISOString()).first();
  return row || null;
}
async function requireSession(request, env) {
  const s = await getSession(request, env);
  if (!s) return { error: errorResp("unauthorized", 401) };
  return { session: s };
}
async function requireAdmin(request, env) {
  const r = await requireSession(request, env);
  if (r.error) return r;
  if (r.session.role !== "admin") return { error: errorResp("admin required", 403) };
  return r;
}

// ---------- AUTH ----------
async function handleAuthLogin(request, env) {
  const body = await request.json().catch(() => ({}));
  const key = (body.key || "").trim();
  if (!key) return errorResp("key required");

  const adminKey = (env.ADMIN_KEY || "").trim();
  let sessionData = null;

  if (adminKey && key === adminKey) {
    sessionData = {
      editor_id: null,
      role: "admin",
      name: env.ADMIN_NAME || "Admin",
      email: env.ADMIN_EMAIL || null,
    };
  } else {
    const editor = await env.DB.prepare(
      "SELECT * FROM editors WHERE login_key = ? AND active = 1"
    ).bind(key).first();
    if (!editor) return errorResp("invalid key", 401);
    sessionData = {
      editor_id: editor.id,
      role: "editor",
      name: editor.name,
      email: editor.email,
    };
    await env.DB.prepare(
      "UPDATE editors SET last_login_at = ? WHERE id = ?"
    ).bind(new Date().toISOString(), editor.id).run();
  }

  const token = randomKey("s_");
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86400 * 1000);
  await env.DB.prepare(
    `INSERT INTO sessions (token, editor_id, role, name, email, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(token, sessionData.editor_id, sessionData.role, sessionData.name, sessionData.email, now.toISOString(), expires.toISOString()).run();

  const headers = new Headers({ "Content-Type": "application/json", ...CORS_HEADERS });
  headers.append("Set-Cookie", buildSetCookie(COOKIE_NAME, token, SESSION_DAYS * 86400));
  return new Response(JSON.stringify({
    ok: true,
    user: { role: sessionData.role, name: sessionData.name, email: sessionData.email },
  }), { status: 200, headers });
}

async function handleAuthLogout(request, env) {
  const cookies = parseCookies(request);
  const token = cookies[COOKIE_NAME];
  if (token) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  }
  const headers = new Headers({ "Content-Type": "application/json", ...CORS_HEADERS });
  headers.append("Set-Cookie", buildSetCookie(COOKIE_NAME, "", 0));
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}

async function handleAuthMe(request, env) {
  const s = await getSession(request, env);
  if (!s) return jsonResp({ user: null });
  return jsonResp({
    user: { role: s.role, name: s.name, email: s.email },
  });
}

// ---------- POSTS ----------
async function handlePosts(request, env, id) {
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT * FROM posts ORDER BY date DESC, created_at DESC"
    ).all();
    return jsonResp(results.map(r => ({
      ...r,
      photos: r.photos ? JSON.parse(r.photos) : [],
    })));
  }
  if (request.method === "POST") {
    const auth = await requireSession(request, env);
    if (auth.error) return auth.error;
    const body = await request.json().catch(() => ({}));
    if (!body.date) return errorResp("date required");
    // Author = session name (unless admin who can post as anyone)
    const author = (auth.session.role === "admin" && body.author) ? body.author : auth.session.name;
    const post = {
      id: body.id || uid(),
      date: body.date,
      place: body.place || null,
      title: body.title || null,
      text: body.text || null,
      photos: JSON.stringify(body.photos || []),
      created_at: body.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author,
    };
    await env.DB.prepare(`
      INSERT INTO posts (id, date, place, title, text, photos, created_at, updated_at, author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        date = excluded.date,
        place = excluded.place,
        title = excluded.title,
        text = excluded.text,
        photos = excluded.photos,
        updated_at = excluded.updated_at,
        author = excluded.author
    `).bind(
      post.id, post.date, post.place, post.title, post.text,
      post.photos, post.created_at, post.updated_at, post.author
    ).run();
    return jsonResp({ ok: true, id: post.id });
  }
  if (request.method === "DELETE") {
    const auth = await requireSession(request, env);
    if (auth.error) return auth.error;
    if (!id) return errorResp("id required", 400);
    await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
    return jsonResp({ ok: true });
  }
  return errorResp("method not allowed", 405);
}

// ---------- EXPENSES ----------
async function handleExpenses(request, env, id) {
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT * FROM expenses ORDER BY date DESC, created_at DESC"
    ).all();
    return jsonResp(results.map(r => ({
      id: r.id, date: r.date, description: r.description, category: r.category,
      amount: r.amount, currency: r.currency, paid: r.paid, forWhom: r.for_whom,
      createdAt: r.created_at, updatedAt: r.updated_at,
    })));
  }
  if (request.method === "POST") {
    const auth = await requireSession(request, env);
    if (auth.error) return auth.error;
    const body = await request.json().catch(() => ({}));
    if (!body.date || !body.description) return errorResp("date and description required");
    const exp = {
      id: body.id || uid(),
      date: body.date,
      description: body.description,
      category: body.category || "Divers",
      amount: typeof body.amount === "number" ? body.amount : parseFloat(body.amount),
      currency: body.currency || "EUR",
      paid: body.paid,
      for_whom: body.forWhom,
      created_at: body.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (!exp.paid || !exp.for_whom) return errorResp("paid and forWhom required");
    await env.DB.prepare(`
      INSERT INTO expenses (id, date, description, category, amount, currency, paid, for_whom, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        date = excluded.date, description = excluded.description, category = excluded.category,
        amount = excluded.amount, currency = excluded.currency, paid = excluded.paid,
        for_whom = excluded.for_whom, updated_at = excluded.updated_at
    `).bind(
      exp.id, exp.date, exp.description, exp.category, exp.amount,
      exp.currency, exp.paid, exp.for_whom, exp.created_at, exp.updated_at
    ).run();
    return jsonResp({ ok: true, id: exp.id });
  }
  if (request.method === "DELETE") {
    const auth = await requireSession(request, env);
    if (auth.error) return auth.error;
    if (!id) return errorResp("id required", 400);
    await env.DB.prepare("DELETE FROM expenses WHERE id = ?").bind(id).run();
    return jsonResp({ ok: true });
  }
  return errorResp("method not allowed", 405);
}

// ---------- SETTINGS ----------
async function handleSettings(request, env, key) {
  if (!key) return errorResp("key required");
  if (request.method === "GET") {
    const row = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first();
    return jsonResp({ key, value: row ? row.value : null });
  }
  if (request.method === "PUT") {
    const auth = await requireSession(request, env);
    if (auth.error) return auth.error;
    const body = await request.json().catch(() => ({}));
    await env.DB.prepare(`
      INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(key, String(body.value), new Date().toISOString()).run();
    return jsonResp({ ok: true });
  }
  return errorResp("method not allowed", 405);
}

// ---------- PHOTOS (R2) ----------
async function handleUpload(request, env) {
  if (request.method !== "POST") return errorResp("method not allowed", 405);
  const auth = await requireSession(request, env);
  if (auth.error) return auth.error;
  const buf = await request.arrayBuffer();
  if (!buf || buf.byteLength === 0) return errorResp("empty body");
  if (buf.byteLength > 8 * 1024 * 1024) return errorResp("file too large (8 MB max)", 413);
  const contentType = request.headers.get("Content-Type") || "image/jpeg";
  if (!contentType.startsWith("image/")) return errorResp("not an image");
  const ext = (contentType.split("/")[1] || "bin").split("+")[0];
  const key = `photos/${uid()}.${ext}`;
  await env.PHOTOS.put(key, buf, { httpMetadata: { contentType } });
  return jsonResp({ ok: true, key, url: `/api/photo/${key}` });
}

async function handlePhoto(request, env, key) {
  if (!key) return errorResp("key required", 400);
  const obj = await env.PHOTOS.get(key);
  if (!obj) return new Response("not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(obj.body, { headers });
}

// ---------- ADMIN: EDITORS ----------
async function handleAdminEditors(request, env, id, subAction) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;

  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT * FROM editors ORDER BY created_at DESC"
    ).all();
    return jsonResp(results);
  }
  if (request.method === "POST" && !id) {
    const body = await request.json().catch(() => ({}));
    if (!body.name) return errorResp("name required");
    const editor = {
      id: uid(),
      email: body.email || null,
      name: body.name,
      login_key: randomKey("jp_"),
      active: 1,
      created_at: new Date().toISOString(),
      last_login_at: null,
    };
    await env.DB.prepare(`
      INSERT INTO editors (id, email, name, login_key, active, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(editor.id, editor.email, editor.name, editor.login_key, editor.active, editor.created_at, editor.last_login_at).run();
    return jsonResp({ ok: true, editor });
  }
  if (request.method === "PUT" && id) {
    const body = await request.json().catch(() => ({}));
    const existing = await env.DB.prepare("SELECT * FROM editors WHERE id = ?").bind(id).first();
    if (!existing) return errorResp("not found", 404);
    const updated = {
      email: body.email !== undefined ? body.email : existing.email,
      name: body.name !== undefined ? body.name : existing.name,
      active: body.active !== undefined ? (body.active ? 1 : 0) : existing.active,
    };
    await env.DB.prepare(
      "UPDATE editors SET email = ?, name = ?, active = ? WHERE id = ?"
    ).bind(updated.email, updated.name, updated.active, id).run();
    return jsonResp({ ok: true });
  }
  if (request.method === "DELETE" && id) {
    await env.DB.prepare("DELETE FROM editors WHERE id = ?").bind(id).run();
    await env.DB.prepare("DELETE FROM sessions WHERE editor_id = ?").bind(id).run();
    return jsonResp({ ok: true });
  }
  if (request.method === "POST" && id && subAction === "regenerate") {
    const newKey = randomKey("jp_");
    await env.DB.prepare(
      "UPDATE editors SET login_key = ? WHERE id = ?"
    ).bind(newKey, id).run();
    // Invalidate existing sessions for that editor
    await env.DB.prepare("DELETE FROM sessions WHERE editor_id = ?").bind(id).run();
    return jsonResp({ ok: true, login_key: newKey });
  }
  return errorResp("method not allowed", 405);
}

// ---------- ADMIN PAGE PROTECTION ----------
async function protectedStaticAsset(request, env, path) {
  // For /admin.html only: must be admin session, else redirect to login
  const s = await getSession(request, env);
  if (!s || s.role !== "admin") {
    return Response.redirect(new URL("/login.html?next=/admin.html", request.url).toString(), 302);
  }
  return env.ASSETS.fetch(request);
}

// ---------- ROUTER ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Public photo serving (no auth)
    if (url.pathname.startsWith("/api/photo/")) {
      const key = decodeURIComponent(url.pathname.slice("/api/photo/".length));
      return handlePhoto(request, env, key);
    }

    // Auth endpoints
    if (url.pathname === "/api/auth/login")  return handleAuthLogin(request, env);
    if (url.pathname === "/api/auth/logout") return handleAuthLogout(request, env);
    if (url.pathname === "/api/auth/me")     return handleAuthMe(request, env);

    // Admin endpoints
    if (url.pathname.startsWith("/api/admin/editors")) {
      const rest = url.pathname.slice("/api/admin/editors".length).replace(/^\//, "");
      const parts = rest ? rest.split("/") : [];
      const id = parts[0] || null;
      const subAction = parts[1] || null;
      return handleAdminEditors(request, env, id, subAction);
    }

    // Standard API endpoints
    if (url.pathname.startsWith("/api/posts")) {
      const id = decodeURIComponent(url.pathname.slice("/api/posts/".length).split("?")[0]) || null;
      return handlePosts(request, env, id);
    }
    if (url.pathname.startsWith("/api/expenses")) {
      const id = decodeURIComponent(url.pathname.slice("/api/expenses/".length).split("?")[0]) || null;
      return handleExpenses(request, env, id);
    }
    if (url.pathname.startsWith("/api/settings/")) {
      const key = decodeURIComponent(url.pathname.slice("/api/settings/".length).split("?")[0]);
      return handleSettings(request, env, key);
    }
    if (url.pathname === "/api/upload") return handleUpload(request, env);

    if (url.pathname.startsWith("/api/")) return errorResp("not found", 404);

    // Protected static page: admin.html requires admin session
    if (url.pathname === "/admin.html" || url.pathname === "/admin") {
      return protectedStaticAsset(request, env, url.pathname);
    }

    // All other paths → static assets
    return env.ASSETS.fetch(request);
  },
};
