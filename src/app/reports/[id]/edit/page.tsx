import { notFound } from "next/navigation";
import { getReportById } from "@/lib/actions";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { EditReportClient } from "./EditReportClient";

export const dynamic = "force-dynamic";

interface EditReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReportPage({ params }: EditReportPageProps) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Edit Report: ${report.firmName}`}
          subtitle="Update outlet information, follow-up remarks, or visit status"
        />
        <EditReportClient report={report} />
      </div>
    </AppLayout>
  );
}
