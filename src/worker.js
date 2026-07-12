/**
 * Cloudflare Worker — Japan2026 API
 *
 * TOUT le site est privé : les pages HTML sont gatées par le middleware
 * requireAuthOrRedirect(). Les visiteurs non authentifiés sont redirigés
 * vers /login.html. Seuls les assets statiques (CSS, JS, images, fonts,
 * favicon) et la page /login.html elle-même restent accessibles sans auth.
 *
 * Auth :
 *   POST   /api/auth/login             body {username, password} → cookie
 *                                      (legacy : {key} accepté pour magic link)
 *   POST   /api/auth/logout
 *   GET    /api/auth/me                → { user: {role, name, email} | null }
 *
 * Data endpoints (tous exigent une session) :
 *   GET    /api/posts, /api/expenses, /api/settings/:key, /api/photo/:key
 *   POST   /api/posts, /api/expenses  → author = session.name
 *   PUT    /api/settings/:key
 *   POST   /api/upload
 *   DELETE /api/posts/:id, /api/expenses/:id
 *
 * Admin-only :
 *   GET    /api/admin/editors
 *   POST   /api/admin/editors                 body {name, email, username, password}
 *   PUT    /api/admin/editors/:id             body {name, email, username, active}
 *   POST   /api/admin/editors/:id/password    body {password}
 *   DELETE /api/admin/editors/:id
 *   POST   /api/admin/editors/:id/regenerate  (legacy magic link)
 *
 * Configuration :
 *   Bindings : DB (D1), PHOTOS (R2), ASSETS (static)
 *   Secrets  : ADMIN_KEY       → password admin (obligatoire)
 *   Vars     : ADMIN_USERNAME  → défaut "david"
 *              ADMIN_NAME      → défaut "David"
 *              ADMIN_EMAIL     → optionnel
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400",
};

const SESSION_DAYS = 30;
const COOKIE_NAME = "japan2026_session";
const PBKDF2_ITERATIONS = 100_000;

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
function bytesToHex(bytes) { return Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2, "0")).join(""); }
function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}
function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

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

// ---------- Password hashing (PBKDF2-SHA256) ----------
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password),
    { name: "PBKDF2" }, false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key, 256
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${bytesToHex(salt)}$${bytesToHex(bits)}`;
}

async function verifyPassword(password, stored) {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = parseInt(parts[1], 10);
  const salt = hexToBytes(parts[2]);
  const expected = parts[3];
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password),
    { name: "PBKDF2" }, false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key, 256
  );
  return constantTimeEqual(bytesToHex(bits), expected);
}

// ---------- Session helpers ----------
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

// ---------- AUTH endpoints ----------
async function handleAuthLogin(request, env) {
  const body = await request.json().catch(() => ({}));
  let sessionData = null;

  // Path 1: username + password (nouveau)
  if (body.username && body.password) {
    const username = String(body.username).trim().toLowerCase();
    const password = String(body.password);
    const adminUsername = (env.ADMIN_USERNAME || "david").trim().toLowerCase();
    const adminKey = (env.ADMIN_KEY || "").trim();

    if (adminKey && username === adminUsername && password === adminKey) {
      // Admin authentifié via ADMIN_USERNAME + ADMIN_KEY
      sessionData = {
        editor_id: null,
        role: "admin",
        name: env.ADMIN_NAME || "David",
        email: env.ADMIN_EMAIL || null,
      };
    } else {
      const editor = await env.DB.prepare(
        "SELECT * FROM editors WHERE username = ? AND active = 1"
      ).bind(username).first();
      if (!editor) return errorResp("invalid credentials", 401);
      const ok = await verifyPassword(password, editor.password_hash);
      if (!ok) return errorResp("invalid credentials", 401);
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
  }
  // Path 2 (legacy) : magic key
  else if (body.key) {
    const key = String(body.key).trim();
    const adminKey = (env.ADMIN_KEY || "").trim();
    if (adminKey && key === adminKey) {
      sessionData = {
        editor_id: null,
        role: "admin",
        name: env.ADMIN_NAME || "David",
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
  } else {
    return errorResp("username+password or key required", 400);
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
  // GET nécessite session (tout est privé maintenant)
  if (request.method === "GET") {
    const auth = await requireSession(request, env);
    if (auth.error) return auth.error;
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
    const auth = await requireSession(request, env);
    if (auth.error) return auth.error;
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
    const auth = await requireSession(request, env);
    if (auth.error) return auth.error;
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
  const auth = await requireSession(request, env);
  if (auth.error) return auth.error;
  const obj = await env.PHOTOS.get(key);
  if (!obj) return new Response("not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "private, max-age=31536000, immutable");
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(obj.body, { headers });
}

// ---------- ADMIN: EDITORS ----------
async function handleAdminEditors(request, env, id, subAction) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;

  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT id, email, name, username, active, created_at, last_login_at, login_key FROM editors ORDER BY created_at DESC"
    ).all();
    return jsonResp(results);
  }
  if (request.method === "POST" && !id) {
    const body = await request.json().catch(() => ({}));
    if (!body.name) return errorResp("name required");
    if (!body.username) return errorResp("username required");
    if (!body.password || body.password.length < 6) return errorResp("password required (6 chars min)");
    const username = String(body.username).trim().toLowerCase();
    // Check unique username
    const dup = await env.DB.prepare("SELECT id FROM editors WHERE username = ?").bind(username).first();
    if (dup) return errorResp("username already taken", 409);
    const pwHash = await hashPassword(body.password);
    const editor = {
      id: uid(),
      email: body.email || null,
      name: body.name,
      username,
      password_hash: pwHash,
      login_key: randomKey("jp_"),  // legacy backup, still generated for optional magic link
      active: 1,
      created_at: new Date().toISOString(),
      last_login_at: null,
    };
    await env.DB.prepare(`
      INSERT INTO editors (id, email, name, username, password_hash, login_key, active, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(editor.id, editor.email, editor.name, editor.username, editor.password_hash, editor.login_key, editor.active, editor.created_at, editor.last_login_at).run();
    // Ne pas renvoyer le hash
    return jsonResp({ ok: true, editor: { ...editor, password_hash: undefined } });
  }
  if (request.method === "PUT" && id && !subAction) {
    const body = await request.json().catch(() => ({}));
    const existing = await env.DB.prepare("SELECT * FROM editors WHERE id = ?").bind(id).first();
    if (!existing) return errorResp("not found", 404);
    const updated = {
      email: body.email !== undefined ? body.email : existing.email,
      name: body.name !== undefined ? body.name : existing.name,
      username: body.username !== undefined ? String(body.username).trim().toLowerCase() : existing.username,
      active: body.active !== undefined ? (body.active ? 1 : 0) : existing.active,
    };
    // Vérifier unicité si username change
    if (updated.username && updated.username !== existing.username) {
      const dup = await env.DB.prepare("SELECT id FROM editors WHERE username = ? AND id != ?").bind(updated.username, id).first();
      if (dup) return errorResp("username already taken", 409);
    }
    await env.DB.prepare(
      "UPDATE editors SET email = ?, name = ?, username = ?, active = ? WHERE id = ?"
    ).bind(updated.email, updated.name, updated.username, updated.active, id).run();
    // Si compte désactivé → invalider les sessions
    if (!updated.active) {
      await env.DB.prepare("DELETE FROM sessions WHERE editor_id = ?").bind(id).run();
    }
    return jsonResp({ ok: true });
  }
  if (request.method === "POST" && id && subAction === "password") {
    const body = await request.json().catch(() => ({}));
    if (!body.password || body.password.length < 6) return errorResp("password required (6 chars min)");
    const pwHash = await hashPassword(body.password);
    await env.DB.prepare("UPDATE editors SET password_hash = ? WHERE id = ?").bind(pwHash, id).run();
    // Invalider les sessions existantes pour forcer un nouveau login
    await env.DB.prepare("DELETE FROM sessions WHERE editor_id = ?").bind(id).run();
    return jsonResp({ ok: true });
  }
  if (request.method === "DELETE" && id) {
    await env.DB.prepare("DELETE FROM editors WHERE id = ?").bind(id).run();
    await env.DB.prepare("DELETE FROM sessions WHERE editor_id = ?").bind(id).run();
    return jsonResp({ ok: true });
  }
  if (request.method === "POST" && id && subAction === "regenerate") {
    // Legacy magic link — utile si mdp perdu
    const newKey = randomKey("jp_");
    await env.DB.prepare(
      "UPDATE editors SET login_key = ? WHERE id = ?"
    ).bind(newKey, id).run();
    await env.DB.prepare("DELETE FROM sessions WHERE editor_id = ?").bind(id).run();
    return jsonResp({ ok: true, login_key: newKey });
  }
  return errorResp("method not allowed", 405);
}

// ---------- Page gating (redirect to /login if no session) ----------
const PUBLIC_PATHS = new Set([
  "/login", "/login.html", "/favicon.ico", "/robots.txt", "/manifest.json",
]);
const STATIC_EXTENSIONS = [
  ".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".ico", ".webp", ".gif",
  ".woff", ".woff2", ".ttf", ".otf", ".eot", ".map", ".mp4", ".webm", ".json",
];
function isPublicAsset(pathname) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  const lower = pathname.toLowerCase();
  return STATIC_EXTENSIONS.some(ext => lower.endsWith(ext));
}

async function requireAuthOrRedirect(request, env, url) {
  const s = await getSession(request, env);
  if (s) return { session: s };
  const next = encodeURIComponent(url.pathname + url.search);
  return { redirect: Response.redirect(new URL(`/login.html?next=${next}`, url).toString(), 302) };
}

// ---------- ROUTER ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Auth endpoints (publics)
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

    // Photos R2 (privées maintenant, cf. handlePhoto)
    if (url.pathname.startsWith("/api/photo/")) {
      const key = decodeURIComponent(url.pathname.slice("/api/photo/".length));
      return handlePhoto(request, env, key);
    }

    // Data endpoints
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

    // ---------- Static asset serving with global gating ----------
    // Public assets (CSS, JS, images, fonts, favicon, /login page) → pass-through
    if (isPublicAsset(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    // /admin.html : session admin obligatoire
    if (url.pathname === "/admin.html" || url.pathname === "/admin") {
      const auth = await requireAuthOrRedirect(request, env, url);
      if (auth.redirect) return auth.redirect;
      if (auth.session.role !== "admin") {
        return new Response("Forbidden — admin uniquement", { status: 403 });
      }
      return env.ASSETS.fetch(request);
    }

    // Toutes les autres pages HTML : session valide obligatoire
    const auth = await requireAuthOrRedirect(request, env, url);
    if (auth.redirect) return auth.redirect;
    return env.ASSETS.fetch(request);
  },
};
