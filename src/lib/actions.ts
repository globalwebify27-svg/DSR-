"use server";

import { prisma } from "@/lib/prisma";
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

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [totalReports, interestedOutlets, pendingFollowUps, todayFollowUps, upcomingFollowUps] =
    await Promise.all([
      prisma.report.count(),
      prisma.report.count({
        where: { interestLevel: "Interested" },
      }),
      prisma.report.count({
        where: {
          status: { not: "Completed" },
          followUpDate: { not: null },
        },
      }),
      prisma.report.findMany({
        where: {
          followUpDate: today,
        },
        orderBy: [{ status: "asc" }, { followUpTime: "asc" }],
      }),
      prisma.report.findMany({
        where: {
          followUpDate: {
            gt: today,
          },
        },
        orderBy: [{ followUpDate: "asc" }, { followUpTime: "asc" }],
        take: 8,
      }),
    ]);

  return {
    totalReports,
    interestedOutlets,
    pendingFollowUps,
    todayFollowUps,
    upcomingFollowUps,
    todayDate: today,
  };
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
  const skip = (page - 1) * limit;

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search.trim()) {
    where.OR = [
      { firmName: { contains: search.trim() } },
      { ownerName: { contains: search.trim() } },
      { mobileNumber: { contains: search.trim() } },
    ];
  }

  if (interest && interest !== "All") {
    where.interestLevel = interest;
  }

  if (status && status !== "All") {
    where.status = status;
  }

  if (outletType && outletType !== "All") {
    where.outletType = outletType;
  }

  if (date) {
    where.followUpDate = date;
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.report.count({ where }),
  ]);

  return {
    reports,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
  });
}

export async function createReport(data: ReportFormData) {
  const report = await prisma.report.create({
    data: {
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
    },
  });

  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true, report };
}

export async function updateReport(id: string, data: Partial<ReportFormData>) {
  const report = await prisma.report.update({
    where: { id },
    data: {
      ...data,
      quotePrice: data.quotePrice !== undefined ? (data.quotePrice ? Number(data.quotePrice) : null) : undefined,
      latitude: data.latitude !== undefined ? (data.latitude ? Number(data.latitude) : null) : undefined,
      longitude: data.longitude !== undefined ? (data.longitude ? Number(data.longitude) : null) : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath(`/reports/${id}`);
  return { success: true, report };
}

export async function updateReportStatus(id: string, status: string) {
  const report = await prisma.report.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true, report };
}

export async function deleteReport(id: string) {
  await prisma.report.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true };
}
