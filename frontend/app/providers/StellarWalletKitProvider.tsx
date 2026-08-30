"use client";

/**
 * StellarWalletKitProvider
 * Initializes the @creit.tech/stellar-wallets-kit singleton on mount,
 * restores session from persisted storage, listens to events, and syncs into walletStore.
 */

import { useEffect } from "react";
import React from "react";
import { useWalletStore } from "@/app/state/walletStore";
import { fetchAccountBalances } from "@/app/services/stellar";

export function StellarWalletKitProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, address, setConnected, setDisconnected, setBalances, selectedWalletId } = useWalletStore();

  // Auto-refresh balance on mount or address change if connected
  useEffect(() => {
    if (isConnected && address) {
      fetchAccountBalances(address)
        .then(({ xlm, usdc }) => {
          setBalances(xlm, usdc);
        })
        .catch(() => {});
    }
  }, [isConnected, address, setBalances]);

  useEffect(() => {
    let cleanups: Array<() => void> = [];

    (async () => {
      try {
        const kit = await import("@creit.tech/stellar-wallets-kit");
        const { StellarWalletsKit, KitEventType } = kit;
        const { defaultModules } = await import("@creit.tech/stellar-wallets-kit/modules/utils");

        StellarWalletsKit.init({ modules: defaultModules() });

        // If a wallet was selected previously, set it in kit
        if (selectedWalletId) {
          try {
            StellarWalletsKit.setWallet(selectedWalletId);
          } catch { /* ignore */ }
        }

        // Listen for address/network updates
        const offStateUpdated = StellarWalletsKit.on(
          KitEventType.STATE_UPDATED,
          async (event) => {
            const newAddress = (event as { payload: { address: string | undefined } }).payload.address;
            if (newAddress) {
              setConnected(newAddress, "TESTNET");
              try {
                const { xlm, usdc } = await fetchAccountBalances(newAddress);
                setBalances(xlm, usdc);
              } catch {
                // account might not exist yet on-chain
              }
            }
          }
        );

        // Listen for disconnect
        const offDisconnect = StellarWalletsKit.on(
          KitEventType.DISCONNECT,
          () => {
            setDisconnected();
          }
        );

        cleanups = [offStateUpdated, offDisconnect];
      } catch (err) {
        console.warn("[StellarWalletKitProvider] Failed to init kit:", err);
      }
    })();

    return () => {
      cleanups.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
