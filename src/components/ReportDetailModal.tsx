"use client";

import React from "react";
import Image from "next/image";
import { X, MapPin, Calendar, Clock, DollarSign, Phone, User, Flag, UserCheck } from "lucide-react";
import { ReportItem } from "./DataTable";
import { StatusBadge } from "./StatusBadge";

interface ReportDetailModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export function ReportDetailModal({ report, onClose }: ReportDetailModalProps) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-2xs p-0 sm:p-4">
      <div className="bg-white rounded-t-xl sm:rounded-lg border border-[#E5E7EB] shadow-xl w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-base font-bold text-[#171923]">{report.firmName}</h2>
            <p className="text-xs text-[#737784] mt-0.5">Outlet Report Details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#737784] hover:text-[#171923] hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Key Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge type="interest" value={report.interestLevel} />
            <StatusBadge type="status" value={report.status} />
            <span className="px-2 py-0.5 rounded text-xs bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
              {report.outletType}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-md">
            <div>
              <span className="text-[#737784] block mb-0.5 font-medium">Owner Name</span>
              <span className="text-[#171923] font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#737784]" />
                {report.ownerName}
              </span>
            </div>
            <div>
              <span className="text-[#737784] block mb-0.5 font-medium">Mobile Number</span>
              <a
                href={`tel:${report.mobileNumber}`}
                className="text-[#171923] font-semibold flex items-center gap-1.5 hover:text-[#FF5722]"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF5722]" />
                {report.mobileNumber}
              </a>
            </div>
            <div>
              <span className="text-[#737784] block mb-0.5 font-medium">Quote Price</span>
              <span className="text-[#171923] font-semibold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#737784]" />
                {report.quotePrice ? `₹${report.quotePrice.toLocaleString()}` : "Not quoted"}
              </span>
            </div>
            <div>
              <span className="text-[#737784] block mb-0.5 font-medium">Standee Type</span>
              <span className="text-[#171923] font-semibold flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-[#737784]" />
                {report.standeeType || "None"}
              </span>
            </div>
            <div>
              <span className="text-[#737784] block mb-0.5 font-medium">Follow-up Date</span>
              <span className="text-[#171923] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF5722]" />
                {report.followUpDate || "None scheduled"}
              </span>
            </div>
            <div>
              <span className="text-[#737784] block mb-0.5 font-medium">Follow-up Time</span>
              <span className="text-[#171923] font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#737784]" />
                {report.followUpTime || "—"}
              </span>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-gray-200/60">
              <span className="text-[#737784] block mb-0.5 font-medium">Report Added By / Executive</span>
              <span className="text-[#171923] font-semibold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#FF5722]" />
                {report.reportedBy || "—"}
              </span>
            </div>
          </div>

          {/* Remarks & Feedback */}
          {report.followUpRemarks && (
            <div>
              <h4 className="font-semibold text-[#171923] mb-1">Follow-up Remarks</h4>
              <p className="p-3 bg-white border border-[#E5E7EB] rounded-md text-[#374151] leading-relaxed">
                {report.followUpRemarks}
              </p>
            </div>
          )}

          {report.feedback && (
            <div>
              <h4 className="font-semibold text-[#171923] mb-1">Visit Feedback / Notes</h4>
              <p className="p-3 bg-white border border-[#E5E7EB] rounded-md text-[#374151] leading-relaxed">
                {report.feedback}
              </p>
            </div>
          )}

          {/* Location & GPS */}
          {(report.latitude || report.locationAddress) && (
            <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-md flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-[#737784] font-medium block">
                  Location:
                </span>
                <div className="font-semibold text-[#171923] text-xs mt-0.5">
                  {report.locationAddress || "Captured Location"}
                </div>
                {report.latitude && report.longitude && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[10px] text-[#737784] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </span>
                    <a
                      href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#FF5722] hover:underline font-medium inline-flex items-center gap-0.5"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Image */}
          {report.outletImage && (
            <div>
              <h4 className="font-semibold text-[#171923] mb-1">Outlet Photo</h4>
              <div className="relative border border-[#E5E7EB] rounded-md overflow-hidden h-48 w-full flex items-center justify-center bg-gray-50">
                <Image
                  src={report.outletImage}
                  alt={report.firmName}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-[#E5E7EB] bg-[#F8F9FA] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-xs font-medium text-[#171923] bg-white border border-[#E5E7EB] rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
