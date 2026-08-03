"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../lib/axios";

interface User {
  id: number;
  email: string;
  nickname: string;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthHeader(null);
      setUser(null);
      setLoading(false);
      return;
    }

    setAuthHeader(token);
    try {
      const res = await api.get<User>("/auth/me");
      setUser(res.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setAuthHeader(res.data.token);
    await refreshUser();
  };

  const register = async (email: string, password: string, nickname: string) => {
    const res = await api.post("/auth/register", { email, password, nickname });
    localStorage.setItem("token", res.data.token);
    setAuthHeader(res.data.token);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthHeader(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}