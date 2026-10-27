"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PlusCircle, Clock, CheckCircle } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const mobileNavItems = [
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
      active: pathname === "/reports",
    },
    {
      name: "Add",
      href: "/reports/new",
      icon: PlusCircle,
      active: pathname === "/reports/new",
      isPrimary: true,
    },
    {
      name: "Pending",
      href: "/reports?status=Pending",
      icon: Clock,
      active: false,
    },
    {
      name: "Completed",
      href: "/reports?status=Completed",
      icon: CheckCircle,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-row">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-[#FFFFFF] pb-16 md:pb-0">
        <AppHeader onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] px-2 py-1.5 flex items-center justify-around shadow-lg">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            if (item.isPrimary) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center justify-center -mt-4"
                >
                  <div className="w-11 h-11 rounded-full bg-[#FF5722] text-white flex items-center justify-center shadow-md hover:bg-[#E64A19] transition-transform active:scale-95">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#FF5722] mt-0.5">
                    {item.name}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center py-1 px-2 rounded-md transition-colors ${
                  item.active
                    ? "text-[#FF5722] font-semibold"
                    : "text-[#737784] hover:text-[#171923]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
