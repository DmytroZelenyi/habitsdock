"use client";
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";

export default function ProfileMenu() {
  const { user, logout, refreshUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

    const avatarSrc = user.avatar_url || null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setSaving(true);
    try {
      await api.patch("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshUser();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleNicknameSave = async () => {
    if (!nickname.trim()) return;
    setSaving(true);
    try {
      await api.patch("/auth/profile", { nickname });
      await refreshUser();
      setEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
      >
        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center overflow-hidden text-cream text-sm font-bold">
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            user.nickname.charAt(0).toUpperCase()
          )}
        </div>
        <span className="text-cream text-sm">{user.nickname}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-[#2f302b] rounded-xl shadow-xl p-4 flex flex-col gap-3 z-10 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleAvatarClick}
              className="w-16 h-16 rounded-full bg-accent flex items-center justify-center overflow-hidden text-cream text-xl font-bold hover:opacity-80 transition-opacity duration-200"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user.nickname.charAt(0).toUpperCase()
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-accent text-xs">Натисни, щоб змінити фото</span>
          </div>

          {editing ? (
            <div className="flex gap-2">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="flex-1 bg-dark text-cream rounded-lg px-2 py-1 text-sm outline-none border border-transparent focus:border-accent transition-colors duration-300"
              />
              <button
                onClick={handleNicknameSave}
                disabled={saving}
                className="bg-accent text-cream rounded-lg px-3 text-sm hover:bg-cream hover:text-dark transition-colors duration-300 disabled:opacity-50"
              >
                ✓
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-cream text-sm text-center hover:text-accent transition-colors duration-300"
            >
              Змінити нікнейм
            </button>
          )}

          <button
            onClick={logout}
            className="text-red-400 text-sm hover:text-red-300 transition-colors duration-300 mt-2"
          >
            Вийти
          </button>
        </div>
      )}
    </div>
  );
}