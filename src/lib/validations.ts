import { z } from "zod";

export const OUTLET_TYPES = [
  "Retail",
  "Wholesale",
  "Distributor",
  "Supermarket",
  "Pharmacy",
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
    .min(5, "Mobile number is required.")
    .max(25, "Mobile number cannot exceed 25 characters.")
    .regex(/^[+\d\s\-()]+$/, "Mobile number contains invalid characters."),
  outletType: z.enum(OUTLET_TYPES, {
    message: "Invalid outlet type.",
  }).default("Retail"),
  interestLevel: z.enum(INTEREST_LEVELS, {
    message: "Invalid interest level.",
  }).default("Interested"),
  status: z.enum(REPORT_STATUSES, {
    message: "Invalid status value.",
  }).default("Pending"),
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
    .max(2048, "Image URL is too long.")
    .nullable()
    .optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  locationAddress: z
    .string()
    .max(300, "Location address cannot exceed 300 characters.")
    .nullable()
    .optional(),
});

export type ValidatedReportInput = z.infer<typeof reportInputSchema>;
