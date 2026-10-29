import { notFound } from "next/navigation";
import { getReportById } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";
import { EditReportClient } from "./EditReportClient";

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
    <div className="space-y-6">
      <PageHeader title={`Edit: ${report.firmName}`} />
      <EditReportClient report={report} />
    </div>
  );
}

