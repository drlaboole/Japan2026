-- Schéma D1 pour Japan2026
-- À exécuter UNE FOIS via le Dashboard Cloudflare → D1 → ta DB → onglet "Console"

CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  date        TEXT NOT NULL,
  place       TEXT,
  title       TEXT,
  text        TEXT,
  photos      TEXT,        -- JSON array de clés R2 (ex: ["photos/xyz.jpg", ...])
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  author      TEXT         -- "haubertin" | "mallet" | NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);

CREATE TABLE IF NOT EXISTS expenses (
  id          TEXT PRIMARY KEY,
  date        TEXT NOT NULL,
  description TEXT NOT NULL,
  category    TEXT NOT NULL,
  amount      REAL NOT NULL,
  currency    TEXT NOT NULL,    -- "EUR" | "JPY"
  paid        TEXT NOT NULL,    -- "haubertin" | "mallet"
  for_whom    TEXT NOT NULL,    -- "haubertin" | "mallet" | "both"
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);

CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

-- Réglage par défaut : taux de change EUR ↔ JPY
INSERT OR IGNORE INTO settings (key, value, updated_at)
VALUES ('exchange_rate_eur_jpy', '170', datetime('now'));
