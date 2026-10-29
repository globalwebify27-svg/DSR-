/**
 * Domain presentation formatters for DSR dates, times, and currencies.
 */

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
      return `${months[monthIdx]} ${day}, ${year}`;
    }
  }
  return dateStr;
}

export function formatTime(timeStr?: string | null): string {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  if (/^\d{1,2}$/.test(trimmed)) {
    const hour = parseInt(trimmed, 10);
    if (hour >= 1 && hour <= 11) {
      return `${hour}:00 AM`;
    }
    if (hour === 12) {
      return "12:00 PM";
    }
    if (hour >= 13 && hour <= 23) {
      return `${hour - 12}:00 PM`;
    }
    if (hour === 0) {
      return "12:00 AM";
    }
  }
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    const [h, m] = trimmed.split(":").map((x) => parseInt(x, 10));
    const mStr = m < 10 ? `0${m}` : `${m}`;
    if (h === 0) return `12:${mStr} AM`;
    if (h < 12) return `${h}:${mStr} AM`;
    if (h === 12) return `12:${mStr} PM`;
    return `${h - 12}:${mStr} PM`;
  }
  return trimmed;
}

export function formatCurrency(amount?: number | null): string {
  if (amount == null || isNaN(amount)) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}

