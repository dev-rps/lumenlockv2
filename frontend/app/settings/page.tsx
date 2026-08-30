"use client";

import React, { useState } from "react";
import { useWalletStore } from "@/app/state/walletStore";
import { useToastStore } from "@/app/state/toastStore";
import { STELLAR_CONFIG } from "@/app/services/stellar";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { getExplorerUrl } from "@/app/services/formatters";
import {
  Droplets,
  ExternalLink,
  Server,
  Key,
} from "@/app/components/ui/Icons";

export default function SettingsPage() {
  const { isConnected, address, network } = useWalletStore();
  const { addToast } = useToastStore();
  const [isFunding, setIsFunding] = useState(false);

  const handleFaucet = async () => {
    if (!address) {
      addToast({
        type: "warning",
        title: "Connect Wallet",
        description: "Please connect your Stellar account first.",
      });
      return;
    }

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
    } catch {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Settings & Network Diagnostics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Verify contract addresses, testnet RPC endpoints, and account test funds.
        </p>
      </div>

      {/* Network Config Card */}
      <Card className="p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Stellar Network Configuration</h3>
            <p className="text-xs text-slate-500">Connected to official Soroban RPC node.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block">Active Network</span>
            <span className="font-mono font-bold text-slate-900">{network}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block">Soroban RPC URL</span>
            <span className="font-mono font-bold text-slate-900 truncate block">
              {STELLAR_CONFIG.sorobanRpcUrl}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block">Horizon API URL</span>
            <span className="font-mono font-bold text-slate-900 truncate block">
              {STELLAR_CONFIG.horizonUrl}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block">Network Passphrase</span>
            <span className="font-mono font-medium text-slate-700 truncate block">
              {STELLAR_CONFIG.networkPassphrase}
            </span>
          </div>
        </div>
      </Card>

      {/* Verified Smart Contracts Card */}
      <Card className="p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Verified Protocol Contracts</h3>
            <p className="text-xs text-slate-500">Deployed Soroban WASM contracts on Testnet.</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 block">MarketplaceRegistry Contract</span>
              <span className="font-mono text-slate-500 break-all">
                {STELLAR_CONFIG.marketplaceContractId}
              </span>
            </div>
            <a
              href={getExplorerUrl(STELLAR_CONFIG.marketplaceContractId, "contract")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold shrink-0"
            >
              <span>View Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 block">EscrowVault Custody Contract</span>
              <span className="font-mono text-slate-500 break-all">
                {STELLAR_CONFIG.escrowVaultContractId}
              </span>
            </div>
            <a
              href={getExplorerUrl(STELLAR_CONFIG.escrowVaultContractId, "contract")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold shrink-0"
            >
              <span>View Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 block">Designated Arbiter Account</span>
              <span className="font-mono text-slate-500 break-all">
                {STELLAR_CONFIG.arbiterAddress}
              </span>
            </div>
            <a
              href={getExplorerUrl(STELLAR_CONFIG.arbiterAddress, "account")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold shrink-0"
            >
              <span>View Account</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Card>

      {/* Friendbot Faucet Card */}
      <Card className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Stellar Friendbot Test Faucet</h3>
              <p className="text-xs text-slate-500">Fund your connected testnet keypair with 10,000 XLM.</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleFaucet}
            isLoading={isFunding}
            disabled={!isConnected}
            leftIcon={<Droplets className="w-3.5 h-3.5" />}
          >
            Fund 10,000 XLM
          </Button>
        </div>
      </Card>
    </div>
  );
}
