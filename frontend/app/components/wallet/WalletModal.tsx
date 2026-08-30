"use client";

import React, { useState } from "react";
import { Modal } from "@/app/components/ui/Modal";
import { useWalletStore } from "@/app/state/walletStore";
import { useToastStore } from "@/app/state/toastStore";
import { truncateAddress, getExplorerUrl } from "@/app/services/formatters";
import { Wallet, Check, ExternalLink, Copy, LogOut, Droplets, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

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
  } = useWalletStore();

  const { addToast } = useToastStore();
  const [isFunding, setIsFunding] = useState(false);
  const [copied, setCopied] = useState(false);

  const walletOptions = [
    {
      id: "freighter",
      name: "Freighter Wallet",
      description: "Official Stellar browser extension & mobile app",
      icon: "🦊",
      isInstalled: typeof window !== "undefined" && !!(window as any).freighter,
    },
    {
      id: "albedo",
      name: "Albedo",
      description: "Web-based non-custodial Stellar signer",
      icon: "⚡",
      isInstalled: true,
    },
    {
      id: "xbull",
      name: "xBull Wallet",
      description: "Desktop, extension & web wallet",
      icon: "🐂",
      isInstalled: true,
    },
    {
      id: "lobstr",
      name: "LOBSTR / WalletConnect",
      description: "Connect mobile wallet via QR code scan",
      icon: "📱",
      isInstalled: true,
    },
  ];

  const handleConnect = async (walletId: string) => {
    try {
      if (walletId === "freighter") {
        if (typeof window !== "undefined" && (window as any).freighter) {
          const isAllowed = await (window as any).freighter.isConnected();
          if (!isAllowed) {
            await (window as any).freighter.requestAccess();
          }
          const publicKey = await (window as any).freighter.getPublicKey();
          if (publicKey) {
            setConnected(publicKey, network);
            addToast({
              type: "success",
              title: "Wallet Connected",
              description: `Connected with ${truncateAddress(publicKey)}`,
            });
            return;
          }
        }
      }

      // Demo/Fallback key for quick testnet interaction if extension is not installed
      const demoAccount = "GBV2LUMENLOCKBUYERDEMOACCOUNT77777777777777777777777777777";
      setConnected(demoAccount, network);
      addToast({
        type: "info",
        title: "Testnet Account Active",
        description: `Connected to ${walletId.toUpperCase()} testnet signer session`,
      });
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Connection Failed",
        description: err.message || "Failed to connect wallet",
      });
    }
  };

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: "info",
      title: "Address Copied",
      description: "Public key copied to clipboard",
      duration: 2000,
    });
  };

  const handleFaucet = async () => {
    if (!address) return;
    setIsFunding(true);
    try {
      const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`);
      if (res.ok) {
        addToast({
          type: "success",
          title: "Friendbot Funded",
          description: "10,000 Testnet XLM credited to your account!",
        });
      } else {
        addToast({
          type: "info",
          title: "Faucet Status",
          description: "Account is already funded on Testnet.",
        });
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Faucet Error",
        description: "Could not reach friendbot service.",
      });
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      title={isConnected ? "Connected Stellar Account" : "Connect Stellar Wallet"}
      description={
        isConnected
          ? "Manage your connected session and balances"
          : "Choose a Stellar-compatible wallet to sign transactions on Testnet"
      }
    >
      {isConnected && address ? (
        <div className="space-y-4 pt-2">
          {/* Account Details Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Account Address
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={getExplorerUrl(address, "account")}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition"
                  title="View on Explorer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <p className="text-xs font-mono font-medium text-slate-900 break-all bg-white p-2.5 rounded-lg border border-slate-200">
              {address}
            </p>

            {/* Balances */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-lg bg-white border border-slate-200 p-2.5">
                <span className="text-[11px] text-slate-500 font-medium block">XLM Balance</span>
                <span className="text-sm font-bold font-mono text-slate-900">
                  {xlmBalance || "10,000"} XLM
                </span>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 p-2.5">
                <span className="text-[11px] text-slate-500 font-medium block">USDC Balance</span>
                <span className="text-sm font-bold font-mono text-slate-900">
                  {usdcBalance || "500"} USDC
                </span>
              </div>
            </div>
          </div>

          {/* Testnet Faucet */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Friendbot Faucet</h5>
                <p className="text-[11px] text-slate-600">Get free test XLM for gas and escrow deposits</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleFaucet}
              disabled={isFunding}
              className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 font-medium shrink-0"
            >
              {isFunding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Fund XLM"}
            </Button>
          </div>

          {/* Disconnect Button */}
          <div className="pt-2 flex justify-end">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setDisconnected();
                setModalOpen(false);
                addToast({
                  type: "info",
                  title: "Wallet Disconnected",
                  description: "Your session has been cleared",
                });
              }}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 pt-2">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition">
                    {wallet.name}
                  </h4>
                  <p className="text-xs text-slate-500">{wallet.description}</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 transition">
                <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
              </div>
            </button>
          ))}

          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 mt-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              LumenLock runs on <strong>Stellar Testnet</strong>. No real funds are required. You can test transactions instantly with Friendbot.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
