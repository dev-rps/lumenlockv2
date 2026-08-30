"use client";

/**
 * StellarWalletKitProvider
 * Initializes the @creit.tech/stellar-wallets-kit singleton on mount,
 * listens to STATE_UPDATED and DISCONNECT events, and syncs into walletStore.
 */

import { useEffect } from "react";
import React from "react";
import { useWalletStore } from "@/app/state/walletStore";
import { fetchAccountBalances } from "@/app/services/stellar";

export function StellarWalletKitProvider({ children }: { children: React.ReactNode }) {
  const { setConnected, setDisconnected, setBalances } = useWalletStore();

  useEffect(() => {
    let cleanups: Array<() => void> = [];

    (async () => {
      try {
        // All exports come from the root package path
        const kit = await import("@creit.tech/stellar-wallets-kit");
        const { StellarWalletsKit, KitEventType } = kit;
        const { defaultModules } = await import("@creit.tech/stellar-wallets-kit/modules/utils");

        StellarWalletsKit.init({ modules: defaultModules() });

        // Listen for address/network updates (fired whenever wallet connects)
        const offStateUpdated = StellarWalletsKit.on(
          KitEventType.STATE_UPDATED,
          async (event) => {
            const address = (event as { payload: { address: string | undefined } }).payload.address;
            if (address) {
              setConnected(address, "TESTNET");
              try {
                const { xlm, usdc } = await fetchAccountBalances(address);
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
  }, []);

  return <>{children}</>;
}
