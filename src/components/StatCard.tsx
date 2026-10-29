import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  highlight?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  highlight = false,
  isActive = false,
  onClick,
}: StatCardProps) {
  const isClickable = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`bg-white border rounded-xl p-4 sm:p-5 transition-all duration-150 select-none text-left w-full ${
        isClickable ? "cursor-pointer active:scale-[0.99]" : ""
      } ${
        isActive
          ? "border-[#FF5722] ring-2 ring-[#FF5722]/20 shadow-sm"
          : highlight
          ? "border-[#FF5722]/30 shadow-xs ring-1 ring-[#FF5722]/10 hover:border-[#FF5722]/60"
          : "border-[#E5E7EB] hover:border-gray-300 hover:shadow-xs"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold tracking-wide uppercase ${
            isActive ? "text-[#FF5722]" : "text-[#737784]"
          }`}
        >
          {title}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isActive
              ? "bg-[#FF5722] text-white shadow-xs"
              : highlight
              ? "bg-[#FFF3E0] text-[#FF5722]"
              : "bg-[#F8F9FA] text-[#737784]"
          }`}
        >
          <Icon className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171923]">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-[#737784] font-normal">{subtitle}</span>
        )}
      </div>
      {isClickable && (
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
          <span
            className={
              isActive
                ? "text-[#FF5722] font-semibold"
                : "text-[#737784]"
            }
          >
            {isActive ? "Active View" : "Click to view"}
          </span>
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isActive ? "bg-[#FF5722]" : "bg-gray-200"
            }`}
          />
        </div>
      )}
    </div>
  );
}
