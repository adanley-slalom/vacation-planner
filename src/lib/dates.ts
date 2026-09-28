// Formats an ISO "YYYY-MM-DD" date string for display, e.g. "Apr 3, 2026".
// Parses using local date parts (not `new Date(iso)`) to avoid UTC off-by-one shifts.
export function formatDisplayDate(value: string): string {
  if (!value) return value;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Formats an ISO date range, e.g. "Apr 3 – Apr 7, 2026".
export function formatDisplayDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return [startDate, endDate].filter(Boolean).join(' to ');

  const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
  if (!startYear || !endYear) return `${startDate} to ${endDate}`;

  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);

  const sameYear = startYear === endYear;
  const startLabel = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  });
  const endLabel = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `${startLabel} – ${endLabel}`;
}

// Number of nights between two ISO "YYYY-MM-DD" dates, e.g. for a stay length.
export function nightsBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
  if (!startYear || !endYear) return 0;
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}
