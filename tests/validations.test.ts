import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { reportInputSchema } from "../src/lib/validations.js";

describe("Report Input Validation (Zod Schema)", () => {
  const validReport = {
    firmName: "Apex Supermarket",
    ownerName: "Rajesh Kumar",
    mobileNumber: "+91 98765 43210",
    outletType: "Supermarket",
    interestLevel: "Interested",
    status: "In Progress",
    quotePrice: 45000,
    followUpDate: "2026-10-31",
    followUpTime: "11:30 AM",
    standeeType: "Standard Roll-up",
    followUpRemarks: "Requested catalog",
    feedback: "High footfall store",
    latitude: 23.3441,
    longitude: 85.3096,
    locationAddress: "Kadru, Ranchi",
  };

  test("accepts completely valid report input", () => {
    const parsed = reportInputSchema.safeParse(validReport);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.firmName, "Apex Supermarket");
      assert.equal(parsed.data.quotePrice, 45000);
    }
  });

  test("rejects missing required fields", () => {
    const invalid = { ...validReport, firmName: "   " };
    const parsed = reportInputSchema.safeParse(invalid);
    assert.equal(parsed.success, false);

    const missingOwner = { ...validReport, ownerName: "" };
    assert.equal(reportInputSchema.safeParse(missingOwner).success, false);

    const missingMobile = { ...validReport, mobileNumber: "" };
    assert.equal(reportInputSchema.safeParse(missingMobile).success, false);
  });

  test("rejects invalid mobile numbers containing illegal characters", () => {
    const invalid = { ...validReport, mobileNumber: "call-me-maybe" };
    const parsed = reportInputSchema.safeParse(invalid);
    assert.equal(parsed.success, false);
  });

  test("rejects invalid outlet types not in enum", () => {
    const invalid = { ...validReport, outletType: "IllegalType" };
    const parsed = reportInputSchema.safeParse(invalid);
    assert.equal(parsed.success, false);
  });

  test("rejects negative quote price", () => {
    const invalid = { ...validReport, quotePrice: -500 };
    const parsed = reportInputSchema.safeParse(invalid);
    assert.equal(parsed.success, false);
  });

  test("rejects invalid date format (must be YYYY-MM-DD)", () => {
    const invalid = { ...validReport, followUpDate: "31-10-2026" };
    const parsed = reportInputSchema.safeParse(invalid);
    assert.equal(parsed.success, false);
  });

  test("allows partial update validation for update operations", () => {
    const partialUpdate = { status: "Completed" };
    const parsed = reportInputSchema.partial().safeParse(partialUpdate);
    assert.equal(parsed.success, true);
  });
});

