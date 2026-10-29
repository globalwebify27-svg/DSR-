"use client";

import { useState, useMemo } from "react";
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
  const [selectedExecutive, setSelectedExecutive] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  // Extract unique executives dynamically across all loaded reports
  const executives = useMemo(() => {
    const set = new Set<string>();
    allReports.forEach((r) => {
      const exec = r.reportedBy?.trim();
      if (exec) set.add(exec);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allReports]);

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

  const rawList =
    selectedCard === "total"
      ? allReports
      : selectedCard === "interested"
      ? interestedReports
      : upcomingTab === "all"
      ? allPendingFollowUps
      : upcomingTab === "today"
      ? todayFollowUps
      : upcomingFollowUps;

  // Filter current active view by selected executive and search query
  const currentList = useMemo(() => {
    let list = rawList;
    if (selectedExecutive !== "All") {
      list = list.filter(
        (item) => item.reportedBy?.trim() === selectedExecutive
      );
    }
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter((item) => {
        const firm = item.firmName?.toLowerCase() || "";
        const owner = item.ownerName?.toLowerCase() || "";
        const mobile = item.mobileNumber?.toLowerCase() || "";
        const exec = item.reportedBy?.toLowerCase() || "";
        const type = item.outletType?.toLowerCase() || "";
        const location = item.locationAddress?.toLowerCase() || "";
        const notes = item.feedback?.toLowerCase() || "";
        const remarks = item.followUpRemarks?.toLowerCase() || "";
        return (
          firm.includes(q) ||
          owner.includes(q) ||
          mobile.includes(q) ||
          exec.includes(q) ||
          type.includes(q) ||
          location.includes(q) ||
          notes.includes(q) ||
          remarks.includes(q)
        );
      });
    }
    return list;
  }, [rawList, selectedExecutive, searchTerm]);

  const exportTitle = useMemo(() => {
    const base =
      selectedCard === "total"
        ? "Total Reports"
        : selectedCard === "interested"
        ? "Interested Outlets"
        : "Upcoming Follow-ups";

    const parts: string[] = [base];
    if (selectedExecutive !== "All") {
      parts.push(`Executive: ${selectedExecutive}`);
    }
    if (searchTerm.trim()) {
      parts.push(`Search: "${searchTerm.trim()}"`);
    }
    return parts.join(" — ");
  }, [selectedCard, selectedExecutive, searchTerm]);

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
    selectedExecutive,
    setSelectedExecutive,
    searchTerm,
    setSearchTerm,
    executives,
    rawListCount: rawList.length,
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

