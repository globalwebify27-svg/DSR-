"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { CurvedBottomNav } from "./CurvedBottomNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-row">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-[#FFFFFF] pb-28 md:pb-0">
        <AppHeader onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Curved / Fluid Bottom Navigation Bar for Mobile */}
        <CurvedBottomNav />
      </div>
    </div>
  );
}
