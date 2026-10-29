import { getDashboardStats } from "@/lib/actions";
import { DashboardView } from "@/components/DashboardView";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return <DashboardView stats={stats} />;
}

