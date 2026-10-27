"use client";

import React from "react";
import { X, MapPin, Calendar, Clock, DollarSign, Store, Phone, User, MessageSquare, Flag } from "lucide-react";
import { ReportItem } from "./DataTable";
import { StatusBadge } from "./StatusBadge";

interface ReportDetailModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export function ReportDetailModal({ report, onClose }: ReportDetailModalProps) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
      <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-base font-bold text-[#171923]">{report.firmName}</h2>
            <p className="text-xs text-[#737784] mt-0.5">Outlet Report Details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#737784] hover:text-[#171923] hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Key Badges */}
          <div className="flex items-center gap-2">
            <StatusBadge type="interest" value={report.interestLevel} />
            <StatusBadge type="status" value={report.status} />
            <span className="px-2 py-0.5 rounded text-xs bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
              {report.outletType}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-md">
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
                <Phone className="w-3.5 h-3.5 text-[#737784]" />
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
              <div>
                <div className="font-semibold text-[#171923]">
                  {report.locationAddress || "Captured GPS Coordinates"}
                </div>
                {report.latitude && report.longitude && (
                  <div className="text-[#737784] mt-0.5 text-[11px]">
                    Lat: {report.latitude.toFixed(5)}, Long: {report.longitude.toFixed(5)}{" "}
                    <a
                      href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5722] hover:underline ml-1"
                    >
                      (View on Map)
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
              <div className="border border-[#E5E7EB] rounded-md overflow-hidden max-h-48 flex items-center justify-center bg-gray-50">
                <img
                  src={report.outletImage}
                  alt={report.firmName}
                  className="max-h-48 object-contain w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F8F9FA] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#171923] bg-white border border-[#E5E7EB] rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
