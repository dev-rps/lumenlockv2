"use client";

import { create } from "zustand";

export interface AuthUser {
  id:            string;
  name:          string;
  email:         string;
  role:          string;
  walletAddress?: string;
  city?:         string;
}

interface AuthStore {
  user:       AuthUser | null;
  isLoggedIn: boolean;
  isLoading:  boolean;
  setUser:    (user: AuthUser | null) => void;
  checkSession: () => Promise<void>;
  logout:     () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user:       null,
  isLoggedIn: false,
  isLoading:  true,

  setUser: (user) => set({ user, isLoggedIn: !!user, isLoading: false }),

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const user = await res.json() as AuthUser;
        set({ user, isLoggedIn: true, isLoading: false });
      } else {
        set({ user: null, isLoggedIn: false, isLoading: false });
      }
    } catch {
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // silent
    }
    set({ user: null, isLoggedIn: false });
  },
}));
