"use client";

import React from "react";
import { Menu, Bell, Calendar } from "lucide-react";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="h-14 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 select-none">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden p-1.5 text-[#737784] hover:text-[#171923] hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#737784]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-[#171923]">Field DSR Active</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#737784]" />
            {currentDate}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => alert("All follow-up notifications up to date.")}
          className="relative p-2 text-[#737784] hover:text-[#171923] hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF5722] rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
}
