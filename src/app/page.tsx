"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "./lib/axios";
import { useAuth } from "./store/AuthStore";
import HabitCard from "./components/HabitCard";
import ProfileMenu from "./components/ProfileMenu";

interface Habit {
  id: number;
  title: string;
  target_days: number;
  is_completed: boolean;
  create_at: string;
}

interface HabitLog {
  log_date: string;
}

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();


  const [habits, setHabits] = useState<Habit[]>([]);
  const [logsMap, setLogsMap] = useState<Record<number, string[]>>({});
  const [title, setTitle] = useState("");
  const [targetDays, setTargetDays] = useState("");
  
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  const fetchAll = async () => {
    try {
      const res = await api.get<Habit[]>("/habits");
      setHabits(res.data);

      const logsEntries = await Promise.all(
        res.data.map(async (habit) => {
          const logsRes = await api.get<HabitLog[]>(`/habits/${habit.id}/logs`);
          return [habit.id, logsRes.data.map((l) => l.log_date)] as const;
        })
      );

      setLogsMap(Object.fromEntries(logsEntries));
    } catch (error) {
      console.error(error);
    }
  };

 useEffect(() => {
    if (!user) {
      setHabits([]);
      setLogsMap({});
      return;
    }

    fetchAll();
  }, [user]);

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDays || !user?.id) return;
    try {
      await api.post("/habits", {
        title,
        target_days: Number(targetDays),
        user_id: user.id,
        userId: user.id,
      });
      setTitle("");
      setTargetDays("");
      fetchAll();
    } catch (error) {
      console.error(error);
    }
  };


  if (loading || !user) {
    return (
      <div className="w-full min-h-screen bg-dark flex items-center justify-center">
        <p className="text-cream font-skranji">Loading</p>
      </div>
    );
  }


  return (
    <div className="w-full min-h-screen bg-dark flex flex-col  items-center px-4 py-10 font-skranji">
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-cream text-3xl tracking-wide">Habit tracker</h1>
        <ProfileMenu />
      </div>

      <form onSubmit={addHabit} className="flex gap-2 mb-8 w-full max-w-md">
        <input
          placeholder="Habit name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={36}
          className="flex-1 bg-card text-cream rounded-lg px-4 py-2 outline-none border border-transparent focus:border-accent transition-colors duration-300" />
        <input
          type="number"
          placeholder="Days"
          value={targetDays}
          onChange={(e) => setTargetDays(e.target.value)}
          className="w-20 bg-card text-cream rounded-lg px-3 py-2 outline-none  border border-transparent focus:border-accent transition-colors duration-300"/>
        <button
          type="submit"
          className="bg-accent text-cream rounded-lg px-4 hover:bg-cream hover:text-accent active:scale-95 transition-all duration-300">
          +
        </button>
      </form>
      
     <div className="w-full max-w-md flex flex-col gap-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            id={habit.id}
            title={habit.title}
            targetDays={habit.target_days}
            logDates={logsMap[habit.id] ?? []}
            onChange={fetchAll}
          />
        ))}
      </div>
    </div>
  );
}