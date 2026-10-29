"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";

function NavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status");

  const isDashboardActive = pathname === "/" && !currentStatus;
  const isReportsActive = pathname === "/reports" && !currentStatus;
  const isAddActive = pathname === "/reports/new";
  const isPendingActive = currentStatus === "Pending";
  const isCompletedActive = currentStatus === "Completed";

  return (
    <div className="relative w-full select-none">
      {/* 1. Base Curved Bar with Notched Cradle in Center */}
      <div className="absolute inset-x-0 bottom-0 h-16 flex pointer-events-none filter drop-shadow-[0_-3px_12px_rgba(0,0,0,0.06)]">
        {/* Left Bar */}
        <div className="flex-1 bg-white border-t border-[#E5E7EB]" />

        {/* Center Cradle Notch (Always centered) */}
        <div className="w-[84px] h-16 shrink-0 relative -mt-[1px]">
          <svg
            viewBox="0 0 84 64"
            className="w-full h-full block"
            preserveAspectRatio="none"
          >
            {/* Solid white scoop fill */}
            <path
              d="M 0,0 L 10,0 C 22,0 28,26 42,26 C 56,26 62,0 74,0 L 84,0 L 84,64 L 0,64 Z"
              fill="#FFFFFF"
            />
            {/* Top border continuing across the cradle */}
            <path
              d="M 0,0.5 L 10,0.5 C 22,0.5 28,26.5 42,26.5 C 56,26.5 62,0.5 74,0.5 L 84,0.5"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* Right Bar */}
        <div className="flex-1 bg-white border-t border-[#E5E7EB]" />
      </div>

      {/* 2. Interactive 5-Column Grid */}
      <div className="relative z-10 grid grid-cols-5 h-16 w-full items-center">
        {/* Tab 1: Dashboard */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isDashboardActive
              ? "text-[#FF5722]"
              : "text-[#737784] hover:text-[#171923]"
          }`}
        >
          <LayoutDashboard
            className={`w-5 h-5 ${
              isDashboardActive ? "stroke-[2.2]" : "stroke-[1.8]"
            }`}
          />
          <span
            className={`text-[10px] mt-1 leading-none ${
              isDashboardActive ? "font-bold text-[#FF5722]" : "font-medium"
            }`}
          >
            Dashboard
          </span>
        </Link>

        {/* Tab 2: Reports */}
        <Link
          href="/reports"
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isReportsActive
              ? "text-[#FF5722]"
              : "text-[#737784] hover:text-[#171923]"
          }`}
        >
          <FileText
            className={`w-5 h-5 ${
              isReportsActive ? "stroke-[2.2]" : "stroke-[1.8]"
            }`}
          />
          <span
            className={`text-[10px] mt-1 leading-none ${
              isReportsActive ? "font-bold text-[#FF5722]" : "font-medium"
            }`}
          >
            Reports
          </span>
        </Link>

        {/* Tab 3: Center Elevated Add Button */}
        <div className="relative flex flex-col items-center justify-center h-full">
          <Link
            href="/reports/new"
            aria-label="Add Report"
            className="absolute -top-4 flex flex-col items-center group cursor-pointer"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_4px_14px_rgba(255,87,34,0.4)] transition-transform duration-150 active:scale-90 ${
                isAddActive
                  ? "bg-[#E64A19] ring-3 ring-[#FF5722]/30 scale-105"
                  : "bg-gradient-to-tr from-[#FF5722] to-[#FF7043] group-hover:scale-105"
              }`}
            >
              <Plus className="w-6 h-6 stroke-[2.6]" />
            </div>
            <span
              className={`text-[10px] font-bold mt-1 tracking-tight leading-none ${
                isAddActive ? "text-[#E64A19]" : "text-[#FF5722]"
              }`}
            >
              Add
            </span>
          </Link>
        </div>

        {/* Tab 4: Pending */}
        <Link
          href="/reports?status=Pending"
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isPendingActive
              ? "text-[#FF5722]"
              : "text-[#737784] hover:text-[#171923]"
          }`}
        >
          <Clock
            className={`w-5 h-5 ${
              isPendingActive ? "stroke-[2.2]" : "stroke-[1.8]"
            }`}
          />
          <span
            className={`text-[10px] mt-1 leading-none ${
              isPendingActive ? "font-bold text-[#FF5722]" : "font-medium"
            }`}
          >
            Pending
          </span>
        </Link>

        {/* Tab 5: Completed */}
        <Link
          href="/reports?status=Completed"
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isCompletedActive
              ? "text-[#FF5722]"
              : "text-[#737784] hover:text-[#171923]"
          }`}
        >
          <CheckCircle2
            className={`w-5 h-5 ${
              isCompletedActive ? "stroke-[2.2]" : "stroke-[1.8]"
            }`}
          />
          <span
            className={`text-[10px] mt-1 leading-none ${
              isCompletedActive ? "font-bold text-[#FF5722]" : "font-medium"
            }`}
          >
            Completed
          </span>
        </Link>
      </div>

      {/* Safe Area filler */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-white w-full" />
    </div>
  );
}

export function CurvedBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-transparent">
      <Suspense fallback={<div className="h-16 bg-white border-t border-[#E5E7EB]" />}>
        <NavContent />
      </Suspense>
    </nav>
  );
}
