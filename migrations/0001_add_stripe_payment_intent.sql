-- Migration for the already-deployed `sponsors` table (created from the original
-- schema.sql, before the stripe_payment_intent_id column existed).
--
-- Apply with:
--   npx wrangler d1 execute good-ship-ledger --remote --file=./migrations/0001_add_stripe_payment_intent.sql

ALTER TABLE sponsors ADD COLUMN stripe_payment_intent_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sponsors_stripe_pi
  ON sponsors (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
