"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E5E7EB] rounded-lg p-3 sm:p-5 h-24 sm:h-32"
          >
            <div className="h-3 w-20 bg-[#F3F4F6] rounded mb-3" />
            <div className="h-8 w-12 bg-[#F3F4F6] rounded mb-3" />
            <div className="h-2 w-16 bg-[#F3F4F6] rounded" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
        <div className="h-4 w-32 bg-[#F3F4F6] rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-3 w-24 bg-[#F3F4F6] rounded" />
              <div className="h-3 w-20 bg-[#F3F4F6] rounded" />
              <div className="h-3 w-16 bg-[#F3F4F6] rounded flex-1" />
              <div className="h-3 w-14 bg-[#F3F4F6] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

