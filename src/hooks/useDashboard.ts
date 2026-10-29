"use client";

import { useState } from "react";
import { ReportItem } from "@/components/DataTable";
import { updateReportStatus } from "@/lib/actions";

export interface DashboardStats {
  totalReports: number;
  interestedOutlets: number;
  pendingFollowUps: number;
  allReports?: ReportItem[];
  interestedReports?: ReportItem[];
  allPendingFollowUps?: ReportItem[];
  todayFollowUps: ReportItem[];
  upcomingFollowUps: ReportItem[];
  todayDate: string;
  error?: string;
}

export type StatCardView = "total" | "interested" | "upcoming";
export type UpcomingTab = "all" | "today" | "upcoming";

export function useDashboard(stats: DashboardStats) {
  const [selectedCard, setSelectedCard] = useState<StatCardView>("total");
  const [upcomingTab, setUpcomingTab] = useState<UpcomingTab>("all");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const [allReports, setAllReports] = useState<ReportItem[]>(
    stats.allReports || []
  );
  const [interestedReports, setInterestedReports] = useState<ReportItem[]>(
    stats.interestedReports || []
  );
  const [allPendingFollowUps, setAllPendingFollowUps] = useState<ReportItem[]>(
    stats.allPendingFollowUps || []
  );
  const [todayFollowUps, setTodayFollowUps] = useState<ReportItem[]>(
    stats.todayFollowUps || []
  );
  const [upcomingFollowUps, setUpcomingFollowUps] = useState<ReportItem[]>(
    stats.upcomingFollowUps || []
  );

  const handleQuickStatus = async (id: string, newStatus: string) => {
    await updateReportStatus(id, newStatus);
    const updateFn = (prev: ReportItem[]) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r));

    setAllReports(updateFn);
    setInterestedReports(updateFn);
    setAllPendingFollowUps(updateFn);
    setTodayFollowUps(updateFn);
    setUpcomingFollowUps(updateFn);
  };

  const currentList =
    selectedCard === "total"
      ? allReports
      : selectedCard === "interested"
      ? interestedReports
      : upcomingTab === "all"
      ? allPendingFollowUps
      : upcomingTab === "today"
      ? todayFollowUps
      : upcomingFollowUps;

  const exportTitle =
    selectedCard === "total"
      ? "Total Reports Summary"
      : selectedCard === "interested"
      ? "Interested Outlets Report"
      : "Upcoming Follow-ups Schedule";

  const filenamePrefix =
    selectedCard === "total"
      ? "dsr-total-reports"
      : selectedCard === "interested"
      ? "dsr-interested-outlets"
      : "dsr-upcoming-followups";

  const getFollowUpType = (
    dateStr?: string | null
  ): "today" | "upcoming" | "past" | null => {
    if (!dateStr) return null;
    if (dateStr === stats.todayDate) return "today";
    if (dateStr > stats.todayDate) return "upcoming";
    return "past";
  };

  return {
    selectedCard,
    setSelectedCard,
    upcomingTab,
    setUpcomingTab,
    selectedReport,
    setSelectedReport,
    currentList,
    allReports,
    interestedReports,
    allPendingFollowUps,
    todayFollowUps,
    upcomingFollowUps,
    exportTitle,
    filenamePrefix,
    handleQuickStatus,
    getFollowUpType,
  };
}

