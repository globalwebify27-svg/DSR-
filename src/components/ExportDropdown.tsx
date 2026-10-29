"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { ReportItem } from "./DataTable";

interface ExportDropdownProps {
  reports: ReportItem[];
  title?: string;
  filenamePrefix?: string;
}

export function ExportDropdown({
  reports,
  title = "DSR Report",
  filenamePrefix = "dsr-reports",
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<"excel" | "pdf" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleExportExcel = async () => {
    try {
      setIsExporting("excel");
      setIsOpen(false);
      const { exportToExcel } = await import("@/lib/exportUtils");
      const dateStr = new Date().toISOString().split("T")[0];
      exportToExcel(reports, `${filenamePrefix}-${dateStr}.xlsx`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting("pdf");
      setIsOpen(false);
      const { exportToPDF } = await import("@/lib/exportUtils");
      const dateStr = new Date().toISOString().split("T")[0];
      exportToPDF(reports, title, `${filenamePrefix}-${dateStr}.pdf`);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={isExporting !== null}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#171923] bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] hover:border-gray-300 rounded-md transition-colors shadow-2xs cursor-pointer select-none active:scale-[0.98] disabled:opacity-50"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isExporting ? (
          <Loader2 className="w-3.5 h-3.5 text-[#FF5722] animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5 text-[#FF5722]" />
        )}
        <span>{isExporting ? "Exporting..." : "Export"}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#737784] transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-52 max-w-[calc(100vw-2rem)] bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-[#737784] uppercase tracking-wider">
            Export Format
          </div>

          <button
            type="button"
            onClick={handleExportExcel}
            className="w-full text-left px-3.5 py-2 text-xs text-[#171923] hover:bg-[#F8F9FA] flex items-center gap-2.5 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 rounded flex items-center justify-center bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-xs text-[#171923]">Excel (.xlsx)</p>
              <p className="text-[10px] text-[#737784]">Spreadsheet workbook</p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full text-left px-3.5 py-2 text-xs text-[#171923] hover:bg-[#F8F9FA] flex items-center gap-2.5 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 rounded flex items-center justify-center bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-xs text-[#171923]">PDF Document (.pdf)</p>
              <p className="text-[10px] text-[#737784]">Printable report</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

