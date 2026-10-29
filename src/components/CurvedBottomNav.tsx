"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    id: "reports",
    label: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    id: "add",
    label: "Add",
    href: "/reports/new",
    icon: Plus,
  },
  {
    id: "pending",
    label: "Pending",
    href: "/reports?status=Pending",
    icon: Clock,
  },
  {
    id: "completed",
    label: "Completed",
    href: "/reports?status=Completed",
    icon: CheckCircle2,
  },
];

function NavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status");

  // Determine active tab index based on route
  const getRouteIndex = (): number => {
    if (pathname === "/reports/new") return 2;
    if (currentStatus === "Pending") return 3;
    if (currentStatus === "Completed") return 4;
    if (pathname.startsWith("/reports")) return 1;
    if (pathname === "/") return 0;
    return 0;
  };

  const routeIndex = getRouteIndex();
  const [optimisticIndex, setOptimisticIndex] = useState<number | null>(null);
  const [prevRouteIndex, setPrevRouteIndex] = useState(routeIndex);

  // Sync state during render when route changes
  if (prevRouteIndex !== routeIndex) {
    setPrevRouteIndex(routeIndex);
    setOptimisticIndex(null);
  }

  const selectedIndex = optimisticIndex ?? routeIndex;
  const ActiveIcon = TABS[selectedIndex].icon;

  return (
    <div className="relative w-full select-none">
      {/* 1. Main Navigation Bar with Hardware-Accelerated Sliding Cradle */}
      <div className="relative w-full h-[64px] bg-white border-t border-[#E5E7EB] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        {/* GPU-Accelerated Sliding Cradle Notch & Hero FAB (Zero re-renders, zero shaking) */}
        <div
          className="absolute top-0 left-0 w-1/5 h-full pointer-events-none flex flex-col items-center transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform z-20"
          style={{
            transform: `translate3d(${selectedIndex * 100}%, 0, 0)`,
          }}
        >
          {/* Cradle Notch Cutout SVG (Overlaps the border seamlessly) */}
          <div className="absolute -top-[1px] w-[68px] h-[32px] flex items-start justify-center pointer-events-none">
            <svg
              viewBox="0 0 68 32"
              className="w-full h-full block"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* White scoop fill */}
              <path
                d="M 0,0 L 10,0 C 18,0 22,24 34,24 C 46,24 50,0 58,0 L 68,0 L 68,32 L 0,32 Z"
                fill="#FFFFFF"
              />
              {/* Continuous curved cradle top border */}
              <path
                d="M 0,0.5 L 10,0.5 C 18,0.5 22,24.5 34,24.5 C 46,24.5 50,0.5 58,0.5 L 68,0.5"
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Elevated Floating Action Button Docked in Cradle */}
          <Link
            href={TABS[selectedIndex].href}
            prefetch={true}
            aria-label={TABS[selectedIndex].label}
            title={TABS[selectedIndex].label}
            className="absolute -top-4 w-[40px] h-[40px] rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FF7043] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(255,87,34,0.38)] ring-[3px] ring-white pointer-events-auto active:scale-90 transition-transform focus:outline-none"
          >
            <ActiveIcon className="w-4 h-4 stroke-[2.6]" />
          </Link>
        </div>

        {/* 2. Interactive 5-Column Navigation Grid - Fixed baseline labels that never hide or clip */}
        <div className="relative z-10 grid grid-cols-5 h-full w-full">
          {TABS.map((tab, idx) => {
            const isTabActive = selectedIndex === idx;
            const TabIcon = tab.icon;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                prefetch={true}
                onClick={() => setOptimisticIndex(idx)}
                className="relative flex flex-col items-center justify-end h-full pb-2 px-0.5 focus:outline-none active:scale-95 transition-transform"
              >
                {/* Regular Tab Icon (fades when lifted into floating FAB) */}
                <div
                  className={`w-5 h-5 mb-0.5 flex items-center justify-center transition-all duration-200 ${
                    isTabActive
                      ? "opacity-0 scale-75 pointer-events-none"
                      : "opacity-100 scale-100 text-[#737784] hover:text-[#171923]"
                  }`}
                >
                  <TabIcon className="w-4 h-4 stroke-[1.8]" />
                </div>

                {/* Tab Label - ALWAYS visible in the exact same horizontal row */}
                <span
                  className={`text-[9.5px] tracking-tight leading-none truncate max-w-full text-center transition-colors duration-200 ${
                    isTabActive
                      ? "font-bold text-[#FF5722]"
                      : "font-medium text-[#737784]"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Safe Area filler for modern mobile home indicators */}
      <div
        className="w-full bg-white"
        style={{ height: "env(safe-area-inset-bottom, 0px)" }}
      />
    </div>
  );
}

export function CurvedBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-transparent">
      <Suspense fallback={<div className="h-[64px] bg-white border-t border-[#E5E7EB]" />}>
        <NavContent />
      </Suspense>
    </nav>
  );
}
