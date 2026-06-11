# Handoff

> Session: 2026-06-11
> Branch: `feat/newsletter-signup` (merged); `main` is current
> Focus: built the open sponsorship ledger + fixed the newsletter signup

## What shipped this session

1. **Open sponsorship ledger** (PRs #4 → #5, merged & live)
   - Drift sponsor form fires a webhook → `POST /api/sponsor-webhook` (Cloudflare Pages Function) → validates → stores in D1 `sponsors` → `GET /api/ledger` → rendered in the homepage sponsor section (running total + supporter list).
   - Built capture-first: recorded real Drift payloads into `raw_captures`, locked the field mapping against them, then switched to production.
   - **Verified end-to-end** with a real £5 payment ("Sam", public) — shows on the live page.
   - Auth: shared secret in `X-Webhook-Token` header (constant-time compare). Idempotent insert (dedupe on `submissionId` + partial-unique on Stripe PI).
   - Privacy: name/message only stored when the supporter opts into public listing; **email is never stored**.
   - Parser `lib/parse-submission.mjs` is pure + unit-tested: `node test/parse-submission.test.mjs` → 8 passing.

2. **Newsletter signup fix** (PR #7, merged & live)
   - Old form used Netlify Forms (inert on Cloudflare). Replaced with `POST /api/subscribe` → D1 `subscribers`. Honeypot + email validation + idempotent insert. Confirmed deployed (one real signup: tom@good-ship.co.uk).

3. **Subscriber CSV export** (`functions/api/subscribers.js`)
   - `GET /api/subscribers?token=<DEBUG_TOKEN>` → CSV download (`&format=json` for JSON). Token-gated (reuses DEBUG_TOKEN), formula-injection-guarded. To view signups: open that URL in a browser, or query D1 directly.

## Key facts for next session

- **Hosting is Cloudflare Pages**, not Netlify (STATE.md/HANDOFF corrected; some other docs may still say Netlify).
- D1 db `good-ship-ledger`, bound as `DB`. Env vars: `WEBHOOK_TOKEN`, `DEBUG_TOKEN`.
- Read the debug log: `GET /api/captures?token=<DEBUG_TOKEN>` (returns raw_captures, may contain PII).
- The site is a single `index.html` with inline CSS/JS; backend lives in `functions/`.

## Open follow-ups (none blocking; agreed but not yet done)

- [ ] **Rotate `WEBHOOK_TOKEN`** — the value was exposed in chat during testing. Change in Pages + Drift.
- [ ] **Redact `x-webhook-token` from `logCapture`** — it's currently stored in plaintext in `raw_captures`. Small fix in `functions/api/sponsor-webhook.js`.
- [ ] **Clean test data before public launch:**
  - `sponsors` holds the test "Sam" £5 row.
  - `raw_captures` holds synthetic + test rows (ids 1–6).
  - Refund the test Stripe payments (Sam + the earlier capture-4 £5, submissionId `HIBmbJbbt7YYovA-cJbRF`, which is in raw_captures only, never in the ledger).
- [ ] *(Optional)* HMAC signature verification using Drift's signing secret (needs one capture of a signed request to implement `verifySignature()`).
- [ ] *(Optional)* Correct remaining stale "Netlify" references in `good-ship-redesign-plan.md` / `PLAN.md` if accuracy matters.
- [ ] *(Optional)* Accessibility audit (long-standing).

## How to verify the ledger quickly

```powershell
curl.exe "https://good-ship.co.uk/api/ledger"   # running total + supporters
```
Reusable on other sites: `GET /api/ledger` is CORS-open (`Access-Control-Allow-Origin: *`).
