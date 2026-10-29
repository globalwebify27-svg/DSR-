"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ReportItem } from "@/components/DataTable";
import { getReports, updateReportStatus, deleteReport } from "@/lib/actions";

export interface UseReportsProps {
  initialReports: ReportItem[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
  initialTotalPages: number;
  initialExecutives?: string[];
}

export function useReports({
  initialReports,
  initialTotal,
  initialPage,
  initialLimit,
  initialTotalPages,
  initialExecutives = [],
}: UseReportsProps) {
  const router = useRouter();

  // Filters state initialized from initial values
  const [search, setSearch] = useState("");
  const [interest, setInterest] = useState("All");
  const [status, setStatus] = useState("All");
  const [outletType, setOutletType] = useState("All");
  const [date, setDate] = useState("");
  const [executive, setExecutive] = useState("All");
  const [executiveOptions] = useState<string[]>(initialExecutives);
  const [page, setPage] = useState(initialPage);

  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isPending, startTransition] = useTransition();
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // Fetch updated records on filter / search / page change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await getReports({
          page,
          limit: initialLimit,
          search,
          interest,
          status,
          outletType,
          date,
          executive,
        });
        setReports(res.reports);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [search, interest, status, outletType, date, executive, page, initialLimit]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateReportStatus(id, newStatus);
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
  };

  const handleResetFilters = () => {
    setSearch("");
    setInterest("All");
    setStatus("All");
    setOutletType("All");
    setDate("");
    setExecutive("All");
    setPage(1);
    router.replace("/reports");
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleInterestChange = (val: string) => {
    setInterest(val);
    setPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handleOutletTypeChange = (val: string) => {
    setOutletType(val);
    setPage(1);
  };

  const handleExecutiveChange = (val: string) => {
    setExecutive(val);
    setPage(1);
  };

  const handleDateChange = (val: string) => {
    setDate(val);
    setPage(1);
  };

  return {
    reports,
    total,
    page,
    totalPages,
    isPending,
    selectedReport,
    setSelectedReport,
    search,
    interest,
    status,
    outletType,
    executive,
    executiveOptions,
    date,
    setPage,
    handleSearchChange,
    handleInterestChange,
    handleStatusFilterChange,
    handleOutletTypeChange,
    handleExecutiveChange,
    handleDateChange,
    handleStatusChange,
    handleDelete,
    handleResetFilters,
  };
}

