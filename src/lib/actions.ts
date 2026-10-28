"use server";

import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Report } from "@/models/Report";
import { ReportItem } from "@/components/DataTable";
import { revalidatePath } from "next/cache";

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
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : (doc.createdAt || new Date().toISOString()),
  };
}

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    await connectDB();

    const [totalReports, interestedOutlets, pendingFollowUps, todayRaw, upcomingRaw] =
      await Promise.all([
        Report.countDocuments(),
        Report.countDocuments({ interestLevel: "Interested" }),
        Report.countDocuments({
          status: { $ne: "Completed" },
          followUpDate: { $ne: null, $exists: true },
        }),
        Report.find({ followUpDate: today })
          .sort({ status: 1, followUpTime: 1 })
          .lean(),
        Report.find({
          followUpDate: { $gt: today },
        })
          .sort({ followUpDate: 1, followUpTime: 1 })
          .limit(8)
          .lean(),
      ]);

    return {
      totalReports,
      interestedOutlets,
      pendingFollowUps,
      todayFollowUps: todayRaw.map(serializeReport),
      upcomingFollowUps: upcomingRaw.map(serializeReport),
      todayDate: today,
    };
  } catch (error: any) {
    console.error("MongoDB connection error in getDashboardStats:", error.message);
    return {
      totalReports: 0,
      interestedOutlets: 0,
      pendingFollowUps: 0,
      todayFollowUps: [],
      upcomingFollowUps: [],
      todayDate: today,
      error: error.message || "Could not connect to MongoDB database.",
    };
  }
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
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      query.$or = [
        { firmName: regex },
        { ownerName: regex },
        { mobileNumber: regex },
      ];
    }

    if (interest && interest !== "All") {
      query.interestLevel = interest;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (outletType && outletType !== "All") {
      query.outletType = outletType;
    }

    if (date) {
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
  } catch (error: any) {
    console.error("MongoDB connection error in getReports:", error.message);
    return {
      reports: [],
      total: 0,
      page,
      limit,
      totalPages: 1,
      error: error.message || "Failed to load reports from database.",
    };
  }
}

export async function getReportById(id: string): Promise<ReportItem | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const report = await Report.findById(id).lean();
  return report ? serializeReport(report) : null;
}

export async function createReport(data: ReportFormData) {
  await connectDB();
  const newReport = await Report.create({
    firmName: data.firmName,
    ownerName: data.ownerName,
    mobileNumber: data.mobileNumber,
    outletType: data.outletType,
    interestLevel: data.interestLevel,
    status: data.status || "Pending",
    quotePrice: data.quotePrice ? Number(data.quotePrice) : null,
    followUpDate: data.followUpDate || null,
    followUpTime: data.followUpTime || null,
    standeeType: data.standeeType || "None",
    followUpRemarks: data.followUpRemarks || null,
    feedback: data.feedback || null,
    outletImage: data.outletImage || null,
    latitude: data.latitude ? Number(data.latitude) : null,
    longitude: data.longitude ? Number(data.longitude) : null,
    locationAddress: data.locationAddress || null,
  });

  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true, report: serializeReport(newReport) };
}

export async function updateReport(id: string, data: Partial<ReportFormData>) {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { ...data };
  if (data.quotePrice !== undefined) {
    updateData.quotePrice = data.quotePrice ? Number(data.quotePrice) : null;
  }
  if (data.latitude !== undefined) {
    updateData.latitude = data.latitude ? Number(data.latitude) : null;
  }
  if (data.longitude !== undefined) {
    updateData.longitude = data.longitude ? Number(data.longitude) : null;
  }

  const updatedReport = await Report.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).lean();

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath(`/reports/${id}`);
  return { success: true, report: serializeReport(updatedReport) };
}

export async function updateReportStatus(id: string, status: string) {
  await connectDB();
  const updatedReport = await Report.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  ).lean();

  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true, report: serializeReport(updatedReport) };
}

export async function deleteReport(id: string) {
  await connectDB();
  await Report.findByIdAndDelete(id);

  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true };
}
