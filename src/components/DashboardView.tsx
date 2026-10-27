"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Heart,
  Clock,
  Calendar,
  Phone,
  Eye,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { PageHeader } from "./PageHeader";
import { StatCard } from "./StatCard";
import { StatusBadge } from "./StatusBadge";
import { ReportItem } from "./DataTable";
import { ReportDetailModal } from "./ReportDetailModal";
import { updateReportStatus } from "@/lib/actions";

interface DashboardViewProps {
  stats: {
    totalReports: number;
    interestedOutlets: number;
    pendingFollowUps: number;
    todayFollowUps: ReportItem[];
    upcomingFollowUps: ReportItem[];
    todayDate: string;
  };
}

export function DashboardView({ stats }: DashboardViewProps) {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "upcoming">("today");
  const [todayFollowUps, setTodayFollowUps] = useState<ReportItem[]>(stats.todayFollowUps);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState<ReportItem[]>(stats.upcomingFollowUps);

  const handleQuickStatus = async (id: string, newStatus: string) => {
    await updateReportStatus(id, newStatus);
    setTodayFollowUps((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setUpcomingFollowUps((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const currentList = activeTab === "today" ? todayFollowUps : upcomingFollowUps;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Sales Dashboard"
        subtitle="Daily performance metrics and scheduled outlet follow-ups"
        actionText="Add Report"
        actionHref="/reports/new"
      />

      {/* 3 Compact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title="Total Reports"
          value={stats.totalReports}
          icon={FileText}
          subtitle="All recorded outlets"
        />
        <StatCard
          title="Interested Outlets"
          value={stats.interestedOutlets}
          icon={Heart}
          subtitle="High conversion potential"
          highlight
        />
        <StatCard
          title="Pending Follow-ups"
          value={stats.pendingFollowUps}
          icon={Clock}
          subtitle="Active pipeline calls/visits"
        />
      </div>

      {/* Follow-up Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-2xs">
        {/* Table Header with Today / Upcoming Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:px-5 sm:py-3.5 border-b border-[#E5E7EB] bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FF5722]" />
            <h2 className="text-xs font-bold text-[#171923] uppercase tracking-wider">
              Follow-up Schedule
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-[#E5E7EB] w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={() => setActiveTab("today")}
              className={`flex-1 sm:flex-initial px-3 py-1.5 sm:py-1 text-xs font-medium rounded transition-colors text-center cursor-pointer ${
                activeTab === "today"
                  ? "bg-[#FF5722] text-white"
                  : "text-[#737784] hover:text-[#171923]"
              }`}
            >
              Today's Tasks ({todayFollowUps.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 sm:flex-initial px-3 py-1.5 sm:py-1 text-xs font-medium rounded transition-colors text-center cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-[#FF5722] text-white"
                  : "text-[#737784] hover:text-[#171923]"
              }`}
            >
              Upcoming ({upcomingFollowUps.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {currentList.length === 0 ? (
          <div className="py-12 px-4 text-center text-xs text-[#737784]">
            No {activeTab === "today" ? "follow-ups scheduled for today" : "upcoming follow-ups"}.
            <div className="mt-2">
              <Link
                href="/reports/new"
                className="text-[#FF5722] hover:underline font-medium inline-flex items-center gap-1"
              >
                Schedule a new follow-up <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card List (< md) */}
            <div className="md:hidden divide-y divide-[#E5E7EB]">
              {currentList.map((item) => (
                <div key={item.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-[#171923]">{item.firmName}</h3>
                      <p className="text-xs text-[#737784] mt-0.5">
                        {item.ownerName} • <span className="font-medium text-[#4B5563]">{item.outletType}</span>
                      </p>
                    </div>
                    <StatusBadge type="interest" value={item.interestLevel} />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <a
                      href={`tel:${item.mobileNumber}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#171923] hover:text-[#FF5722] bg-[#F8F9FA] px-2 py-1 rounded border border-[#E5E7EB]"
                    >
                      <Phone className="w-3 h-3 text-[#FF5722]" />
                      {item.mobileNumber}
                    </a>
                    <div className="text-right text-[11px] text-[#737784]">
                      <span className="font-medium text-[#171923] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#FF5722]" />
                        {item.followUpDate || "Today"}
                      </span>
                      {item.followUpTime && <span>{item.followUpTime}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <StatusBadge type="status" value={item.status} />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(item)}
                        className="px-2.5 py-1 text-xs text-[#171923] bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-[#737784]" />
                        Details
                      </button>
                      {item.status !== "Completed" && (
                        <button
                          type="button"
                          onClick={() => handleQuickStatus(item.id, "Completed")}
                          className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
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

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white border-b border-[#E5E7EB] text-[#737784] font-semibold">
                    <th className="py-2.5 px-4">Date & Time</th>
                    <th className="py-2.5 px-4">Firm / Owner</th>
                    <th className="py-2.5 px-4">Mobile</th>
                    <th className="py-2.5 px-4">Interest</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#171923]">
                  {currentList.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-[#171923] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#FF5722]" />
                          {item.followUpDate || "Today"}
                        </div>
                        {item.followUpTime && (
                          <div className="text-[11px] text-[#737784] mt-0.5 ml-5">
                            {item.followUpTime}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#171923] text-sm">
                          {item.firmName}
                        </div>
                        <div className="text-[11px] text-[#737784]">
                          {item.ownerName} • {item.outletType}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <a
                          href={`tel:${item.mobileNumber}`}
                          className="inline-flex items-center text-[#171923] hover:text-[#FF5722] transition-colors"
                        >
                          <Phone className="w-3 h-3 mr-1 text-[#737784]" />
                          {item.mobileNumber}
                        </a>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge type="interest" value={item.interestLevel} />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge type="status" value={item.status} />
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReport(item)}
                            className="px-2.5 py-1 text-xs text-[#171923] bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-[#737784]" />
                            Details
                          </button>

                          {item.status !== "Completed" && (
                            <button
                              type="button"
                              onClick={() => handleQuickStatus(item.id, "Completed")}
                              className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Mark as Completed"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer Link to All Reports */}
        <div className="p-3 sm:px-5 sm:py-2.5 border-t border-[#E5E7EB] bg-[#F8F9FA] flex items-center justify-between text-xs">
          <span className="text-[#737784]">
            Scheduled touchpoints
          </span>
          <Link
            href="/reports"
            className="text-[#FF5722] hover:text-[#E64A19] font-medium inline-flex items-center gap-1"
          >
            View all reports <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Modal View */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
