import { getDashboardStats } from "@/lib/actions";
import { AppLayout } from "@/components/AppLayout";
import { DashboardView } from "@/components/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <AppLayout>
      <DashboardView stats={stats} />
    </AppLayout>
  );
}
