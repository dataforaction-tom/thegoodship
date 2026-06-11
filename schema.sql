-- Cloudflare D1 schema for The Good Ship open sponsorship ledger.
-- Apply with:
--   npx wrangler d1 execute good-ship-ledger --remote --file=./schema.sql

-- Confirmed sponsorships. One row per Drift submission, which (because the Drift
-- form won't submit without Stripe processing the payment) equals one confirmed
-- payment. amount stored in minor units (pence) as an INTEGER to avoid float drift.
CREATE TABLE IF NOT EXISTS sponsors (
  payment_id   TEXT PRIMARY KEY,          -- Drift submissionId; dedupes webhook retries
  stripe_payment_intent_id TEXT,          -- Stripe PI for audit / reconciliation; nullable
  created_at   TEXT NOT NULL,             -- ISO 8601; from payload submittedAt
  display_name TEXT,                      -- stored only when is_public = 1 (else NULL)
  amount_cents INTEGER NOT NULL,          -- minor units (pence)
  currency     TEXT NOT NULL DEFAULT 'GBP',
  is_public    INTEGER NOT NULL DEFAULT 0,-- 1 = supporter opted in to public listing
  message      TEXT                        -- stored only when is_public = 1 (else NULL)
);

-- Same Stripe payment can never be recorded twice (partial index allows many NULLs).
CREATE UNIQUE INDEX IF NOT EXISTS idx_sponsors_stripe_pi
  ON sponsors (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

-- Raw webhook captures: used to lock the Drift payload shape against a real request
-- before we trust it, and kept afterwards as an audit/debug trail.
CREATE TABLE IF NOT EXISTS raw_captures (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at  TEXT NOT NULL,
  signature_ok INTEGER,                   -- 1 verified, 0 failed, NULL not checked
  headers      TEXT NOT NULL,             -- JSON of request headers
  body         TEXT NOT NULL              -- raw request body
);
