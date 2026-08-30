"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { WalletState } from "@/app/types";

interface WalletStore extends WalletState {
  isModalOpen: boolean;
  selectedWalletId: string | null;
  setConnected: (address: string, network?: string, walletId?: string) => void;
  setDisconnected: () => void;
  setBalances: (xlm: string, usdc: string) => void;
  setConnecting: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setModalOpen: (open: boolean) => void;
  setSelectedWalletId: (walletId: string | null) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      isConnected: false,
      address: null,
      network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET",
      xlmBalance: "0",
      usdcBalance: "0",
      isConnecting: false,
      error: null,
      isModalOpen: false,
      selectedWalletId: null,

      setConnected: (address, network, walletId) =>
        set((state) => ({
          isConnected: true,
          address,
          network: network || state.network,
          selectedWalletId: walletId || state.selectedWalletId,
          isConnecting: false,
          error: null,
          isModalOpen: false,
        })),

      setDisconnected: () =>
        set({
          isConnected: false,
          address: null,
          xlmBalance: "0",
          usdcBalance: "0",
          isConnecting: false,
          error: null,
          selectedWalletId: null,
        }),

      setBalances: (xlmBalance, usdcBalance) =>
        set({
          xlmBalance,
          usdcBalance,
        }),

      setConnecting: (isConnecting) => set({ isConnecting }),
      setError: (error) => set({ error, isConnecting: false }),
      setModalOpen: (isModalOpen) => set({ isModalOpen }),
      setSelectedWalletId: (selectedWalletId) => set({ selectedWalletId }),
    }),
    {
      name: "lumenlock_wallet_session",
      storage: createJSONStorage(() => localStorage),
      // Don't persist transient UI state like modal open or loading spinner
      partialize: (state) => ({
        isConnected: state.isConnected,
        address: state.address,
        network: state.network,
        selectedWalletId: state.selectedWalletId,
        xlmBalance: state.xlmBalance,
        usdcBalance: state.usdcBalance,
      }),
    }
  )
);
