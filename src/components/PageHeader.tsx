import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  badge?: string | number;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  badge,
  subtitle,
  actionText,
  actionHref,
  onActionClick,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-[#E5E7EB]">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#171923]">
            {title}
          </h1>
          {badge !== undefined && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#737784] border border-[#E5E7EB]">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-[#737784]">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {children}
        {actionText && actionHref && (
          <Link
            href={actionHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-medium text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-xs cursor-pointer text-center"
          >
            <Plus className="w-4 h-4" />
            {actionText}
          </Link>
        )}
        {actionText && onActionClick && !actionHref && (
          <button
            type="button"
            onClick={onActionClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-medium text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-xs cursor-pointer text-center"
          >
            <Plus className="w-4 h-4" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}
