"use client";
import { useEffect, useState } from "react";
import api from "./lib/axios";

interface Habit {
  id: number;
  title: string;
  target_days: number;
  is_completed: boolean;
  create_at: string;
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [title, setTitle] = useState("");
  const [targetDays, setTargetDays] = useState("");

  const fetchHabits = async () => {
    try {
      const res = await api.get<Habit[]>("/habits");
      setHabits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDays) return;
    try {
      await api.post("/habits", { title, target_days: Number(targetDays) });
      setTitle("");
      setTargetDays("");
      fetchHabits();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-dark flex flex-col items-center px-4 py-10 font-skranji">
      <h1 className="text-cream text-3xl mb-8 tracking-wide">Habit tracker</h1>

      <form onSubmit={addHabit} className="flex gap-2 mb-8 w-full max-w-md">
        <input
          placeholder="Назва звички"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-card text-cream rounded-lg px-4 py-2 outline-none border border-transparent focus:border-accent transition-colors duration-300" />
        <input
          type="number"
          placeholder="Днів"
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
          <div
            key={habit.id}
            className="bg-card rounded-2xl p-4 flex justify-between items-center hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20
            transition-all duration-300 animate-[fadeIn_0.4s_ease]"
            
          >
            <span className="text-cream">{habit.title}</span>
            <span className="text-accent text-sm">{habit.target_days} дн.</span>
          </div>
        ))}
      </div>
    </div>
  );
}