"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { logoutAction } from "@/lib/auth";
import { getCurrentUser } from "@/lib/actions";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  PlusCircle,
  Clock,
  CheckCircle,
  Settings,
  HelpCircle,
  LogOut,
  X
} from "lucide-react";

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarNavContent({ onMobileClose }: { onMobileClose?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status");

  const navLinks = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
      active: pathname === "/reports" && !currentStatus,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: Calendar,
      active: pathname === "/calendar",
    },
    {
      name: "Add Report",
      href: "/reports/new",
      icon: PlusCircle,
      active: pathname === "/reports/new",
    },
  ];

  const quickFilterLinks = [
    {
      name: "Pending Outlets",
      href: "/reports?status=Pending",
      icon: Clock,
      active: pathname === "/reports" && currentStatus === "Pending",
    },
    {
      name: "Completed Outlets",
      href: "/reports?status=Completed",
      icon: CheckCircle,
      active: pathname === "/reports" && currentStatus === "Completed",
    },
  ];

  return (
    <div className="flex-1 py-4 px-3 overflow-y-auto space-y-6">
      <div>
        <div className="px-3 mb-2 text-[10px] font-bold text-[#737784] uppercase tracking-wider">
          Main Menu
        </div>
        <nav className="space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  item.active
                    ? "bg-[#F3F4F6] text-[#FF5722] font-semibold"
                    : "text-[#171923] hover:bg-[#F8F9FA] hover:text-[#FF5722]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    item.active ? "text-[#FF5722]" : "text-[#737784]"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="px-3 mb-2 text-[10px] font-bold text-[#737784] uppercase tracking-wider">
          Quick Views
        </div>
        <nav className="space-y-1">
          {quickFilterLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  item.active
                    ? "bg-[#F3F4F6] text-[#FF5722] font-semibold"
                    : "text-[#737784] hover:bg-[#F8F9FA] hover:text-[#171923]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    item.active ? "text-[#FF5722]" : "text-[#737784]"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function UserFooter() {
  const [userName, setUserName] = useState<string>("Sales Executive");

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res?.username) {
        setUserName(res.username);
      }
    });
  }, []);

  const initials =
    userName
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SE";

  return (
    <div className="pt-2 mt-2 border-t border-[#E5E7EB] flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#FFF3E0] border border-orange-200 flex items-center justify-center text-xs font-semibold text-[#FF5722]">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-[#171923] leading-tight capitalize">
            {userName}
          </span>
          <span className="text-[10px] text-[#737784] leading-tight">
            Sales Executive
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={async () => {
          await logoutAction();
        }}
        className="p-1 text-[#737784] hover:text-red-600 rounded transition-colors cursor-pointer"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}

export function AppSidebar({ mobileOpen = false, onMobileClose }: AppSidebarProps) {
  const content = (
    <div className="flex flex-col h-full bg-white border-r border-[#E5E7EB] w-64 select-none">
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-[#E5E7EB]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#FF5722] flex items-center justify-center text-white font-black text-xs shadow-xs">
            D
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#171923] leading-none">
              DSR System
            </span>
            <span className="text-[10px] text-[#737784] font-medium leading-none mt-1">
              Daily Sales Report
            </span>
          </div>
        </Link>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="md:hidden p-1 text-[#737784] hover:text-[#171923] rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Nav with Suspense */}
      <Suspense fallback={<div className="flex-1 p-4 text-xs text-gray-400">Loading navigation...</div>}>
        <SidebarNavContent onMobileClose={onMobileClose} />
      </Suspense>

      {/* User & Settings Footer */}
      <div className="p-3 border-t border-[#E5E7EB] space-y-1">
        <button
          type="button"
          onClick={() => alert("Settings configuration panel")}
          className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-[#737784] hover:text-[#171923] hover:bg-[#F8F9FA] rounded-md transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button
          type="button"
          onClick={() => alert("DSR Documentation & Field Support: Contact support@dsrsystem.local")}
          className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-[#737784] hover:text-[#171923] hover:bg-[#F8F9FA] rounded-md transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </button>

        <UserFooter />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative z-10 w-64 max-w-xs h-full bg-white shadow-xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
