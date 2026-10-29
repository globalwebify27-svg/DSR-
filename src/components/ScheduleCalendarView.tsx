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
  Plus,
  Calendar as CalendarIcon
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pb-20 sm:pb-8 items-start">
      {/* 2/3 COLUMN (8 cols): Main Interactive Calendar */}
      <div className="lg:col-span-8 xl:col-span-8 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs overflow-hidden">
        {/* Month Header & Controls */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 text-[#737784] hover:text-[#171923] hover:bg-[#F8F9FA] border border-[#E5E7EB] rounded-md transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <h2 className="text-sm sm:text-base font-bold text-[#171923] min-w-[130px] sm:min-w-[150px] text-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 text-[#737784] hover:text-[#171923] hover:bg-[#F8F9FA] border border-[#E5E7EB] rounded-md transition-colors cursor-pointer"
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
              className="inline-flex items-center gap-1 px-3 py-1 sm:py-1.5 text-xs font-semibold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Task</span>
            </Link>
          </div>
        </div>

        {/* Day Header Row */}
        <div className="grid grid-cols-7 border-b border-[#E5E7EB] bg-[#F8F9FA] text-center text-xs font-semibold text-[#737784]">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-2.5 border-r border-[#E5E7EB] last:border-r-0">
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* 7-Column Days Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((cDay, idx) => {
            const isSelected = cDay.dateStr === selectedDateStr;
            const dayReports = reportsByDate.get(cDay.dateStr) || [];
            const hasReports = dayReports.length > 0;

            return (
              <button
                key={`${cDay.dateStr}-${idx}`}
                type="button"
                onClick={() => setSelectedDateStr(cDay.dateStr)}
                className={`relative text-left p-1.5 sm:p-2 border-b border-r border-[#E5E7EB] transition-colors cursor-pointer h-16 sm:h-20 lg:h-22 flex flex-col justify-between ${
                  !cDay.isCurrentMonth
                    ? "bg-[#FAFAFA] text-[#CBD5E1]"
                    : "bg-white text-[#171923]"
                } ${
                  isSelected
                    ? "ring-2 ring-inset ring-[#FF5722] z-10 bg-orange-50/30"
                    : "hover:bg-[#F9FAFB]"
                }`}
              >
                {/* Day Number Header */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-semibold rounded-full w-5 h-5 sm:w-6 sm:h-6 leading-none ${
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

                {/* Mobile View: Colored indicator dots */}
                {hasReports && (
                  <div className="sm:hidden flex items-center justify-center gap-1 mt-auto">
                    {dayReports.slice(0, 3).map((r) => (
                      <span
                        key={r.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          r.status === "Completed"
                            ? "bg-emerald-500"
                            : "bg-[#FF5722]"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Desktop View: Clean task chips */}
                <div className="hidden sm:flex flex-col gap-1 w-full mt-auto">
                  {dayReports.slice(0, 2).map((r) => (
                    <div
                      key={r.id}
                      className={`text-[10px] truncate px-1.5 py-0.5 rounded border leading-tight ${
                        r.status === "Completed"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800 line-through opacity-75"
                          : "bg-orange-50 border-orange-200 text-[#171923]"
                      }`}
                      title={`${r.firmName} (${r.followUpTime || "No time"})`}
                    >
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                          r.status === "Completed"
                            ? "bg-emerald-500"
                            : "bg-[#FF5722]"
                        }`}
                      />
                      {r.firmName}
                    </div>
                  ))}
                  {dayReports.length > 2 && (
                    <span className="text-[9px] text-[#737784] font-medium pl-1 leading-none">
                      +{dayReports.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Calendar Footer Legend */}
        <div className="px-4 py-2.5 bg-[#F8F9FA] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#737784]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5722]" />
              Pending Visits
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Completed Visits
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#171923]">
            {reports.length} total scheduled
          </span>
        </div>
      </div>

      {/* 1/3 COLUMN (4 cols): Schedule Agenda Feed for Selected Date */}
      <div className="lg:col-span-4 xl:col-span-4 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
        {/* Schedule Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#E5E7EB] bg-[#F8F9FA] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-[#FF5722]" />
              <h3 className="text-sm font-bold text-[#171923]">
                Schedule
              </h3>
            </div>
            <p className="text-xs text-[#737784] mt-0.5 font-medium">
              {formattedSelectedDate}
            </p>
          </div>

          <Link
            href={`/reports/new?date=${selectedDateStr}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </Link>
        </div>

        {/* Schedule List */}
        {selectedReports.length === 0 ? (
          <div className="py-12 px-4 text-center text-xs text-[#737784]">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-[#FF5722] flex items-center justify-center mx-auto mb-2.5">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <p className="font-semibold text-[#171923] text-xs">No follow-ups scheduled</p>
            <p className="text-[11px] text-[#737784] mt-0.5">
              No tasks booked for {formatDate(selectedDateStr)}.
            </p>
            <Link
              href={`/reports/new?date=${selectedDateStr}`}
              className="text-xs text-white bg-[#FF5722] hover:bg-[#E64A19] font-medium inline-flex items-center gap-1 px-3 py-1.5 rounded-md mt-3 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule Visit
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB] max-h-[580px] overflow-y-auto">
            {selectedReports.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 space-y-2 hover:bg-[#FAFAFA] transition-colors"
              >
                {/* Firm & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-[#171923] truncate">
                      {item.firmName}
                    </h4>
                    <p className="text-[11px] text-[#737784]">
                      {item.ownerName} &bull; <span className="font-medium text-[#4B5563]">{item.outletType}</span>
                    </p>
                  </div>
                  <StatusBadge type="status" value={item.status} />
                </div>

                {/* Location if present */}
                {item.locationAddress && (
                  <p className="text-[11px] text-[#737784] flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#FF5722] shrink-0" />
                    <span className="truncate">{item.locationAddress}</span>
                  </p>
                )}

                {/* Time & Phone */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {item.followUpTime && (
                      <span className="text-[11px] font-medium text-[#737784] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF5722]" />
                        {formatTime(item.followUpTime)}
                      </span>
                    )}
                    <a
                      href={`tel:${item.mobileNumber}`}
                      className="inline-flex items-center gap-1 font-medium text-[11px] text-[#171923] hover:text-[#FF5722] bg-[#F8F9FA] px-1.5 py-0.5 rounded border border-[#E5E7EB]"
                    >
                      <Phone className="w-2.5 h-2.5 text-[#FF5722]" />
                      {item.mobileNumber}
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(item)}
                      className="p-1 text-[#737784] hover:text-[#171923] hover:bg-[#F8F9FA] border border-[#E5E7EB] rounded transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {item.status !== "Completed" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, "Completed")}
                        className="px-2 py-0.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
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
