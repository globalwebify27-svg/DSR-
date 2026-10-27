"use client";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { ReportForm } from "@/components/ReportForm";
import { createReport, ReportFormData } from "@/lib/actions";

export default function NewReportPage() {
  const handleCreate = async (data: ReportFormData) => {
    try {
      const res = await createReport(data);
      return { success: res.success };
    } catch (e: unknown) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Failed to create report",
      };
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Add Daily Sales Report"
          subtitle="Record new outlet visit details, customer interest, quotations, and GPS coordinates"
        />
        <ReportForm onSubmit={handleCreate} />
      </div>
    </AppLayout>
  );
}
