
"use client";
import { getWeekDates, isToday, calculateStreak } from "../lib/streak";
import api from "../lib/axios";
type HabitCardProps = {
  id: number;
  title: string;
  targetDays: number;
  logDates: string[]; // дати виконання цієї звички
  onChange: () => void; 
};

const WEEKDAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

export default function HabitCard({ id, title, targetDays, logDates, onChange }: HabitCardProps) {

    const week = getWeekDates();
    const streak = calculateStreak(logDates);
    const doneSet = new Set(logDates);

    const toggleToday = async () => {
        const today = week.find(isToday)!;
    if (doneSet.has(today)) {
      await api.delete(`/habits/${id}/check`);
    } else {
      await api.post(`/habits/${id}/check`);
    }
    onChange();
  };
  return (
    <div
      className="group bg-card rounded-2xl p-5 flex items-center justify-between shadow-md hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-1 transition-all duration-300 ease-out border border-transparent hover:border-accent/50"
    >
      <div>
        <h3 className="text-cream text-lg font-skranji tracking-wide">{title}</h3>
        <p className="text-accent text-sm mt-1">
          🔥 {streak}/{targetDays}
        </p>
      </div>

      <div className="flex gap-2">
        {week.map((date, i) => {
          const done = doneSet.has(date);
          const today = isToday(date);

          return (
            <div key={date} className="flex flex-col items-center gap-1">
              <span className="text-accent/60 text-xs">{WEEKDAY_LABELS[i]}</span>
              <button
                disabled={!today}
                onClick={toggleToday}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${done ? "bg-accent border-accent" : "border-accent/40"}
                  ${today ? "cursor-pointer hover:scale-110 active:scale-90 ring-2 ring-cream/40" : "cursor-not-allowed opacity-50"}`}
              >
                {done && <span className="text-cream text-xs animate-[pop_0.3s_ease]">✓</span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}