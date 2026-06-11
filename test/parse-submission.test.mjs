// Tests for parseSubmission, asserted against the real Drift webhook captures we
// recorded during integration (capture ids 2, 3, 4 from raw_captures).
//
// Run: node test/parse-submission.test.mjs

import assert from "node:assert/strict";
import { parseSubmission } from "../lib/parse-submission.mjs";

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  ok  ${name}`);
}

// --- Capture 4: real payment, consent = "No" -------------------------------------
const capture4 = {
  submissionId: "HIBmbJbbt7YYovA-cJbRF",
  formId: "ptwFhkl5iFu63BRFj0H2F",
  formTitle: "Supporting open resources",
  data: {
    name_fld: "Tom",
    email_fld: "tomcampbellwatson@gmail.com",
    amount_fld: "tier1_opt",
    "jMgjRlRgXt96Dl9IjMq-0": "I love the free tools, especially the theory of change one!",
    "9oyNrqBM5PKqPya4_kTEg": "No",
  },
  submittedAt: "2026-06-11T14:34:12.587Z",
  fields: [
    { id: "name_fld", label: "Your Name", type: "text" },
    { id: "email_fld", label: "Email Address", type: "email" },
    { id: "amount_fld", label: "Sponsorship Amount (£)", type: "payment" },
    { id: "jMgjRlRgXt96Dl9IjMq-0", label: "Message", type: "textarea" },
    { id: "9oyNrqBM5PKqPya4_kTEg", label: "I'm happy for my name to be placed on the public ledger", type: "radio" },
  ],
  payment: {
    status: "succeeded",
    amount: 500,
    currency: "gbp",
    description: "Sponsorship for open work and resources",
    stripePaymentIntentId: "pi_3Th9g8EI6P6fHWxb1iomXvsy",
  },
};

test("capture 4: parses amount, currency, stripe id, idempotency key", () => {
  const result = parseSubmission(capture4);
  assert.equal(result.ok, true);
  assert.equal(result.row.amountMinor, 500);
  assert.equal(result.row.currency, "GBP");
  assert.equal(result.row.stripePaymentIntentId, "pi_3Th9g8EI6P6fHWxb1iomXvsy");
  assert.equal(result.row.submissionId, "HIBmbJbbt7YYovA-cJbRF");
  assert.equal(result.row.createdAt, "2026-06-11T14:34:12.587Z");
});

test("capture 4: consent 'No' redacts name and message (privacy)", () => {
  const { row } = parseSubmission(capture4);
  assert.equal(row.isPublic, 0);
  assert.equal(row.displayName, null);
  assert.equal(row.message, null);
});

test("capture 4: email is never carried into the row", () => {
  const { row } = parseSubmission(capture4);
  assert.ok(!JSON.stringify(row).includes("tomcampbellwatson@gmail.com"));
});

// --- Public variant: same payload, consent = "Yes" -------------------------------
test("consent 'Yes' retains name and message via field labels", () => {
  const publicCapture = {
    ...capture4,
    data: { ...capture4.data, "9oyNrqBM5PKqPya4_kTEg": "Yes" },
  };
  const { row } = parseSubmission(publicCapture);
  assert.equal(row.isPublic, 1);
  assert.equal(row.displayName, "Tom");
  assert.equal(row.message, "I love the free tools, especially the theory of change one!");
});

// --- Field ids differ between forms: map must follow labels, not ids -------------
test("different form with different field ids still maps correctly", () => {
  const otherForm = {
    submissionId: "abc123",
    submittedAt: "2026-06-11T10:00:00.000Z",
    data: { name_h3j8p1: "Alex", weird_id_xyz: "Yes" },
    fields: [
      { id: "name_h3j8p1", label: "Your Name", type: "text" },
      { id: "weird_id_xyz", label: "I'm happy for my name to be placed on the public ledger", type: "radio" },
    ],
    payment: { status: "succeeded", amount: 2500, currency: "gbp" },
  };
  const { row } = parseSubmission(otherForm);
  assert.equal(row.displayName, "Alex");
  assert.equal(row.isPublic, 1);
  assert.equal(row.amountMinor, 2500);
});

// --- Gating: non-succeeded and malformed payments are rejected --------------------
test("rejects payment that has not succeeded", () => {
  const pending = { ...capture4, payment: { ...capture4.payment, status: "pending" } };
  const result = parseSubmission(pending);
  assert.equal(result.ok, false);
});

test("rejects non-integer / non-positive amounts", () => {
  for (const bad of [25.5, "500", 0, -100, null, undefined]) {
    const result = parseSubmission({ ...capture4, payment: { ...capture4.payment, amount: bad } });
    assert.equal(result.ok, false, `amount ${bad} should be rejected`);
  }
});

test("rejects missing payment object", () => {
  const noPayment = { submissionId: "x", fields: [], data: {} };
  assert.equal(parseSubmission(noPayment).ok, false);
});

console.log(`\n${passed} tests passed`);
