"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "./PageHeader";
import { SearchInput } from "./SearchInput";
import { FilterPanel } from "./FilterPanel";
import { DataTable, ReportItem } from "./DataTable";
import { Pagination } from "./Pagination";
import { ReportDetailModal } from "./ReportDetailModal";
import { getReports, updateReportStatus, deleteReport } from "@/lib/actions";

interface ReportsViewProps {
  initialReports: ReportItem[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
  initialTotalPages: number;
}

export function ReportsView({
  initialReports,
  initialTotal,
  initialPage,
  initialLimit,
  initialTotalPages,
}: ReportsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters state initialized from URL search params if present
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [interest, setInterest] = useState(searchParams.get("interest") || "All");
  const [status, setStatus] = useState(searchParams.get("status") || "All");
  const [outletType, setOutletType] = useState(searchParams.get("outletType") || "All");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [page, setPage] = useState(initialPage);

  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isPending, startTransition] = useTransition();
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // Sync state if URL query params change (e.g. from sidebar clicks like ?status=Pending)
  useEffect(() => {
    const urlStatus = searchParams.get("status") || "All";
    const urlInterest = searchParams.get("interest") || "All";
    const urlSearch = searchParams.get("search") || "";
    setStatus(urlStatus);
    setInterest(urlInterest);
    setSearch(urlSearch);
  }, [searchParams]);

  // Fetch updated records on filter / search / page change
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
        });
        setReports(res.reports);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [search, interest, status, outletType, date, page, initialLimit]);

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
    setPage(1);
    router.replace("/reports");
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="DSR Reports"
        badge={total}
        subtitle="Manage and track all customer outlets, visit status, and quotations"
        actionText="Add Report"
        actionHref="/reports/new"
      />

      {/* Search Bar & Quick Filters Area */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4 shadow-2xs">
        <div className="max-w-md">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        {/* Filter Panel (Interest tabs, status, outlet type, date) */}
        <FilterPanel
          currentInterest={interest}
          onInterestChange={(i) => {
            setInterest(i);
            setPage(1);
          }}
          currentStatus={status}
          onStatusChange={(s) => {
            setStatus(s);
            setPage(1);
          }}
          currentOutletType={outletType}
          onOutletTypeChange={(t) => {
            setOutletType(t);
            setPage(1);
          }}
          currentDate={date}
          onDateChange={(d) => {
            setDate(d);
            setPage(1);
          }}
          onReset={handleResetFilters}
        />
      </div>

      {/* Reports Data Table */}
      <div className="space-y-0">
        <DataTable
          reports={reports}
          isLoading={isPending}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onViewDetails={(item) => setSelectedReport(item)}
        />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={initialLimit}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
