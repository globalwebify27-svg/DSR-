import { PageHeader } from "@/components/PageHeader";
import { ScheduleCalendarView } from "@/components/ScheduleCalendarView";
import { getAllScheduledReports } from "@/lib/actions";

export default async function CalendarPage() {
  const reports = await getAllScheduledReports();

  return (
    <div className="space-y-3 sm:space-y-6">
      <PageHeader title="Calendar" />
      <ScheduleCalendarView reports={reports} />
    </div>
  );
}

