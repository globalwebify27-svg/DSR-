import React from "react";

interface StatusBadgeProps {
  type: "interest" | "status" | "outlet";
  value: string;
}

export function StatusBadge({ type, value }: StatusBadgeProps) {
  if (type === "interest") {
    switch (value) {
      case "Interested":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Interested
          </span>
        );
      case "Maybe":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            Maybe
          </span>
        );
      case "Not Interested":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
            Not Interested
          </span>
        );
    }
  }

  if (type === "status") {
    switch (value) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            In Progress
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#E64A19] ring-1 ring-inset ring-[#FF5722]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
            Pending
          </span>
        );
    }
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200">
      {value}
    </span>
  );
}
