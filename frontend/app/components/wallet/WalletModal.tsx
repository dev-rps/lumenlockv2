"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/app/components/ui/Modal";
import { useWalletStore } from "@/app/state/walletStore";
import { useToastStore } from "@/app/state/toastStore";
import { truncateAddress, getExplorerUrl } from "@/app/services/formatters";
import {
  Wallet,
  Check,
  ExternalLink,
  Copy,
  LogOut,
  Droplets,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
} from "@/app/components/ui/Icons";
import { Button } from "@/app/components/ui/Button";
import { fetchAccountBalances } from "@/app/services/stellar";

interface SupportedWallet {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
  isPlatformWrapper: boolean;
  icon: string;
  url: string;
}

export function WalletModal() {
  const {
    isModalOpen,
    setModalOpen,
    isConnected,
    address,
    network,
    xlmBalance,
    usdcBalance,
    setConnected,
    setDisconnected,
    setBalances,
    setConnecting,
  } = useWalletStore();

  const { addToast } = useToastStore();

  const [wallets, setWallets] = useState<SupportedWallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [isFunding, setIsFunding] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadWallets = useCallback(async () => {
    setWalletsLoading(true);
    try {
      const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
      const { defaultModules } = await import("@creit.tech/stellar-wallets-kit/modules/utils");

      try { StellarWalletsKit.init({ modules: defaultModules() }); } catch { /* already init */ }

      const supported = await StellarWalletsKit.refreshSupportedWallets();
      setWallets(supported as SupportedWallet[]);
    } catch (err) {
      console.error("Failed to load wallets:", err);
      setWallets([]);
    } finally {
      setWalletsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen && !isConnected) {
      loadWallets();
    }
  }, [isModalOpen, isConnected, loadWallets]);

  const handleConnect = async (walletId: string) => {
    setConnectingId(walletId);
    setConnecting(true);

    try {
      let publicKey: string | null = null;

      // Special direct handling for Freighter
      if (walletId === "freighter") {
        // Method A: @stellar/freighter-api
        try {
          const freighterApi = await import("@stellar/freighter-api");
          const accessRes = await freighterApi.requestAccess();
          if (accessRes?.address) {
            publicKey = accessRes.address;
          } else if (accessRes?.error) {
            console.warn("[Freighter] requestAccess error:", accessRes.error);
          } else {
            const addrRes = await freighterApi.getAddress();
            if (addrRes?.address) publicKey = addrRes.address;
          }
        } catch (fErr) {
          console.warn("[WalletModal] freighter-api requestAccess failed:", fErr);
        }

        // Method B: Direct window.freighter call
        if (!publicKey && typeof window !== "undefined") {
          const winAny = window as any;
          if (winAny.freighter) {
            try {
              if (typeof winAny.freighter.requestAccess === "function") {
                const res = await winAny.freighter.requestAccess();
                if (typeof res === "string" && res.length > 10) publicKey = res;
                else if (res?.publicKey) publicKey = res.publicKey;
                else if (res?.address) publicKey = res.address;
              }
              if (!publicKey && typeof winAny.freighter.getPublicKey === "function") {
                publicKey = await winAny.freighter.getPublicKey();
              }
            } catch (wErr) {
              console.warn("[WalletModal] window.freighter fallback failed:", wErr);
            }
          }
        }
      }

      // Method C: StellarWalletsKit fallback for all wallets
      if (!publicKey) {
        try {
          const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
          StellarWalletsKit.setWallet(walletId);
          const res = await StellarWalletsKit.getAddress();
          publicKey = res?.address || null;
        } catch (kitErr) {
          console.warn("[WalletModal] StellarWalletsKit getAddress failed:", kitErr);
        }
      }

      if (!publicKey) {
        const isFreighterInstalled =
          typeof window !== "undefined" &&
          !!((window as any).freighter || (window as any).stellar?.provider === "freighter");

        if (walletId === "freighter" && !isFreighterInstalled) {
          throw new Error(
            "Freighter extension is not installed in your browser. Click 'Install Extension' or use the Instant Testnet Demo Wallet below."
          );
        }

        throw new Error(
          "Could not get account address. Please unlock your wallet extension and accept the connection request prompt."
        );
      }

      try {
        const { xlm, usdc } = await fetchAccountBalances(publicKey);
        setBalances(xlm, usdc);
      } catch { /* account might be unfunded */ }

      setConnected(publicKey, network, walletId);
      setModalOpen(false);

      addToast({
        type: "success",
        title: "Wallet Connected",
        description: `Connected: ${truncateAddress(publicKey, 6, 4)}`,
      });
    } catch (err: any) {
      let msg = "Failed to connect wallet";
      if (typeof err === "string") {
        msg = err;
      } else if (err && typeof err === "object") {
        msg = err.message || err.error || String(err);
      }

      addToast({
        type: "error",
        title: "Connection Failed",
        description: msg,
      });
    } finally {
      setConnectingId(null);
      setConnecting(false);
    }
  };

  const handleDemoConnect = () => {
    const demoKey = "GBV2LUMENLOCKBUYERDEMOACCOUNT77777777777777777777777777777";
    setConnected(demoKey, "TESTNET", "demo");
    setBalances("10,000", "500");
    setModalOpen(false);
    addToast({
      type: "info",
      title: "Testnet Demo Account Active",
      description: "Connected to Stellar Testnet simulated signer session.",
    });
  };

  const handleDisconnect = async () => {
    try {
      const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
      await StellarWalletsKit.disconnect();
    } catch { /* ignore */ }
    setDisconnected();
    setModalOpen(false);
    addToast({ type: "info", title: "Wallet Disconnected", description: "Session cleared." });
  };

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ type: "info", title: "Copied", description: "Public key copied to clipboard", duration: 2000 });
  };

  const handleFaucet = async () => {
    if (!address) return;
    setIsFunding(true);
    try {
      const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`);
      if (res.ok) {
        const { xlm, usdc } = await fetchAccountBalances(address);
        setBalances(xlm, usdc);
        addToast({ type: "success", title: "Funded!", description: "10,000 Testnet XLM credited!" });
      } else {
        addToast({ type: "info", title: "Already Funded", description: "Account already has test XLM." });
      }
    } catch {
      addToast({ type: "error", title: "Faucet Error", description: "Could not reach Friendbot." });
    } finally {
      setIsFunding(false);
    }
  };

  const sortedWallets = [...wallets].sort((a, b) =>
    a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1
  );

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      title={isConnected ? "Connected Stellar Account" : "Connect Stellar Wallet"}
      description={
        isConnected
          ? "Manage your connected session and balances"
          : "Choose a Stellar-compatible wallet to sign Soroban transactions"
      }
    >
      {/* ── CONNECTED STATE ── */}
      {isConnected && address ? (
        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stellar Account</span>
              <div className="flex items-center gap-1.5">
                <button onClick={handleCopy} className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition" title="Copy">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a href={getExplorerUrl(address, "account")} target="_blank" rel="noreferrer"
                  className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <p className="text-xs font-mono font-medium text-slate-900 break-all bg-white p-2.5 rounded-lg border border-slate-200">{address}</p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-lg bg-white border border-slate-200 p-2.5">
                <span className="text-[11px] text-slate-500 font-medium block">XLM Balance</span>
                <span className="text-sm font-bold font-mono text-slate-900">{xlmBalance || "—"} XLM</span>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 p-2.5">
                <span className="text-[11px] text-slate-500 font-medium block">USDC Balance</span>
                <span className="text-sm font-bold font-mono text-slate-900">{usdcBalance || "—"} USDC</span>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800">{network} · Soroban Active</span>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Friendbot Faucet</h5>
                <p className="text-[11px] text-slate-600">Get 10,000 test XLM for gas and escrow</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={handleFaucet} isLoading={isFunding}
              className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 font-medium shrink-0">
              {isFunding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Fund XLM"}
            </Button>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="danger" size="sm" onClick={handleDisconnect} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
              Disconnect Wallet
            </Button>
          </div>
        </div>
      ) : (
        /* ── WALLET SELECTION STATE ── */
        <div className="space-y-3 pt-2">
          {walletsLoading ? (
            <div className="flex flex-col items-center gap-3 py-10 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-medium">Detecting available wallets...</span>
            </div>
          ) : sortedWallets.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-600">No extension wallets detected</p>
              <Button size="sm" variant="outline" onClick={loadWallets} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>Retry</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedWallets.map((wallet) => {
                const isThis = connectingId === wallet.id;
                return (
                  <button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet.id)}
                    disabled={!!connectingId}
                    className={[
                      "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left group cursor-pointer",
                      wallet.isAvailable
                        ? "border-slate-200 hover:border-blue-400 hover:bg-blue-50/40"
                        : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/60",
                      isThis ? "border-blue-500 bg-blue-50" : "",
                    ].filter(Boolean).join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      {/* Real wallet icon from the kit */}
                      {wallet.icon ? (
                        <img
                          src={wallet.icon}
                          alt={wallet.name}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-xl object-contain bg-white border border-slate-200 p-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-slate-500" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition">{wallet.name}</h4>
                          {wallet.isAvailable ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Detected</span>
                          ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">Extension Needed</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-slate-500 capitalize">{wallet.type.toLowerCase().replace(/_/g, " ")}</p>
                          {!wallet.isAvailable && wallet.url && (
                            <a href={wallet.url} target="_blank" rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] text-blue-600 font-medium hover:underline">
                              Install Extension →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isThis
                        ? <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        : <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 transition">
                            <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                          </div>
                      }
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Testnet Demo Fallback Button */}
          <div className="pt-2">
            <button
              onClick={handleDemoConnect}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 transition text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900">Instant Testnet Demo Wallet</h4>
                  <p className="text-[11px] text-blue-700">Connect pre-funded test account without extensions</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">Use 1-Click Demo →</span>
            </button>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Freighter Setup:</strong> If Freighter extension is installed in Chrome, make sure it is unlocked. Otherwise click <strong>Install Extension</strong> or use the <strong>Instant Testnet Demo Wallet</strong>.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
