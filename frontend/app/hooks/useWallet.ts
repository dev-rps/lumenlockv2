"use client";

import { useEffect, useCallback } from "react";
import { useWalletStore } from "@/app/state/walletStore";
import { fetchAccountBalances } from "@/app/services/stellar";

export function useWallet() {
  const store = useWalletStore();
  const address = store.address;
  const setBalances = store.setBalances;

  const refreshBalances = useCallback(async () => {
    if (!address) return;
    try {
      const { xlm, usdc } = await fetchAccountBalances(address);
      setBalances(xlm, usdc);
    } catch {
      // ignore
    }
  }, [address, setBalances]);

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
