/**
 * api-client.js — Client API pour Japan2026
 * Auth basée sur cookie de session (géré côté Worker).
 * Pas de mot de passe à entrer côté frontend — l'auth se fait via login.html?key=...
 */

(function (global) {
  const API_BASE = "/api";

  let cachedUser = null;
  let userPromise = null;

  async function request(path, opts = {}) {
    const headers = { ...(opts.headers || {}) };
    if (opts.body && !(opts.body instanceof ArrayBuffer) && !(opts.body instanceof Blob)) {
      headers["Content-Type"] = "application/json";
      if (typeof opts.body !== "string") opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(API_BASE + path, { ...opts, headers, credentials: "same-origin" });
    if (res.status === 401) {
      // Editor/admin action attempted without session → redirect to login
      const here = encodeURIComponent(location.pathname + location.search);
      if (!location.pathname.endsWith("/login.html")) {
        location.href = "/login.html?next=" + here;
      }
      throw new Error("Authentification requise");
    }
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`API ${res.status} ${txt}`);
    }
    return res.json();
  }

  // ---------- Auth ----------
  async function getMe(force = false) {
    if (!force && cachedUser !== null) return cachedUser;
    if (!force && userPromise) return userPromise;
    userPromise = fetch(API_BASE + "/auth/me", { credentials: "same-origin" })
      .then(r => r.json())
      .then(data => { cachedUser = data.user; return cachedUser; })
      .catch(() => { cachedUser = null; return null; })
      .finally(() => { userPromise = null; });
    return userPromise;
  }
  function isLoggedIn() { return !!cachedUser; }
  function isAdmin()    { return !!cachedUser && cachedUser.role === "admin"; }
  async function loginWithKey(key) {
    const res = await fetch(API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ key }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "login failed" }));
      throw new Error(err.error || "login failed");
    }
    const data = await res.json();
    cachedUser = data.user;
    return data.user;
  }
  async function logout() {
    await fetch(API_BASE + "/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    cachedUser = null;
  }

  // ---------- Posts ----------
  async function listPosts() { return request("/posts"); }
  async function savePost(post) { return request("/posts", { method: "POST", body: post }); }
  async function deletePost(id) { return request("/posts/" + encodeURIComponent(id), { method: "DELETE" }); }

  // ---------- Expenses ----------
  async function listExpenses() { return request("/expenses"); }
  async function saveExpense(exp) { return request("/expenses", { method: "POST", body: exp }); }
  async function deleteExpense(id) { return request("/expenses/" + encodeURIComponent(id), { method: "DELETE" }); }

  // ---------- Settings ----------
  async function getSetting(key) {
    const r = await request("/settings/" + encodeURIComponent(key));
    return r.value;
  }
  async function setSetting(key, value) {
    return request("/settings/" + encodeURIComponent(key), { method: "PUT", body: { value } });
  }

  // ---------- Photos ----------
  async function uploadPhotoFromBuffer(buf, contentType) {
    const res = await fetch(API_BASE + "/upload", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": contentType || "image/jpeg" },
      body: buf,
    });
    if (res.status === 401) {
      const here = encodeURIComponent(location.pathname + location.search);
      location.href = "/login.html?next=" + here;
      throw new Error("Authentification requise");
    }
    if (!res.ok) throw new Error("Upload failed: " + res.status);
    return res.json();
  }

  // ---------- Admin (editors management) ----------
  async function listEditors()              { return request("/admin/editors"); }
  async function createEditor(payload)      { return request("/admin/editors", { method: "POST", body: payload }); }
  async function updateEditor(id, payload)  { return request("/admin/editors/" + encodeURIComponent(id), { method: "PUT", body: payload }); }
  async function deleteEditor(id)           { return request("/admin/editors/" + encodeURIComponent(id), { method: "DELETE" }); }
  async function regenerateEditorKey(id)    { return request("/admin/editors/" + encodeURIComponent(id) + "/regenerate", { method: "POST" }); }

  // ---------- Expose ----------
  global.Japan2026Api = {
    getMe, isLoggedIn, isAdmin,
    loginWithKey, logout,
    listPosts, savePost, deletePost,
    listExpenses, saveExpense, deleteExpense,
    getSetting, setSetting,
    uploadPhotoFromBuffer,
    listEditors, createEditor, updateEditor, deleteEditor, regenerateEditorKey,
  };
})(window);
