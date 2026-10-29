"use client";

import React from "react";

export default function CalendarLoading() {
  return (
    <div className="space-y-3 sm:space-y-6 animate-pulse">
      <div className="h-6 w-24 bg-[#F3F4F6] rounded" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left 2/3 Calendar Skeleton */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs p-4 sm:p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB]">
            <div className="h-5 w-32 bg-[#F3F4F6] rounded" />
            <div className="flex gap-2">
              <div className="h-7 w-14 bg-[#F3F4F6] rounded" />
              <div className="h-7 w-20 bg-[#F3F4F6] rounded" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-16 sm:h-20 bg-[#F8F9FA] rounded-md" />
            ))}
          </div>
        </div>

        {/* Right 1/3 Schedule Skeleton */}
        <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs p-3.5 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]">
            <div className="space-y-1">
              <div className="h-4 w-24 bg-[#F3F4F6] rounded" />
              <div className="h-3 w-32 bg-[#F3F4F6] rounded" />
            </div>
            <div className="h-6 w-12 bg-[#F3F4F6] rounded" />
          </div>

          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border border-[#E5E7EB] rounded-lg space-y-2">
                <div className="h-4 w-28 bg-[#F3F4F6] rounded" />
                <div className="h-3 w-36 bg-[#F3F4F6] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
