"use client";

import React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { SearchInput } from "./SearchInput";
import { FilterPanel } from "./FilterPanel";
import { DataTable } from "./DataTable";
import { Pagination } from "./Pagination";
import { ReportDetailModal } from "./ReportDetailModal";
import { ExportDropdown } from "./ExportDropdown";
import { useReports, UseReportsProps } from "@/hooks/useReports";

export function ReportsView(props: UseReportsProps) {
  const {
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
    date,
    setPage,
    handleSearchChange,
    handleInterestChange,
    handleStatusFilterChange,
    handleOutletTypeChange,
    handleDateChange,
    handleStatusChange,
    handleDelete,
    handleResetFilters,
  } = useReports(props);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Reports"
        badge={total}
        actionText="Add Report"
        actionHref="/reports/new"
      >
        <ExportDropdown
          reports={reports}
          title="Field Sales Reports"
          filenamePrefix="dsr-reports"
        />
        <Link
          href="/calendar"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#171923] bg-white hover:bg-[#F8F9FA] border border-[#E5E7EB] rounded-md transition-colors shadow-2xs"
        >
          <Calendar className="w-3.5 h-3.5 text-[#FF5722]" />
          Schedule Calendar
        </Link>
      </PageHeader>

      {/* Search Bar & Quick Filters Area */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4 shadow-2xs">
        <div className="max-w-md">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter Panel */}
        <FilterPanel
          currentInterest={interest}
          onInterestChange={handleInterestChange}
          currentStatus={status}
          onStatusChange={handleStatusFilterChange}
          currentOutletType={outletType}
          onOutletTypeChange={handleOutletTypeChange}
          currentDate={date}
          onDateChange={handleDateChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-2xs overflow-hidden">
        <DataTable
          reports={reports}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onViewDetails={(report) => setSelectedReport(report)}
          isLoading={isPending}
        />

        {/* Pagination */}
        <div className="border-t border-[#E5E7EB] px-4 py-3 bg-[#F8F9FA]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={props.initialLimit}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Details View Modal */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
