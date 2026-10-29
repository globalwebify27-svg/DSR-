"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-200">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h2 className="text-base sm:text-lg font-bold text-[#171923] mb-1">
        Something went wrong
      </h2>

      <p className="text-xs text-[#737784] max-w-md mb-5">
        {error?.message || "An unexpected error occurred while loading this section. Please try again."}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#171923] bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] rounded-md transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}

