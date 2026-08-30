"use client";

import { create } from "zustand";
import { TransactionToast } from "@/app/types";

interface ToastState {
  toasts: TransactionToast[];
  addToast: (toast: Omit<TransactionToast, "id">) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

let toastIdCounter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${++toastIdCounter}`;
    const newToast: TransactionToast = {
      id,
      duration: toast.duration ?? 5000,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (newToast.type !== "loading") {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearAll: () => set({ toasts: [] }),
}));
