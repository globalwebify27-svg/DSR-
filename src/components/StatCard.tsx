import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  highlight?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`bg-white border rounded-lg p-4 transition-all duration-150 ${
        highlight
          ? "border-[#FF5722]/30 shadow-xs ring-1 ring-[#FF5722]/10"
          : "border-[#E5E7EB] hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#737784] tracking-wide uppercase">
          {title}
        </span>
        <div
          className={`w-7 h-7 rounded-md flex items-center justify-center ${
            highlight ? "bg-[#FFF3E0] text-[#FF5722]" : "bg-[#F8F9FA] text-[#737784]"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-[#171923]">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-[#737784] font-normal">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
