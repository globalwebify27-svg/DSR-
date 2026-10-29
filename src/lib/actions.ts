"use server";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Report } from "@/models/Report";
import { ReportItem } from "@/components/DataTable";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth-util";
import { revalidatePath, updateTag } from "next/cache";
import { reportInputSchema } from "@/lib/validations";

export interface ReportFormData {
  firmName: string;
  ownerName: string;
  mobileNumber: string;
  outletType: string;
  interestLevel: string;
  status?: string;
  quotePrice?: number | null;
  followUpDate?: string | null;
  followUpTime?: string | null;
  standeeType?: string | null;
  followUpRemarks?: string | null;
  feedback?: string | null;
  outletImage?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationAddress?: string | null;
}

// Enforce authentication on all server-side operations
async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const isValid = await verifySessionToken(token);
  if (!isValid) {
    throw new Error("Unauthorized: Session is invalid or expired. Please sign in.");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeReport(doc: any): ReportItem {
  return {
    id: doc._id ? doc._id.toString() : String(doc.id),
    firmName: doc.firmName,
    ownerName: doc.ownerName,
    mobileNumber: doc.mobileNumber,
    outletType: doc.outletType,
    interestLevel: doc.interestLevel,
    status: doc.status || "Pending",
    quotePrice: doc.quotePrice ?? null,
    followUpDate: doc.followUpDate ?? null,
    followUpTime: doc.followUpTime ?? null,
    standeeType: doc.standeeType ?? "None",
    followUpRemarks: doc.followUpRemarks ?? null,
    feedback: doc.feedback ?? null,
    outletImage: doc.outletImage ?? null,
    latitude: doc.latitude ?? null,
    longitude: doc.longitude ?? null,
    locationAddress: doc.locationAddress ?? null,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : doc.createdAt || new Date().toISOString(),
  };
}

export async function getDashboardStats() {
  await requireAuth();

  const cachedFetch = unstable_cache(
    async () => {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      try {
        await connectDB();

        const [
          totalReports,
          interestedOutlets,
          upcomingCount,
          allReportsRaw,
          interestedRaw,
          allUpcomingRaw,
          todayRaw,
          futureRaw,
        ] = await Promise.all([
          Report.countDocuments(),
          Report.countDocuments({ interestLevel: "Interested" }),
          Report.countDocuments({
            followUpDate: { $gte: today },
          }),
          Report.find().sort({ createdAt: -1 }).limit(100).lean(),
          Report.find({ interestLevel: "Interested" }).sort({ createdAt: -1 }).limit(100).lean(),
          Report.find({
            followUpDate: { $gte: today },
          })
            .sort({ followUpDate: 1, followUpTime: 1 })
            .lean(),
          Report.find({
            followUpDate: today,
          })
            .sort({ followUpTime: 1 })
            .lean(),
          Report.find({
            followUpDate: { $gt: today },
          })
            .sort({ followUpDate: 1, followUpTime: 1 })
            .lean(),
        ]);

        return {
          totalReports,
          interestedOutlets,
          pendingFollowUps: upcomingCount,
          allReports: allReportsRaw.map(serializeReport),
          interestedReports: interestedRaw.map(serializeReport),
          allPendingFollowUps: allUpcomingRaw.map(serializeReport),
          todayFollowUps: todayRaw.map(serializeReport),
          upcomingFollowUps: futureRaw.map(serializeReport),
          todayDate: today,
        };
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("MongoDB error in getDashboardStats:", msg);
        const today = new Date().toISOString().split("T")[0];
        return {
          totalReports: 0,
          interestedOutlets: 0,
          pendingFollowUps: 0,
          allReports: [],
          interestedReports: [],
          allPendingFollowUps: [],
          todayFollowUps: [],
          upcomingFollowUps: [],
          todayDate: today,
          error: "Unable to connect to database. Please check connection settings.",
        };
      }
    },
    ["dashboard-stats"],
    { revalidate: 30, tags: ["reports"] }
  );

  return cachedFetch();
}

export async function getReports({
  page = 1,
  limit = 10,
  search = "",
  interest = "All",
  status = "All",
  outletType = "All",
  date = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  interest?: string;
  status?: string;
  outletType?: string;
  date?: string;
}) {
  await requireAuth();

  const cachedFetch = unstable_cache(
    async () => {
      try {
        await connectDB();
        const skip = (page - 1) * limit;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (typeof search === "string" && search.trim()) {
          const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(escaped, "i");
          query.$or = [
            { firmName: regex },
            { ownerName: regex },
            { mobileNumber: regex },
          ];
        }

        if (typeof interest === "string" && interest && interest !== "All") {
          query.interestLevel = interest;
        }

        if (typeof status === "string" && status && status !== "All") {
          query.status = status;
        }

        if (typeof outletType === "string" && outletType && outletType !== "All") {
          query.outletType = outletType;
        }

        if (typeof date === "string" && date) {
          query.followUpDate = date;
        }

        const [rawReports, total] = await Promise.all([
          Report.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
          Report.countDocuments(query),
        ]);

        const reports = rawReports.map(serializeReport);

        return {
          reports,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("MongoDB error in getReports:", msg);
        return {
          reports: [],
          total: 0,
          page,
          limit,
          totalPages: 1,
          error: "Failed to load reports from database.",
        };
      }
    },
    ["reports", String(page), String(limit), search, interest, status, outletType, date],
    { revalidate: 30, tags: ["reports"] }
  );

  return cachedFetch();
}

export async function getReportById(id: string): Promise<ReportItem | null> {
  await requireAuth();
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const report = await Report.findById(id).lean();
  return report ? serializeReport(report) : null;
}

export async function createReport(data: ReportFormData) {
  await requireAuth();
  await connectDB();

  // Validate input schema with Zod
  const validated = reportInputSchema.parse(data);

  const newReport = await Report.create({
    firmName: validated.firmName,
    ownerName: validated.ownerName,
    mobileNumber: validated.mobileNumber,
    outletType: validated.outletType,
    interestLevel: validated.interestLevel,
    status: validated.status,
    quotePrice: validated.quotePrice ?? null,
    followUpDate: validated.followUpDate || null,
    followUpTime: validated.followUpTime || null,
    standeeType: validated.standeeType || "None",
    followUpRemarks: validated.followUpRemarks || null,
    feedback: validated.feedback || null,
    outletImage: validated.outletImage || null,
    latitude: validated.latitude ?? null,
    longitude: validated.longitude ?? null,
    locationAddress: validated.locationAddress || null,
  });

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath("/calendar");
  updateTag("reports");
  return { success: true, report: serializeReport(newReport) };
}

export async function updateReport(id: string, data: Partial<ReportFormData>) {
  await requireAuth();
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid report ID");
  }

  // Validate partial input with Zod
  const validated = reportInputSchema.partial().parse(data);

  const updatedReport = await Report.findByIdAndUpdate(
    id,
    { $set: validated },
    { new: true }
  ).lean();

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath("/calendar");
  revalidatePath(`/reports/${id}`);
  updateTag("reports");
  return { success: true, report: serializeReport(updatedReport) };
}

export async function updateReportStatus(id: string, status: string) {
  await requireAuth();
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid report ID");
  }

  const updatedReport = await Report.findByIdAndUpdate(
    id,
    { $set: { status: String(status) } },
    { new: true }
  ).lean();

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath("/calendar");
  updateTag("reports");
  return { success: true, report: serializeReport(updatedReport) };
}

export async function deleteReport(id: string) {
  await requireAuth();
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid report ID");
  }

  await Report.findByIdAndDelete(id);

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath("/calendar");
  updateTag("reports");
  return { success: true };
}

export async function getAllScheduledReports(): Promise<ReportItem[]> {
  await requireAuth();

  const cachedFetch = unstable_cache(
    async () => {
      try {
        await connectDB();
        const reports = await Report.find({
          followUpDate: { $ne: null, $exists: true, $nin: ["", null] },
        })
          .sort({ followUpDate: 1, followUpTime: 1 })
          .lean();

        return reports.map(serializeReport);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Failed to fetch scheduled reports:", msg);
        return [];
      }
    },
    ["scheduled-reports"],
    { revalidate: 30, tags: ["reports"] }
  );

  return cachedFetch();
}
