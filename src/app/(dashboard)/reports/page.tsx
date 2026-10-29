import React, { Suspense } from "react";
import { getReports } from "@/lib/actions";
import { ReportsView } from "@/components/ReportsView";

interface ReportsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const resolvedParams = await searchParams;

  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const interest = typeof resolvedParams.interest === "string" ? resolvedParams.interest : "All";
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : "All";
  const outletType = typeof resolvedParams.outletType === "string" ? resolvedParams.outletType : "All";
  const date = typeof resolvedParams.date === "string" ? resolvedParams.date : "";
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) || 1 : 1;
  const limit = 10;

  const initialData = await getReports({
    page,
    limit,
    search,
    interest,
    status,
    outletType,
    date,
  });

  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#737784]">Loading reports...</div>}>
      <ReportsView
        key={`${status}-${interest}-${search}-${page}-${date}`}
        initialReports={initialData.reports}
        initialTotal={initialData.total}
        initialPage={initialData.page}
        initialLimit={initialData.limit}
        initialTotalPages={initialData.totalPages}
      />
    </Suspense>
  );
}

