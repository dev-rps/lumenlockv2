"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Github, BookOpen } from "@/app/components/ui/Icons";
import { getExplorerUrl } from "@/app/services/formatters";
import { cn } from "@/app/lib/utils";

export function Footer() {
  const registryContractId =
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ID ||
    "CDVABICJWCR6AMMCF3FY55GFVF7CIPRTY6IA53YLWF65RYSZN5DNO3GP";
  const vaultContractId =
    process.env.NEXT_PUBLIC_ESCROW_VAULT_CONTRACT_ID ||
    "CBXIOF3DI2FHF3IVD6AMB552OFZCTWSQWM4RYNARLPEMAJD4SXLI3WAP";

  const linkClass = cn(
    "text-[var(--fg-muted)] hover:text-[var(--primary-600)]",
    "transition-colors duration-150",
    "relative after:absolute after:bottom-0 after:left-0 after:h-px",
    "after:w-0 hover:after:w-full after:bg-[var(--primary-400)]",
    "after:transition-[width] after:duration-200"
  );

  return (
    <footer
      className="mt-auto border-t border-[var(--border-subtle)]"
      style={{ background: "var(--surface-1)" }}
    >
      {/* Subtle top gradient */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent, var(--primary-100), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-10">

          {/* ── Brand ── */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{
                  background: "var(--primary-600)",
                  boxShadow: "0 2px 8px rgba(79,70,229,0.25)",
                }}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display font-bold text-[var(--fg-default)] text-base block leading-tight">
                  LumenLock Protocol
                </span>
                <span className="text-[11px] text-[var(--fg-subtle)] font-medium">v2 · Stellar Soroban</span>
              </div>
            </div>

            <p className="text-xs text-[var(--fg-muted)] max-w-sm leading-relaxed">
              Decentralized escrow and settlement infrastructure on Stellar Soroban.
              Bilateral dual-confirmation, milestone-based releases, dispute freezing, and automatic refunds.
            </p>

            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://github.com/dev-rps/lumenlock"
                target="_blank"
                rel="noreferrer"
                className={cn("inline-flex items-center gap-1.5 text-xs font-medium", linkClass)}
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <Link
                href="/settings"
                className={cn("inline-flex items-center gap-1.5 text-xs font-medium", linkClass)}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Docs</span>
              </Link>
            </div>
          </div>

          {/* ── Protocol Hub ── */}
          <div className="space-y-4">
            <h4
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--fg-default)" }}
            >
              Protocol Hub
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Browse Marketplace", href: "/marketplace" },
                { label: "Create Milestone Listing", href: "/create" },
                { label: "Dashboard & Escrows", href: "/dashboard" },
                { label: "Live Event Stream", href: "/activity" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={cn("text-xs font-medium", linkClass)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contracts ── */}
          <div className="space-y-4">
            <h4
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--fg-default)" }}
            >
              Testnet Contracts
            </h4>
            <div className="space-y-3">
              {[
                { label: "Marketplace Registry", id: registryContractId },
                { label: "Escrow Vault", id: vaultContractId },
              ].map((c) => (
                <div key={c.label}>
                  <span className="text-[11px] text-[var(--fg-subtle)] block mb-0.5">
                    {c.label}
                  </span>
                  <a
                    href={getExplorerUrl(c.id, "contract")}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md",
                      "border border-[var(--border-subtle)] bg-[var(--surface-2)]",
                      "text-[var(--primary-600)] hover:text-[var(--primary-700)]",
                      "hover:border-[var(--primary-200)] transition-all duration-150"
                    )}
                  >
                    <span>
                      {c.id.slice(0, 8)}...{c.id.slice(-6)}
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-[var(--fg-subtle)]">
            © {new Date().getFullYear()} LumenLock. Built on Stellar Soroban.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--fg-subtle)]">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--success-icon)]"
              style={{ boxShadow: "0 0 0 3px rgba(22,163,74,0.15)" }}
            />
            <span>Stellar Testnet Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
