const pad = (value: number) => String(value).padStart(2, "0");

// Local calendar day as "2026-10-16". Used to know when "today" changes.
function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getToday(): string {
  return toDayKey(new Date());
}

export function getYesterday(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return toDayKey(date);
}

// Moves a day by some days, forward or back: ("2026-10-16", -1) -> "2026-10-15".
export function addDays(day: string, days: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return toDayKey(new Date(year, month - 1, date + days));
}

const weekdayLetters = ["M", "T", "W", "T", "F", "S", "S"];

// The seven days of this week, Monday first.
export function getWeekDays() {
  const today = getToday();
  const daysSinceMonday = (new Date().getDay() + 6) % 7;

  return weekdayLetters.map((label, index) => {
    const date = addDays(today, index - daysSinceMonday);
    return { date, label, isToday: date === today, isFuture: date > today };
  });
}
