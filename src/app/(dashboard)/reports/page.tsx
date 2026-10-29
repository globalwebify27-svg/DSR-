import React, { Suspense } from "react";
import { getReports, getExecutives } from "@/lib/actions";
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
  const executive = typeof resolvedParams.executive === "string" ? resolvedParams.executive : "All";
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) || 1 : 1;
  const limit = 10;

  const [initialData, executives] = await Promise.all([
    getReports({
      page,
      limit,
      search,
      interest,
      status,
      outletType,
      date,
      executive,
    }),
    getExecutives(),
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#737784]">Loading reports...</div>}>
      <ReportsView
        key={`${status}-${interest}-${search}-${page}-${date}-${executive}`}
        initialReports={initialData.reports}
        initialTotal={initialData.total}
        initialPage={initialData.page}
        initialLimit={initialData.limit}
        initialTotalPages={initialData.totalPages}
        initialExecutives={executives}
      />
    </Suspense>
  );
}

