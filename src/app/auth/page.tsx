"use client";
import { useState } from "react";
import api from "../lib/axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    try {
      const res = await api.post(endpoint, form);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-dark flex items-center justify-center font-skranji">
      <div className="bg-card rounded-2xl p-8 w-full max-w-sm shadow-xl animate-[fadeIn_0.4s_ease]">
        <h1 className="text-cream text-2xl text-center mb-6 tracking-wide">
          {isLogin ? "Вхід" : "Реєстрація"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-dark text-cream rounded-lg px-4 py-2 outline-none
            border border-transparent focus:border-accent transition-colors duration-300"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-dark text-cream rounded-lg px-4 py-2 outline-none
            border border-transparent focus:border-accent transition-colors duration-300"
          />

          <button
            type="submit"
            className="bg-accent text-cream rounded-lg py-2 mt-2
            hover:bg-cream hover:text-dark active:scale-95
            transition-all duration-300"
          >
            {isLogin ? "Увійти" : "Зареєструватись"}
          </button>
        </form>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-accent text-sm text-center mt-5 cursor-pointer hover:text-cream transition-colors duration-300"
        >
          {isLogin ? "Немає акаунту? Зареєструватись" : "Вже є акаунт? Увійти"}
        </p>
      </div>
    </div>
  );
}