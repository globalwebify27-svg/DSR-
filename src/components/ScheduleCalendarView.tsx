"use client";

import React, { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  Eye,
  CheckCircle2,
  MapPin,
  Plus
} from "lucide-react";
import Link from "next/link";
import { ReportItem } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { ReportDetailModal } from "@/components/ReportDetailModal";
import {
  useCalendarSchedule,
  MONTH_NAMES,
  DAY_NAMES,
} from "@/hooks/useCalendarSchedule";
import { formatDate, formatTime } from "@/lib/formatters";

interface ScheduleCalendarViewProps {
  reports: ReportItem[];
}

export function ScheduleCalendarView({ reports }: ScheduleCalendarViewProps) {
  const {
    currentYear,
    currentMonth,
    selectedDateStr,
    setSelectedDateStr,
    selectedReport,
    setSelectedReport,
    calendarDays,
    reportsByDate,
    selectedReports,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleStatusChange,
  } = useCalendarSchedule(reports);

  // Formatted date string for selected header
  const formattedSelectedDate = useMemo(() => {
    try {
      const [y, m, d] = selectedDateStr.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return formatDate(selectedDateStr);
    }
  }, [selectedDateStr]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-8">
      {/* 1. Header Controls (Compact Single Row on Mobile) */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 sm:px-5 sm:py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 text-[#737784] hover:text-[#171923] hover:bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <h2 className="text-sm sm:text-base font-bold text-[#171923] min-w-[130px] sm:min-w-[160px] text-center">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 text-[#737784] hover:text-[#171923] hover:bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-[#171923] bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] rounded-md transition-colors cursor-pointer"
          >
            Today
          </button>
          <Link
            href={`/reports/new?date=${selectedDateStr}`}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Task</span>
          </Link>
        </div>
      </div>

      {/* 2. Calendar Grid */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
        {/* Day Header Row */}
        <div className="grid grid-cols-7 border-b border-[#E5E7EB] bg-[#F8F9FA] text-center text-xs font-semibold text-[#737784]">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-2.5 sm:py-3 border-r border-[#E5E7EB] last:border-r-0">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((cDay, idx) => {
            const isSelected = cDay.dateStr === selectedDateStr;
            const dayReports = reportsByDate.get(cDay.dateStr) || [];
            const hasReports = dayReports.length > 0;

            return (
              <button
                key={`${cDay.dateStr}-${idx}`}
                type="button"
                onClick={() => setSelectedDateStr(cDay.dateStr)}
                className={`relative text-left p-1 sm:p-2 border-b border-r border-[#E5E7EB] transition-colors cursor-pointer min-h-[46px] sm:min-h-[92px] flex flex-col justify-between ${
                  !cDay.isCurrentMonth
                    ? "bg-[#FAFAFA] text-[#A0AEC0]"
                    : "bg-white text-[#171923]"
                } ${
                  isSelected
                    ? "ring-2 ring-inset ring-[#FF5722] z-10 bg-orange-50/20"
                    : "hover:bg-[#F9FAFB]"
                }`}
              >
                {/* Day Number Header */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-semibold rounded-full w-6 h-6 leading-none ${
                      cDay.isToday
                        ? "bg-[#FF5722] text-white"
                        : isSelected
                        ? "text-[#FF5722] font-bold"
                        : ""
                    }`}
                  >
                    {cDay.day}
                  </span>

                  {hasReports && (
                    <span className="bg-orange-100 text-[#E64A19] font-bold text-[10px] px-1.5 py-0.2 rounded-full leading-tight">
                      {dayReports.length}
                    </span>
                  )}
                </div>

                {/* Mobile view (< sm): show subtle colored dots */}
                {hasReports && (
                  <div className="sm:hidden flex items-center justify-center gap-1 mt-1">
                    {dayReports.slice(0, 3).map((r) => (
                      <span
                        key={r.id}
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          r.status === "Completed"
                            ? "bg-emerald-500"
                            : "bg-[#FF5722]"
                        }`}
                      />
                    ))}
                    {dayReports.length > 3 && (
                      <span className="text-[9px] text-[#737784] font-bold">
                        +{dayReports.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Desktop view (>= sm): show pills */}
                <div className="hidden sm:flex flex-col gap-1 w-full mt-1.5">
                  {dayReports.slice(0, 2).map((r) => (
                    <div
                      key={r.id}
                      className={`text-[11px] truncate px-1.5 py-0.5 rounded border leading-tight ${
                        r.status === "Completed"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800 line-through"
                          : "bg-orange-50 border-orange-200 text-[#171923]"
                      }`}
                      title={`${r.firmName} (${r.followUpTime || "No time"})`}
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF5722] mr-1" />
                      {r.firmName}
                    </div>
                  ))}
                  {dayReports.length > 2 && (
                    <span className="text-[10px] text-[#737784] font-medium pl-1">
                      +{dayReports.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detail Pane for Selected Date */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[#E5E7EB] bg-[#F8F9FA] flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#171923]">
              Schedule for {formattedSelectedDate}
            </h3>
            <p className="text-xs text-[#737784] mt-0.5">
              {selectedReports.length === 0
                ? "No follow-up visits scheduled for this date"
                : `${selectedReports.length} customer visit${
                    selectedReports.length > 1 ? "s" : ""
                  } scheduled`}
            </p>
          </div>

          <Link
            href={`/reports/new?date=${selectedDateStr}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </Link>
        </div>

        {selectedReports.length === 0 ? (
          <div className="py-12 px-4 text-center text-xs text-[#737784]">
            <p>No customer follow-ups on this day.</p>
            <Link
              href={`/reports/new?date=${selectedDateStr}`}
              className="text-[#FF5722] hover:underline font-semibold inline-block mt-2"
            >
              + Schedule visit on {formatDate(selectedDateStr)}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {selectedReports.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="space-y-1 sm:max-w-md">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-[#171923]">
                      {item.firmName}
                    </h4>
                    <StatusBadge type="interest" value={item.interestLevel} />
                  </div>

                  <p className="text-xs text-[#737784]">
                    {item.ownerName} • <span className="font-medium text-[#4B5563]">{item.outletType}</span>
                  </p>

                  {item.locationAddress && (
                    <p className="text-[11px] text-[#737784] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF5722] shrink-0" />
                      <span className="truncate">{item.locationAddress}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="flex items-center gap-3 text-xs">
                    <a
                      href={`tel:${item.mobileNumber}`}
                      className="inline-flex items-center gap-1 font-medium text-[#171923] hover:text-[#FF5722] bg-[#F8F9FA] px-2.5 py-1 rounded border border-[#E5E7EB]"
                    >
                      <Phone className="w-3 h-3 text-[#FF5722]" />
                      {item.mobileNumber}
                    </a>

                    {item.followUpTime && (
                      <span className="text-[11px] font-medium text-[#737784] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF5722]" />
                        {formatTime(item.followUpTime)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge type="status" value={item.status} />

                    <button
                      type="button"
                      onClick={() => setSelectedReport(item)}
                      className="px-2.5 py-1 text-xs text-[#171923] bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] rounded transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Eye className="w-3 h-3 text-[#737784]" />
                      Details
                    </button>

                    {item.status !== "Completed" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, "Completed")}
                        className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
