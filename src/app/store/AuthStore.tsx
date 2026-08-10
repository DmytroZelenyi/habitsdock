"use client";
import { useEffect } from "react";
import { create } from "zustand";
import api from "../lib/axios";

interface User {
  id: number;
  email: string;
  nickname: string;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  refreshUser: async () => {
    const token = localStorage.getItem("token");
    set({ loading: true });

    if (!token) {
      setAuthHeader(null);
      set({ user: null, loading: false });
      return;
    }

    setAuthHeader(token);

    try {
      const res = await api.get<User>("/auth/me");
      set({ user: res.data, loading: false });
    } catch {
      localStorage.removeItem("token");
      setAuthHeader(null);
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setAuthHeader(res.data.token);
    await get().refreshUser();
  },

  register: async (email, password, nickname) => {
    const res = await api.post("/auth/register", { email, password, nickname });
    localStorage.setItem("token", res.data.token);
    setAuthHeader(res.data.token);
    await get().refreshUser();
  },

  logout: () => {
    localStorage.removeItem("token");
    setAuthHeader(null);
    set({ user: null, loading: false });
  },
}));

export function AuthInitializer() {
  const refreshUser = useAuthStore((state) => state.refreshUser);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return null;
}

export function useAuth() {
  return useAuthStore();
}
