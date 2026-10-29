"use client";

import { useState, useMemo } from "react";
import { ReportItem } from "@/components/DataTable";
import { updateReportStatus } from "@/lib/actions";

export interface CalendarDay {
  day: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function useCalendarSchedule(reports: ReportItem[]) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [localReports, setLocalReports] = useState<ReportItem[]>(reports);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split("T")[0]);
  };

  // Map reports by followUpDate YYYY-MM-DD
  const reportsByDate = useMemo(() => {
    const map = new Map<string, ReportItem[]>();
    for (const r of localReports) {
      if (!r.followUpDate) continue;
      const dateKey = r.followUpDate.trim().substring(0, 10);
      const list = map.get(dateKey) || [];
      list.push(r);
      map.set(dateKey, list);
    }
    return map;
  }, [localReports]);

  // Calendar days calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: CalendarDay[] = [];
    const todayStr = new Date().toISOString().split("T")[0];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, d);
      const dateStr = prevDate.toISOString().split("T")[0];
      days.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const yyyy = currentYear;
      const mm = String(currentMonth + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      days.push({
        day: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
      });
    }

    // Next month padding days to complete full 35 or 42 cell grid
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const remaining = totalSlots - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      const dateStr = nextDate.toISOString().split("T")[0];
      days.push({
        day: i,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const selectedReports = useMemo(() => {
    return reportsByDate.get(selectedDateStr) || [];
  }, [reportsByDate, selectedDateStr]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateReportStatus(id, newStatus);
    setLocalReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return {
    currentYear,
    currentMonth,
    selectedDateStr,
    setSelectedDateStr,
    selectedReport,
    setSelectedReport,
    calendarDays,
    reportsByDate,
    selectedReports,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleStatusChange,
  };
}

