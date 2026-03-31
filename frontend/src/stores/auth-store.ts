"use client";

import { create } from "zustand";
import { User } from "@/types";

// Cookie helpers
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  hydrated: false,

  setAuth: (user, accessToken, refreshToken) => {
    setCookie("access_token", accessToken);
    setCookie("refresh_token", refreshToken);
    setCookie("user", JSON.stringify(user));
    setCookie("is_authenticated", "true");
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  setUser: (user) => {
    setCookie("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    deleteCookie("user");
    deleteCookie("is_authenticated");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const accessToken = getCookie("access_token");
    const refreshToken = getCookie("refresh_token");
    const userStr = getCookie("user");
    const isAuthenticated = getCookie("is_authenticated") === "true";

    let user: User | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        user = null;
      }
    }

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: isAuthenticated && !!accessToken,
      hydrated: true,
    });
  },
}));
