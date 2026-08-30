"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Github, BookOpen } from "@/app/components/ui/Icons";
import { getExplorerUrl } from "@/app/services/formatters";

export function Footer() {
  const registryContractId =
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ID ||
    "CDVABICJWCR6AMMCF3FY55GFVF7CIPRTY6IA53YLWF65RYSZN5DNO3GP";
  const vaultContractId =
    process.env.NEXT_PUBLIC_ESCROW_VAULT_CONTRACT_ID ||
    "CBXIOF3DI2FHF3IVD6AMB552OFZCTWSQWM4RYNARLPEMAJD4SXLI3WAP";

  return (
    <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900">
                LumenLock Protocol v2
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Decentralized escrow and settlement infrastructure on Stellar Soroban. Bilateral dual-confirmation, milestone-based releases, dispute freezing, and automatic refunds.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/dev-rps/lumenlock"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition font-medium"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
              <span className="text-slate-300">•</span>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition font-medium"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Documentation</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Protocol Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/marketplace" className="hover:text-blue-600 transition">
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-blue-600 transition">
                  Create Milestone Listing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 transition">
                  User Dashboard & Escrows
                </Link>
              </li>
              <li>
                <Link href="/activity" className="hover:text-blue-600 transition">
                  Live Event Stream
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Contracts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Testnet Contracts
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-[11px] text-slate-400 block">Marketplace Registry</span>
                <a
                  href={getExplorerUrl(registryContractId, "contract")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <span>{registryContractId.slice(0, 8)}...{registryContractId.slice(-6)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Escrow Vault</span>
                <a
                  href={getExplorerUrl(vaultContractId, "contract")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <span>{vaultContractId.slice(0, 8)}...{vaultContractId.slice(-6)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LumenLock. Built on Stellar Soroban.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Stellar Testnet Live</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
