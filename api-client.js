/**
 * api-client.js — Client API pour Japan2026
 * Wrapper autour des routes /api/* du Worker.
 * Gère :
 *   - Authentification via header X-Family-Password
 *   - Stockage du mot de passe dans sessionStorage (re-demandé à chaque ouverture du navigateur)
 *   - Wrappers pour posts, expenses, settings, photos
 */

(function (global) {
  const API_BASE = "/api";
  const PW_KEY = "japan2026.password";

  function getPassword() {
    let pw = sessionStorage.getItem(PW_KEY);
    if (!pw) {
      pw = prompt("🔒 Mot de passe famille (Japan2026) :");
      if (pw) sessionStorage.setItem(PW_KEY, pw);
    }
    return pw;
  }

  function clearPassword() {
    sessionStorage.removeItem(PW_KEY);
  }

  async function request(path, opts = {}) {
    const pw = getPassword();
    if (!pw) throw new Error("Mot de passe requis");
    const headers = { "X-Family-Password": pw, ...(opts.headers || {}) };
    if (opts.body && !(opts.body instanceof ArrayBuffer) && !(opts.body instanceof Blob)) {
      headers["Content-Type"] = "application/json";
      if (typeof opts.body !== "string") opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(API_BASE + path, { ...opts, headers });
    if (res.status === 401) {
      clearPassword();
      alert("Mot de passe incorrect. La page va être rechargée.");
      location.reload();
      throw new Error("Unauthorized");
    }
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`API ${res.status} ${t}`);
    }
    return res.json();
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
  async function uploadPhotoFromDataURL(dataUrl) {
    // dataUrl: "data:image/jpeg;base64,..."
    const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
    if (!match) throw new Error("invalid data URL");
    const contentType = match[1];
    const b64 = match[2];
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return uploadPhotoFromBuffer(bytes.buffer, contentType);
  }
  async function uploadPhotoFromBuffer(buf, contentType) {
    const pw = getPassword();
    if (!pw) throw new Error("Mot de passe requis");
    const res = await fetch(API_BASE + "/upload", {
      method: "POST",
      headers: {
        "X-Family-Password": pw,
        "Content-Type": contentType || "image/jpeg",
      },
      body: buf,
    });
    if (res.status === 401) {
      clearPassword();
      alert("Mot de passe incorrect.");
      location.reload();
      throw new Error("Unauthorized");
    }
    if (!res.ok) throw new Error("Upload failed: " + res.status);
    return res.json();   // { ok, key, url }
  }

  global.Japan2026Api = {
    getPassword, clearPassword,
    listPosts, savePost, deletePost,
    listExpenses, saveExpense, deleteExpense,
    getSetting, setSetting,
    uploadPhotoFromDataURL, uploadPhotoFromBuffer,
  };
})(window);
