-- Schéma D1 pour Japan2026
-- À exécuter via le Dashboard Cloudflare → D1 → japan2026-db → onglet "Console"
-- Toutes les commandes utilisent IF NOT EXISTS, donc relancer ce script est safe.

-- ============== POSTS (journal) ==============
CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  date        TEXT NOT NULL,
  place       TEXT,
  title       TEXT,
  text        TEXT,
  photos      TEXT,        -- JSON array de clés R2
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  author      TEXT         -- nom complet de l'auteur
);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);

-- ============== EXPENSES (budget) ==============
CREATE TABLE IF NOT EXISTS expenses (
  id          TEXT PRIMARY KEY,
  date        TEXT NOT NULL,
  description TEXT NOT NULL,
  category    TEXT NOT NULL,
  amount      REAL NOT NULL,
  currency    TEXT NOT NULL,
  paid        TEXT NOT NULL,    -- "haubertin" | "mallet"
  for_whom    TEXT NOT NULL,    -- "haubertin" | "mallet" | "both"
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);

-- ============== SETTINGS (key-value) ==============
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
INSERT OR IGNORE INTO settings (key, value, updated_at)
VALUES ('exchange_rate_eur_jpy', '170', datetime('now'));

-- ============== EDITORS (rédacteurs autorisés) ==============
CREATE TABLE IF NOT EXISTS editors (
  id            TEXT PRIMARY KEY,
  email         TEXT,
  name          TEXT NOT NULL,
  login_key     TEXT NOT NULL UNIQUE,
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL,
  last_login_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_editors_key ON editors(login_key);

-- ============== SESSIONS (auth) ==============
CREATE TABLE IF NOT EXISTS sessions (
  token       TEXT PRIMARY KEY,
  editor_id   TEXT,             -- NULL pour les sessions admin
  role        TEXT NOT NULL,    -- 'admin' | 'editor'
  name        TEXT NOT NULL,
  email       TEXT,
  created_at  TEXT NOT NULL,
  expires_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
