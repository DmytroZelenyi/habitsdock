"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../store/AuthStore";

export default function AuthPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", nickname: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password, form.nickname);
      }
    } catch (err: any) {
      setError(
        err.response?.status === 401
          ? "Невірний email або пароль"
          : err.response?.status === 409
          ? "Цей email вже зареєстрований"
          : "Щось пішло не так, спробуй ще раз"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full min-h-screen bg-dark flex items-center justify-center font-skranji">
      <div className="bg-card rounded-2xl p-8 w-full max-w-sm shadow-xl animate-[fadeIn_0.4s_ease]">
        <h1 className="text-cream text-2xl text-center mb-6 tracking-wide">
          {isLogin ? "Вхід" : "Реєстрація"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              placeholder="Нікнейм"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              className="bg-dark text-cream rounded-lg px-4 py-2 outline-none border border-transparent focus:border-accent transition-colors duration-300"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-dark text-cream rounded-lg px-4 py-2 outline-none border border-transparent focus:border-accent transition-colors duration-300"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-dark text-cream rounded-lg px-4 py-2 outline-none border border-transparent focus:border-accent transition-colors duration-300"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-cream rounded-lg py-2 mt-2 hover:bg-cream hover:text-dark active:scale-95 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Зачекай..." : isLogin ? "Увійти" : "Зареєструватись"}
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