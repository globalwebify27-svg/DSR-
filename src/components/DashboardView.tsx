"use client";

import React from "react";
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
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "./PageHeader";
import { StatCard } from "./StatCard";
import { StatusBadge } from "./StatusBadge";
import { ReportDetailModal } from "./ReportDetailModal";
import { ExportDropdown } from "./ExportDropdown";
import { useDashboard, DashboardStats } from "@/hooks/useDashboard";
import { formatDate, formatTime } from "@/lib/formatters";

interface DashboardViewProps {
  stats: DashboardStats;
}

export function DashboardView({ stats }: DashboardViewProps) {
  const {
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
  } = useDashboard(stats);

  const renderFollowUpBadge = (dateStr?: string | null) => {
    const type = getFollowUpType(dateStr);
    if (type === "today") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-[#FF5722] ring-1 ring-inset ring-[#FF5722]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] animate-pulse" />
          Today
        </span>
      );
    }
    if (type === "upcoming") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
          Upcoming
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        actionText="Add Report"
        actionHref="/reports/new"
      >
        <ExportDropdown
          reports={currentList}
          title={exportTitle}
          filenamePrefix={filenamePrefix}
        />
      </PageHeader>

      {/* Database Error Alert */}
      {stats.error && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0 animate-pulse" />
          <div className="text-sm space-y-1">
            <p className="font-semibold">MongoDB Connection Pending</p>
            <p className="text-amber-800 text-xs">{stats.error}</p>
            <p className="text-xs text-amber-700 pt-1">
              Please paste your MongoDB Atlas connection string into{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">
                .env.local
              </code>{" "}
              as{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">
                MONGODB_URI
              </code>
              .
            </p>
          </div>
        </div>
      )}

      {/* 3 Interactive Stat Cards (Compact 3-column row on mobile, spacious grid on desktop) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <StatCard
          title="Total Reports"
          mobileTitle="Total"
          value={stats.totalReports}
          icon={FileText}
          isActive={selectedCard === "total"}
          onClick={() => setSelectedCard("total")}
        />
        <StatCard
          title="Interested Outlets"
          mobileTitle="Interest"
          value={stats.interestedOutlets}
          icon={Heart}
          highlight
          isActive={selectedCard === "interested"}
          onClick={() => setSelectedCard("interested")}
        />
        <StatCard
          title="Upcoming Follow-ups"
          mobileTitle="Pending"
          value={stats.pendingFollowUps}
          icon={Clock}
          isActive={selectedCard === "upcoming"}
          onClick={() => setSelectedCard("upcoming")}
        />
      </div>

      {/* Dynamic List Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        {/* Header with Title and Mode Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 sm:py-4 border-b border-[#E5E7EB] bg-white">
          <div className="flex items-center gap-2.5">
            {selectedCard === "total" && (
              <FileText className="w-5 h-5 text-[#FF5722]" />
            )}
            {selectedCard === "interested" && (
              <Heart className="w-5 h-5 text-[#FF5722]" />
            )}
            {selectedCard === "upcoming" && (
              <Clock className="w-5 h-5 text-[#FF5722]" />
            )}

            <h2 className="text-base sm:text-lg font-bold text-[#171923]">
              {selectedCard === "total"
                ? "Total Reports"
                : selectedCard === "interested"
                ? "Interested Outlets"
                : "Upcoming Follow-ups"}
            </h2>
            <span className="bg-orange-50 text-[#FF5722] border border-orange-100 text-xs font-semibold px-2 py-0.5 rounded-full">
              {currentList.length}
            </span>
          </div>

          {selectedCard === "upcoming" ? (
            <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-lg border border-[#E5E7EB] w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setUpcomingTab("all")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer ${
                  upcomingTab === "all"
                    ? "bg-white text-[#FF5722] shadow-xs"
                    : "text-[#737784] hover:text-[#171923]"
                }`}
              >
                All Upcoming ({allPendingFollowUps.length})
              </button>
              <button
                type="button"
                onClick={() => setUpcomingTab("today")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer ${
                  upcomingTab === "today"
                    ? "bg-white text-[#FF5722] shadow-xs"
                    : "text-[#737784] hover:text-[#171923]"
                }`}
              >
                Today ({todayFollowUps.length})
              </button>
              <button
                type="button"
                onClick={() => setUpcomingTab("upcoming")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer ${
                  upcomingTab === "upcoming"
                    ? "bg-white text-[#FF5722] shadow-xs"
                    : "text-[#737784] hover:text-[#171923]"
                }`}
              >
                Upcoming ({upcomingFollowUps.length})
              </button>
            </div>
          ) : (
            <div className="text-xs text-[#737784] font-medium hidden sm:block">
              {selectedCard === "total"
                ? "Showing all recorded outlet visits"
                : "Showing outlets marked as Interested"}
            </div>
          )}
        </div>

        {/* Content */}
        {currentList.length === 0 ? (
          <div className="py-14 px-4 text-center text-xs text-[#737784]">
            {selectedCard === "total"
              ? "No reports recorded yet."
              : selectedCard === "interested"
              ? "No interested outlets found yet."
              : upcomingTab === "all"
              ? "No upcoming follow-ups scheduled."
              : upcomingTab === "today"
              ? "No follow-ups scheduled for today."
              : "No upcoming follow-ups scheduled."}
            <div className="mt-2.5">
              <Link
                href="/reports/new"
                className="text-[#FF5722] hover:underline font-semibold inline-flex items-center gap-1"
              >
                Create a new report <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card List (< md) */}
            <div className="md:hidden divide-y divide-[#E5E7EB]">
              {currentList.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-[#171923]">
                        {item.firmName}
                      </h3>
                      <p className="text-xs text-[#737784] mt-0.5">
                        {item.ownerName} •{" "}
                        <span className="font-medium text-[#4B5563]">
                          {item.outletType}
                        </span>
                      </p>
                    </div>
                    <StatusBadge type="interest" value={item.interestLevel} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                    <a
                      href={`tel:${item.mobileNumber}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#171923] hover:text-[#FF5722] bg-[#F8F9FA] px-2.5 py-1 rounded border border-[#E5E7EB] w-fit"
                    >
                      <Phone className="w-3 h-3 text-[#FF5722]" />
                      {item.mobileNumber}
                    </a>
                    {item.followUpDate ? (
                      <div className="flex items-center flex-wrap gap-1.5 text-xs text-[#737784]">
                        <Calendar className="w-3 h-3 text-[#FF5722] shrink-0" />
                        <span className="font-semibold text-[#171923]">
                          {formatDate(item.followUpDate)}
                        </span>
                        {item.followUpTime && (
                          <span className="text-[#737784] font-medium">
                            • {formatTime(item.followUpTime)}
                          </span>
                        )}
                        {renderFollowUpBadge(item.followUpDate)}
                      </div>
                    ) : (
                      <span className="text-xs text-[#9CA3AF]">—</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <StatusBadge type="status" value={item.status} />
                    <div className="flex items-center gap-2">
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
                          onClick={() => handleQuickStatus(item.id, "Completed")}
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

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-[#E5E7EB] text-[#737784] font-semibold">
                    <th className="py-3 px-5">Firm / Owner</th>
                    <th className="py-3 px-5 whitespace-nowrap">Mobile</th>
                    <th className="py-3 px-5 whitespace-nowrap">Outlet Type</th>
                    <th className="py-3 px-5 whitespace-nowrap">Interest</th>
                    <th className="py-3 px-5 whitespace-nowrap">Status</th>
                    <th className="py-3 px-5 whitespace-nowrap">Follow-up / Date</th>
                    <th className="py-3 px-5 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#171923]">
                  {currentList.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-[#171923] text-sm">
                          {item.firmName}
                        </div>
                        <div className="text-[11px] text-[#737784]">
                          {item.ownerName}
                        </div>
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <a
                          href={`tel:${item.mobileNumber}`}
                          className="inline-flex items-center text-[#171923] hover:text-[#FF5722] transition-colors text-xs font-medium"
                        >
                          <Phone className="w-3 h-3 mr-1 text-[#FF5722]" />
                          {item.mobileNumber}
                        </a>
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="font-medium text-[#4B5563]">
                          {item.outletType}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <StatusBadge type="interest" value={item.interestLevel} />
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <StatusBadge type="status" value={item.status} />
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {item.followUpDate ? (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#171923] flex items-center gap-1.5 text-xs sm:text-sm">
                                <Calendar className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
                                {formatDate(item.followUpDate)}
                              </span>
                              {renderFollowUpBadge(item.followUpDate)}
                            </div>
                            {item.followUpTime && (
                              <div className="text-[11px] text-[#737784] pl-5 flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                                {formatTime(item.followUpTime)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#9CA3AF] text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
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
                              onClick={() => handleQuickStatus(item.id, "Completed")}
                              className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
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
        <div className="p-3 sm:px-6 sm:py-3 border-t border-[#E5E7EB] bg-[#F8F9FA] flex items-center justify-between text-xs">
          <span className="text-[#737784]">
            {selectedCard === "total"
              ? `Showing ${allReports.length} total reports`
              : selectedCard === "interested"
              ? `Showing ${interestedReports.length} interested outlets`
              : "Showing upcoming customer touchpoints"}
          </span>
          <Link
            href="/reports"
            className="text-[#FF5722] hover:text-[#E64A19] font-semibold inline-flex items-center gap-1"
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
