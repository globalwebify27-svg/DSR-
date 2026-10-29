import { z } from "zod";

export const OUTLET_TYPES = [
  "Retail",
  "Wholesale",
  "Distributor",
  "Supermarket",
  "Pharmacy",
  "Hospital",
  "School",
  "Clinic",
  "Clinics",
  "Other",
] as const;

export const INTEREST_LEVELS = [
  "Interested",
  "Maybe",
  "Not Interested",
] as const;

export const REPORT_STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
] as const;

export const STANDEE_TYPES = [
  "None",
  "Standard Roll-up",
  "Luxury Teardrop",
  "Acrylic Display",
  "Counter Stand",
] as const;

export const reportInputSchema = z.object({
  firmName: z
    .string()
    .trim()
    .min(1, "Firm / Outlet Name is required.")
    .max(120, "Firm name cannot exceed 120 characters."),
  ownerName: z
    .string()
    .trim()
    .min(1, "Owner / Contact Person is required.")
    .max(100, "Owner name cannot exceed 100 characters."),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits."),
  outletType: z.enum(OUTLET_TYPES, {
    message: "Invalid outlet type.",
  }).default("Retail"),
  interestLevel: z.enum(INTEREST_LEVELS, {
    message: "Invalid interest level.",
  }).default("Interested"),
  status: z.enum(REPORT_STATUSES, {
    message: "Invalid status value.",
  }).default("Pending"),
  reportedBy: z
    .string()
    .trim()
    .min(1, "Sales Executive name is required.")
    .max(100, "Executive name cannot exceed 100 characters."),
  quotePrice: z
    .number()
    .min(0, "Quote price cannot be negative.")
    .max(100_000_000, "Quote price exceeds maximum allowed value.")
    .nullable()
    .optional(),
  followUpDate: z
    .string()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Follow-up date must be YYYY-MM-DD format.")
    .nullable()
    .optional(),
  followUpTime: z.string().max(30).nullable().optional(),
  standeeType: z.enum(STANDEE_TYPES).default("None").optional(),
  followUpRemarks: z
    .string()
    .max(1000, "Remarks cannot exceed 1000 characters.")
    .nullable()
    .optional(),
  feedback: z
    .string()
    .max(1000, "Feedback cannot exceed 1000 characters.")
    .nullable()
    .optional(),
  outletImage: z
    .string()
    .trim()
    .min(1, "Outlet storefront image is required.")
    .max(2048, "Image URL is too long."),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90.")
    .max(90, "Latitude must be between -90 and 90."),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180.")
    .max(180, "Longitude must be between -180 and 180."),
  locationAddress: z
    .string()
    .trim()
    .min(1, "Location / Place Name is required.")
    .max(300, "Location address cannot exceed 300 characters."),
});

export type ValidatedReportInput = z.infer<typeof reportInputSchema>;
