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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] mr-1.5"></span>
            Interested
          </span>
        );
      case "Maybe":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mr-1.5"></span>
            Maybe
          </span>
        );
      case "Not Interested":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] mr-1.5"></span>
            Not Interested
          </span>
        );
    }
  }

  if (type === "status") {
    switch (value) {
      case "Completed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5"></span>
            Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mr-1.5"></span>
            In Progress
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mr-1.5"></span>
            Pending
          </span>
        );
    }
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB]">
      {value}
    </span>
  );
}
