"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  currentInterest: string;
  onInterestChange: (interest: string) => void;
  currentStatus: string;
  onStatusChange: (status: string) => void;
  currentOutletType: string;
  onOutletTypeChange: (type: string) => void;
  currentDate: string;
  onDateChange: (date: string) => void;
  onReset: () => void;
}

const INTEREST_TABS = ["All", "Interested", "Maybe", "Not Interested"];
const STATUS_OPTIONS = ["All", "Pending", "In Progress", "Completed"];
const OUTLET_TYPES = [
  "All",
  "Retail",
  "Wholesale",
  "Distributor",
  "Supermarket",
  "Pharmacy",
  "Other",
];

export function FilterPanel({
  currentInterest,
  onInterestChange,
  currentStatus,
  onStatusChange,
  currentOutletType,
  onOutletTypeChange,
  currentDate,
  onDateChange,
  onReset,
}: FilterPanelProps) {
  const hasActiveFilters =
    currentInterest !== "All" ||
    currentStatus !== "All" ||
    currentOutletType !== "All" ||
    Boolean(currentDate);

  return (
    <div className="space-y-3">
      {/* Interest Tabs with smooth horizontal touch scroll */}
      <div className="flex items-center gap-1 border-b border-[#E5E7EB] overflow-x-auto pb-px -mx-2 px-2 sm:mx-0 sm:px-0">
        {INTEREST_TABS.map((tab) => {
          const isActive = currentInterest === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onInterestChange(tab)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer shrink-0 ${
                isActive
                  ? "border-[#FF5722] text-[#FF5722] font-semibold"
                  : "border-transparent text-[#737784] hover:text-[#171923] hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Secondary Filter Dropdowns & Date */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-[#737784] font-medium mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>

        {/* Status Dropdown */}
        <select
          value={currentStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-md px-2.5 py-1.5 text-xs text-[#171923] focus:outline-hidden focus:border-[#FF5722] transition-colors cursor-pointer grow sm:grow-0"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.filter((s) => s !== "All").map((status) => (
            <option key={status} value={status}>
              Status: {status}
            </option>
          ))}
        </select>

        {/* Outlet Type Dropdown */}
        <select
          value={currentOutletType}
          onChange={(e) => onOutletTypeChange(e.target.value)}
          className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-md px-2.5 py-1.5 text-xs text-[#171923] focus:outline-hidden focus:border-[#FF5722] transition-colors cursor-pointer grow sm:grow-0"
        >
          <option value="All">All Outlet Types</option>
          {OUTLET_TYPES.filter((t) => t !== "All").map((type) => (
            <option key={type} value={type}>
              Type: {type}
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <div className="relative flex items-center grow sm:grow-0">
          <input
            type="date"
            value={currentDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full sm:w-auto bg-[#F8F9FA] border border-[#E5E7EB] rounded-md pl-2.5 pr-2 py-1.5 text-xs text-[#171923] focus:outline-hidden focus:border-[#FF5722] transition-colors cursor-pointer"
          />
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#737784] hover:text-[#171923] hover:bg-[#F3F4F6] rounded-md border border-[#E5E7EB] transition-colors cursor-pointer ml-auto sm:ml-0"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
