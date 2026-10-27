"use client";

import { ReportForm } from "@/components/ReportForm";
import { updateReport, ReportFormData } from "@/lib/actions";
import { ReportItem } from "@/components/DataTable";

interface EditReportClientProps {
  report: ReportItem;
}

export function EditReportClient({ report }: EditReportClientProps) {
  const handleUpdate = async (data: ReportFormData) => {
    try {
      const res = await updateReport(report.id, data);
      return { success: res.success };
    } catch (e: unknown) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Failed to update report",
      };
    }
  };

  return (
    <ReportForm
      initialData={report}
      onSubmit={handleUpdate}
      isEditing={true}
    />
  );
}
