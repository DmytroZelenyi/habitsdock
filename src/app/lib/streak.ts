function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// рахує поспіль дні від сьогодні назад
export function calculateStreak(logDates: string[]): number {
  const dates = new Set(logDates);
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = toLocalDateString(cursor);
    if (dates.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// дає масив із 7 дат поточного тижня (Пн→Нд) для кружечків
export function getWeekDates(): string[] {
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayIndex);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toLocalDateString(d);
  });
}

export function isToday(dateStr: string): boolean {
  return dateStr === toLocalDateString(new Date());
}