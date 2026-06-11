-- Adds the newsletter subscribers table to the existing D1 database.
--
-- Apply with:
--   npx wrangler d1 execute good-ship-ledger --remote --file=./migrations/0002_add_subscribers.sql

CREATE TABLE IF NOT EXISTS subscribers (
  email      TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  source     TEXT
);
