import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  mobileTitle?: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  highlight?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function StatCard({
  title,
  mobileTitle,
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
      className={`bg-white border rounded-xl p-2.5 sm:p-5 transition-all duration-150 select-none text-left w-full ${
        isClickable ? "cursor-pointer active:scale-[0.98]" : ""
      } ${
        isActive
          ? "border-[#FF5722] ring-2 ring-[#FF5722]/20 shadow-xs bg-orange-50/20"
          : highlight
          ? "border-[#FF5722]/30 shadow-xs ring-1 ring-[#FF5722]/10 hover:border-[#FF5722]/60"
          : "border-[#E5E7EB] hover:border-gray-300 hover:shadow-xs"
      }`}
    >
      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between gap-1">
        <span
          className={`text-[9.5px] sm:text-xs font-bold tracking-tight sm:tracking-wide uppercase leading-tight ${
            isActive ? "text-[#FF5722]" : "text-[#737784]"
          }`}
        >
          <span className="sm:hidden">{mobileTitle || title}</span>
          <span className="hidden sm:inline">{title}</span>
        </span>
        <div
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            isActive
              ? "bg-[#FF5722] text-white shadow-xs"
              : highlight
              ? "bg-[#FFF3E0] text-[#FF5722]"
              : "bg-[#F8F9FA] text-[#737784]"
          }`}
        >
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
        </div>
      </div>

      {/* Metric Value */}
      <div className="mt-1 sm:mt-2.5 flex items-baseline justify-between sm:justify-start gap-2">
        <span className="text-xl sm:text-3xl font-extrabold sm:font-bold tracking-tight text-[#171923]">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-[#737784] font-normal">{subtitle}</span>
        )}
        {/* Mobile Active Indicator Dot */}
        {isClickable && (
          <div className="sm:hidden flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isActive ? "bg-[#FF5722]" : "bg-gray-200"
              }`}
            />
          </div>
        )}
      </div>

      {/* Desktop Click to view Footer */}
      {isClickable && (
        <div className="hidden sm:flex mt-2.5 pt-2 border-t border-gray-100 items-center justify-between text-[11px]">
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
