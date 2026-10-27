"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 bg-white border-t border-[#E5E7EB] text-xs text-[#737784] rounded-b-lg">
      <div className="text-center sm:text-left">
        Showing <span className="font-medium text-[#171923]">{startItem}</span> to{" "}
        <span className="font-medium text-[#171923]">{endItem}</span> of{" "}
        <span className="font-medium text-[#171923]">{totalItems}</span> results
      </div>

      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded border border-[#E5E7EB] bg-white text-[#171923] hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Mobile Page Indicator */}
        <span className="sm:hidden px-2 text-xs font-medium text-[#171923]">
          {currentPage} / {totalPages}
        </span>

        {/* Desktop Page Number Buttons */}
        <div className="hidden sm:flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 1 && p <= currentPage + 1)
            )
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              return (
                <React.Fragment key={p}>
                  {prev && p - prev > 1 && (
                    <span className="px-2 py-1 text-gray-400">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`min-w-[28px] h-7 px-2 text-xs font-medium rounded border transition-colors cursor-pointer ${
                      currentPage === p
                        ? "bg-[#FF5722] border-[#FF5722] text-white"
                        : "bg-white border-[#E5E7EB] text-[#171923] hover:bg-[#F8F9FA]"
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded border border-[#E5E7EB] bg-white text-[#171923] hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
