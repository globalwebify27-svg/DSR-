"use client";

import React from "react";

export default function ReportsLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-28 bg-[#F3F4F6] rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-[#F3F4F6] rounded" />
          <div className="h-8 w-24 bg-[#F3F4F6] rounded" />
        </div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 w-20 bg-[#F3F4F6] rounded" />
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E5E7EB] rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-[#F3F4F6] rounded" />
                <div className="h-3 w-24 bg-[#F3F4F6] rounded" />
              </div>
              <div className="h-5 w-16 bg-[#F3F4F6] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

