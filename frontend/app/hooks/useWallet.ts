"use client";

import { useEffect, useCallback } from "react";
import { useWalletStore } from "@/app/state/walletStore";
import { fetchAccountBalances } from "@/app/services/stellar";

export function useWallet() {
  const store = useWalletStore();

  const refreshBalances = useCallback(async () => {
    if (!store.address) return;
    try {
      const { xlm, usdc } = await fetchAccountBalances(store.address);
      store.setBalances(xlm, usdc);
    } catch {
      // ignore
    }
  }, [store.address]);

  useEffect(() => {
    if (store.isConnected && store.address) {
      refreshBalances();
      const interval = setInterval(refreshBalances, 15000); // 15s balance polling
      return () => clearInterval(interval);
    }
  }, [store.isConnected, store.address, refreshBalances]);

  return {
    ...store,
    refreshBalances,
  };
}
