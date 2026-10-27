"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  Calendar,
  ChevronDown
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export interface ReportItem {
  id: string;
  firmName: string;
  ownerName: string;
  mobileNumber: string;
  outletType: string;
  interestLevel: string;
  status: string;
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
  createdAt: Date | string;
}

interface DataTableProps {
  reports: ReportItem[];
  onStatusChange?: (id: string, newStatus: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onViewDetails?: (report: ReportItem) => void;
  isLoading?: boolean;
}

export function DataTable({
  reports,
  onStatusChange,
  onDelete,
  onViewDetails,
  isLoading = false,
}: DataTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="w-full py-16 text-center bg-white border border-[#E5E7EB] rounded-lg">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF5722] border-t-transparent rounded-full mb-2"></div>
        <p className="text-xs text-[#737784]">Loading report data...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="w-full py-16 text-center bg-white border border-[#E5E7EB] rounded-lg p-4">
        <p className="text-sm font-medium text-[#171923]">No reports found</p>
        <p className="text-xs text-[#737784] mt-1">
          Try adjusting your search query or filter options.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* 1. Mobile Cards Layout (< md) */}
      <div className="md:hidden space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-2xs space-y-3"
          >
            {/* Top row: Firm & Badges */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm text-[#171923] leading-snug">
                  {report.firmName}
                </h3>
                <p className="text-xs text-[#737784] mt-0.5">
                  {report.ownerName} • <span className="font-medium text-[#4B5563]">{report.outletType}</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge type="interest" value={report.interestLevel} />
              </div>
            </div>

            {/* Middle row: Phone & Date */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
              <a
                href={`tel:${report.mobileNumber}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#171923] hover:text-[#FF5722] bg-[#F8F9FA] px-2.5 py-1.5 rounded-md border border-[#E5E7EB]"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF5722]" />
                {report.mobileNumber}
              </a>

              {report.followUpDate ? (
                <div className="text-right">
                  <span className="font-medium text-[#171923] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#FF5722]" />
                    {report.followUpDate}
                  </span>
                  {report.followUpTime && (
                    <span className="text-[11px] text-[#737784]">
                      {report.followUpTime}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[11px] text-[#737784]">
                  {new Date(report.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Bottom Row: Status Selector & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
              {/* Status Selector */}
              <div className="flex items-center gap-1.5">
                <select
                  value={report.status}
                  onChange={async (e) => {
                    if (onStatusChange) {
                      await onStatusChange(report.id, e.target.value);
                    }
                  }}
                  className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-md px-2 py-1 text-xs font-medium text-[#171923] focus:outline-hidden focus:border-[#FF5722]"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {onViewDetails && (
                  <button
                    type="button"
                    onClick={() => onViewDetails(report)}
                    className="p-1.5 text-[#737784] hover:text-[#171923] bg-[#F8F9FA] border border-[#E5E7EB] rounded-md transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}

                <Link
                  href={`/reports/${report.id}/edit`}
                  className="p-1.5 text-[#737784] hover:text-[#FF5722] bg-[#F8F9FA] border border-[#E5E7EB] rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>

                {onDelete && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Delete report for "${report.firmName}"?`)) {
                        await onDelete(report.id);
                      }
                    }}
                    className="p-1.5 text-[#737784] hover:text-red-600 bg-[#F8F9FA] border border-[#E5E7EB] rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Desktop Table Layout (>= md) */}
      <div className="hidden md:block w-full bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E7EB] text-[#737784] font-semibold">
                <th className="py-3 px-4">Firm / Owner</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Outlet Type</th>
                <th className="py-3 px-4">Interest</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Follow-up / Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#171923]">
              {reports.map((report) => {
                const formattedCreated = new Date(report.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr
                    key={report.id}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    {/* Firm / Owner */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#171923] text-sm leading-tight">
                        {report.firmName}
                      </div>
                      <div className="text-[#737784] text-xs mt-0.5">
                        {report.ownerName}
                      </div>
                    </td>

                    {/* Mobile */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a
                        href={`tel:${report.mobileNumber}`}
                        className="inline-flex items-center text-[#171923] hover:text-[#FF5722] transition-colors"
                      >
                        <Phone className="w-3 h-3 mr-1 text-[#737784]" />
                        {report.mobileNumber}
                      </a>
                    </td>

                    {/* Outlet Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[#4B5563] bg-[#F3F4F6] px-2 py-0.5 rounded text-xs">
                        {report.outletType}
                      </span>
                    </td>

                    {/* Interest */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge type="interest" value={report.interestLevel} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === `status-${report.id}`
                                ? null
                                : `status-${report.id}`
                            )
                          }
                          className="inline-flex items-center gap-1 group/btn cursor-pointer focus:outline-hidden"
                        >
                          <StatusBadge type="status" value={report.status} />
                          <ChevronDown className="w-3 h-3 text-[#737784] opacity-50 group-hover/btn:opacity-100" />
                        </button>

                        {activeMenuId === `status-${report.id}` && (
                          <div
                            className="absolute left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-[#E5E7EB] py-1 z-30"
                            onMouseLeave={() => setActiveMenuId(null)}
                          >
                            {["Pending", "In Progress", "Completed"].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={async () => {
                                  setActiveMenuId(null);
                                  if (onStatusChange) {
                                    await onStatusChange(report.id, st);
                                  }
                                }}
                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#F3F4F6] flex items-center justify-between cursor-pointer ${
                                  report.status === st ? "font-semibold text-[#FF5722]" : "text-[#171923]"
                                }`}
                              >
                                <span>{st}</span>
                                {report.status === st && (
                                  <CheckCircle2 className="w-3 h-3 text-[#FF5722]" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Follow-up / Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {report.followUpDate ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-[#171923] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#FF5722]" />
                            {report.followUpDate}
                          </span>
                          {report.followUpTime && (
                            <span className="text-[#737784] text-[11px] flex items-center gap-1 mt-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {report.followUpTime}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#737784] text-[11px]">
                          Created {formattedCreated}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {onViewDetails && (
                          <button
                            type="button"
                            onClick={() => onViewDetails(report)}
                            className="p-1.5 text-[#737784] hover:text-[#171923] hover:bg-[#F3F4F6] rounded transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        <Link
                          href={`/reports/${report.id}/edit`}
                          className="p-1.5 text-[#737784] hover:text-[#FF5722] hover:bg-[#F3F4F6] rounded transition-colors cursor-pointer"
                          title="Edit Report"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {onDelete && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`Delete report for "${report.firmName}"?`)) {
                                await onDelete(report.id);
                              }
                            }}
                            className="p-1.5 text-[#737784] hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete Report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
