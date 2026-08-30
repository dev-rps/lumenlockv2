"use client";

import { create } from "zustand";

export interface PendingTransaction {
  hash: string;
  type: string;
  description: string;
  status: "pending" | "success" | "failed";
  timestamp: number;
  error?: string;
}

interface TxStore {
  transactions: PendingTransaction[];
  addTx: (tx: Omit<PendingTransaction, "timestamp">) => void;
  updateTxStatus: (hash: string, status: "success" | "failed", error?: string) => void;
  clearHistory: () => void;
}

export const useTxStore = create<TxStore>((set) => ({
  transactions: [],
  addTx: (tx) =>
    set((state) => ({
      transactions: [
        { ...tx, timestamp: Date.now() },
        ...state.transactions.slice(0, 49), // retain last 50 transactions
      ],
    })),
  updateTxStatus: (hash, status, error) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.hash === hash ? { ...t, status, error } : t
      ),
    })),
  clearHistory: () => set({ transactions: [] }),
}));
