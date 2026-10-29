import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { reportInputSchema } from "../src/lib/validations.js";

describe("Report Input Validation (Zod Schema)", () => {
  const validReport = {
    firmName: "Apex Supermarket",
    ownerName: "Rajesh Kumar",
    mobileNumber: "9876543210",
    outletType: "Supermarket",
    interestLevel: "Interested",
    status: "In Progress",
    reportedBy: "Rohan Verma",
    quotePrice: 45000,
    followUpDate: "2026-10-31",
    followUpTime: "11:30 AM",
    standeeType: "Standard Roll-up",
    followUpRemarks: "Requested catalog",
    feedback: "High footfall store",
    outletImage: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
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
      assert.equal(parsed.data.reportedBy, "Rohan Verma");
      assert.equal(parsed.data.outletImage, "https://res.cloudinary.com/demo/image/upload/sample.jpg");
    }
  });

  test("accepts custom reportedBy sales executive name", () => {
    const custom = { ...validReport, reportedBy: "Ankit Sharma" };
    const parsed = reportInputSchema.safeParse(custom);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.reportedBy, "Ankit Sharma");
    }
  });

  test("rejects missing mandatory Sales Executive and Media & Location fields", () => {
    // Missing Sales Executive
    const missingExec = { ...validReport, reportedBy: "" };
    assert.equal(reportInputSchema.safeParse(missingExec).success, false);

    // Missing Outlet Image (Media)
    const missingImage = { ...validReport, outletImage: "" };
    assert.equal(reportInputSchema.safeParse(missingImage).success, false);

    // Missing Latitude (Location)
    const missingLat = { ...validReport, latitude: undefined };
    assert.equal(reportInputSchema.safeParse(missingLat).success, false);

    // Missing Longitude (Location)
    const missingLon = { ...validReport, longitude: undefined };
    assert.equal(reportInputSchema.safeParse(missingLon).success, false);

    // Missing Location Address (Location)
    const missingAddress = { ...validReport, locationAddress: "" };
    assert.equal(reportInputSchema.safeParse(missingAddress).success, false);
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

  test("rejects mobile numbers not exactly 10 digits", () => {
    // 9 digits (too short)
    const shortNumber = { ...validReport, mobileNumber: "987654321" };
    assert.equal(reportInputSchema.safeParse(shortNumber).success, false);

    // 11 digits (too long)
    const longNumber = { ...validReport, mobileNumber: "98765432101" };
    assert.equal(reportInputSchema.safeParse(longNumber).success, false);

    // 23 zeros (from user test)
    const excessZeros = { ...validReport, mobileNumber: "00000000000000000000000" };
    assert.equal(reportInputSchema.safeParse(excessZeros).success, false);
  });

  test("accepts new outlet types: Hospital, School, Clinic, Clinics", () => {
    for (const type of ["Hospital", "School", "Clinic", "Clinics"]) {
      const report = { ...validReport, outletType: type };
      const parsed = reportInputSchema.safeParse(report);
      assert.equal(parsed.success, true);
      if (parsed.success) {
        assert.equal(parsed.data.outletType, type);
      }
    }
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

