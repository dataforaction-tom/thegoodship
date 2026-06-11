// Pure, side-effect-free normalisation of a Drift form webhook payload into a ledger row.
//
// Maps fields by the `fields[]` array (label / type) rather than the auto-generated,
// form-specific field ids (e.g. `name_fld`, `name_h3j8p1`) — those change whenever the
// form is rebuilt, so binding to them would silently break the ledger.
//
// Privacy: name and message are only retained when the supporter opted into public
// listing. For non-public supporters we keep amount + date + Stripe id only, so the
// database itself holds no PII for anyone who didn't consent to being listed.

const PUBLIC_LEDGER_LABEL = /public ledger/i;
const NAME_LABEL = /name/i;

/**
 * @param {unknown} payload  Parsed JSON body of the Drift webhook.
 * @returns {{ok: true, row: object} | {ok: false, reason: string}}
 */
export function parseSubmission(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, reason: "payload not an object" };
  }

  const payment = payload.payment;
  if (!payment || typeof payment !== "object") {
    return { ok: false, reason: "missing payment object" };
  }
  // Only confirmed, settled payments enter the ledger — never pending/failed.
  if (payment.status !== "succeeded") {
    return { ok: false, reason: `payment status not succeeded (${payment.status})` };
  }
  // Amount must be a positive integer in minor units (pence). Reject floats/strings
  // so the running total can never be corrupted by a malformed value.
  const amountMinor = payment.amount;
  if (!Number.isInteger(amountMinor) || amountMinor <= 0) {
    return { ok: false, reason: `invalid payment.amount (${amountMinor})` };
  }

  const submissionId = typeof payload.submissionId === "string" ? payload.submissionId : null;
  if (!submissionId) {
    return { ok: false, reason: "missing submissionId" };
  }

  const fields = Array.isArray(payload.fields) ? payload.fields : [];
  const data = payload.data && typeof payload.data === "object" ? payload.data : {};

  // Resolve a field's submitted value via the first matching field descriptor.
  const valueOf = (predicate) => {
    const field = fields.find(predicate);
    if (!field) return "";
    const raw = data[field.id];
    return raw == null ? "" : String(raw).trim();
  };

  const displayName =
    valueOf((f) => f.type === "text" && NAME_LABEL.test(f.label || "")) ||
    valueOf((f) => f.type === "text");

  const message = valueOf((f) => f.type === "textarea");

  const consent =
    valueOf((f) => f.type === "radio" && PUBLIC_LEDGER_LABEL.test(f.label || "")) ||
    valueOf((f) => f.type === "radio");
  const isPublic = consent.toLowerCase() === "yes" ? 1 : 0;

  const currency = String(payment.currency || "gbp").toUpperCase();
  const stripePaymentIntentId =
    typeof payment.stripePaymentIntentId === "string" ? payment.stripePaymentIntentId : null;

  const createdAt =
    typeof payload.submittedAt === "string" ? payload.submittedAt : new Date().toISOString();

  return {
    ok: true,
    row: {
      submissionId,
      stripePaymentIntentId,
      createdAt,
      displayName: isPublic ? displayName || null : null,
      amountMinor,
      currency,
      isPublic,
      message: isPublic ? message || null : null,
    },
  };
}
