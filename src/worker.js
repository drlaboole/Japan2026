/**
 * Cloudflare Worker — Japan2026 API
 * Routes :
 *   GET    /api/posts                   → liste tous les posts du journal
 *   POST   /api/posts                   → créer ou mettre à jour un post (envoie un objet JSON)
 *   DELETE /api/posts/:id               → supprimer un post
 *   GET    /api/expenses                → liste toutes les dépenses
 *   POST   /api/expenses                → créer ou mettre à jour une dépense
 *   DELETE /api/expenses/:id            → supprimer une dépense
 *   GET    /api/settings/:key           → lire un réglage (ex: exchange rate)
 *   PUT    /api/settings/:key           → enregistrer un réglage
 *   POST   /api/upload                  → uploader une photo (binary body) → renvoie {key, url}
 *   GET    /api/photo/:key              → servir une photo depuis R2 (public, mis en cache)
 *   *                                   → assets statiques (index.html, etc.)
 *
 * Auth : header "X-Family-Password" doit valoir env.FAMILY_PASSWORD pour TOUTES les routes /api/* sauf /api/photo/*.
 * Configurer le secret avec :  wrangler secret put FAMILY_PASSWORD
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Family-Password",
  "Access-Control-Max-Age": "86400",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
  });
}

function error(message, status = 400) {
  return json({ error: message }, status);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function isAuthorized(request, env) {
  const pw = request.headers.get("X-Family-Password");
  return pw && env.FAMILY_PASSWORD && pw === env.FAMILY_PASSWORD;
}

// ---------- POSTS ----------
async function handlePosts(request, env, id) {
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT * FROM posts ORDER BY date DESC, created_at DESC"
    ).all();
    return json(results.map(r => ({
      ...r,
      photos: r.photos ? JSON.parse(r.photos) : [],
    })));
  }
  if (request.method === "POST") {
    const body = await request.json();
    if (!body.date) return error("date required");
    const post = {
      id: body.id || uid(),
      date: body.date,
      place: body.place || null,
      title: body.title || null,
      text: body.text || null,
      photos: JSON.stringify(body.photos || []),
      created_at: body.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: body.author || null,
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
    return json({ ok: true, id: post.id });
  }
  if (request.method === "DELETE") {
    if (!id) return error("id required", 400);
    await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
    return json({ ok: true });
  }
  return error("method not allowed", 405);
}

// ---------- EXPENSES ----------
async function handleExpenses(request, env, id) {
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT * FROM expenses ORDER BY date DESC, created_at DESC"
    ).all();
    // map for_whom -> forWhom for JS friendliness
    return json(results.map(r => ({
      id: r.id,
      date: r.date,
      description: r.description,
      category: r.category,
      amount: r.amount,
      currency: r.currency,
      paid: r.paid,
      forWhom: r.for_whom,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })));
  }
  if (request.method === "POST") {
    const body = await request.json();
    if (!body.date || !body.description) return error("date and description required");
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
    if (!exp.paid || !exp.for_whom) return error("paid and forWhom required");
    await env.DB.prepare(`
      INSERT INTO expenses (id, date, description, category, amount, currency, paid, for_whom, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        date = excluded.date,
        description = excluded.description,
        category = excluded.category,
        amount = excluded.amount,
        currency = excluded.currency,
        paid = excluded.paid,
        for_whom = excluded.for_whom,
        updated_at = excluded.updated_at
    `).bind(
      exp.id, exp.date, exp.description, exp.category, exp.amount,
      exp.currency, exp.paid, exp.for_whom, exp.created_at, exp.updated_at
    ).run();
    return json({ ok: true, id: exp.id });
  }
  if (request.method === "DELETE") {
    if (!id) return error("id required", 400);
    await env.DB.prepare("DELETE FROM expenses WHERE id = ?").bind(id).run();
    return json({ ok: true });
  }
  return error("method not allowed", 405);
}

// ---------- SETTINGS ----------
async function handleSettings(request, env, key) {
  if (!key) return error("key required");
  if (request.method === "GET") {
    const row = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first();
    return json({ key, value: row ? row.value : null });
  }
  if (request.method === "PUT") {
    const body = await request.json();
    await env.DB.prepare(`
      INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(key, String(body.value), new Date().toISOString()).run();
    return json({ ok: true });
  }
  return error("method not allowed", 405);
}

// ---------- PHOTOS ----------
async function handleUpload(request, env) {
  if (request.method !== "POST") return error("method not allowed", 405);
  const buf = await request.arrayBuffer();
  if (!buf || buf.byteLength === 0) return error("empty body");
  if (buf.byteLength > 8 * 1024 * 1024) return error("file too large (8 MB max)", 413);
  const contentType = request.headers.get("Content-Type") || "image/jpeg";
  if (!contentType.startsWith("image/")) return error("not an image");
  const ext = (contentType.split("/")[1] || "bin").split("+")[0];
  const key = `photos/${uid()}.${ext}`;
  await env.PHOTOS.put(key, buf, { httpMetadata: { contentType } });
  return json({ ok: true, key, url: `/api/photo/${key}` });
}

async function handlePhoto(request, env, key) {
  if (!key) return error("key required", 400);
  const obj = await env.PHOTOS.get(key);
  if (!obj) return new Response("not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(obj.body, { headers });
}

// ---------- ROUTER ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Photos are public (cached, served without auth)
    if (url.pathname.startsWith("/api/photo/")) {
      const key = decodeURIComponent(url.pathname.slice("/api/photo/".length));
      return handlePhoto(request, env, key);
    }

    // All other /api/* routes require auth
    if (url.pathname.startsWith("/api/")) {
      if (!isAuthorized(request, env)) return error("unauthorized", 401);

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
      if (url.pathname === "/api/upload") {
        return handleUpload(request, env);
      }
      return error("not found", 404);
    }

    // Everything else → static assets (index.html, etc.)
    return env.ASSETS.fetch(request);
  },
};
