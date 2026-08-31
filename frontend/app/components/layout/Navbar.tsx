"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  PlusCircle,
  LayoutDashboard,
  Compass,
  Activity,
  Settings,
  Wallet,
  ArrowUpRight,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
} from "@/app/components/ui/Icons";
import { useWalletStore } from "@/app/state/walletStore";
import { useAuthStore } from "@/app/state/authStore";
import { truncateAddress } from "@/app/services/formatters";
import { cn } from "@/app/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, address, xlmBalance, network, setModalOpen } = useWalletStore();
  const { user, isLoggedIn, logout } = useAuthStore();

  const navLinks = [
    { label: "Marketplace",  href: "/marketplace",  icon: Compass },
    { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
    { label: "Activity",     href: "/activity",     icon: Activity },
    { label: "Transactions", href: "/transactions", icon: ArrowUpRight },
    { label: "Feedback",     href: "/feedback",     icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col shadow-xs">

      {/* ── TIER 1: TOP UTILITY STRIP (Bar 1) ── */}
      <div className="glass-topbar w-full py-1.5 px-4 sm:px-6 lg:px-8 text-xs flex items-center justify-between gap-4 select-none">
        {/* Left: Status & Meta Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ boxShadow: "0 0 6px #34d399" }}
            />
            <span className="font-mono uppercase tracking-wider">{network || "TESTNET"}</span>
          </div>

          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Soroban Smart Escrow Protocol v2.1</span>
          </span>
        </div>

        {/* Right: Wallet Details, Profile & Utilities */}
        <div className="flex items-center gap-3">
          {/* XLM Balance */}
          {isConnected && xlmBalance && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-200 text-[11px] font-mono">
              <span className="text-indigo-400 font-bold">Balance:</span>
              <span>{xlmBalance} XLM</span>
            </div>
          )}

          {/* Connected Wallet Badge / Connect CTA */}
          {isConnected && address ? (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono transition cursor-pointer"
            >
              <Wallet className="w-3 h-3 text-indigo-400" />
              <span>{truncateAddress(address)}</span>
              <ChevronDown className="w-3 h-3 text-indigo-300/70" />
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition cursor-pointer"
            >
              <Wallet className="w-3 h-3" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Divider */}
          <div className="h-3 w-px bg-slate-700/80 hidden sm:block" />

          {/* User Session */}
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 text-[11px] font-semibold flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>{user.name.split(" ")[0]}</span>
              </span>
              <button
                onClick={() => logout()}
                className="text-slate-400 hover:text-rose-400 text-[11px] font-medium transition flex items-center gap-1 cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-slate-300 hover:text-white text-[11px] font-medium transition"
            >
              Sign In
            </Link>
          )}

          {/* Settings Icon */}
          <Link
            href="/settings"
            className="text-slate-400 hover:text-white p-0.5 rounded transition"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── TIER 2: MAIN NAVIGATION BAR (Bar 2) ── */}
      <div className="glass-nav w-full h-[52px] sm:h-[56px] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className={cn(
                "flex items-center justify-center text-white rounded-xl",
                "bg-[var(--primary-600)] shadow-sm",
                "transition-all duration-300 group-hover:scale-105",
                "w-8 h-8"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-[var(--fg-default)] text-base sm:text-lg leading-none flex items-center gap-1.5">
                LumenLock
                <span
                  className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md"
                  style={{
                    background: "var(--primary-50)",
                    color: "var(--primary-600)",
                    border: "1px solid var(--primary-200)",
                  }}
                >
                  v2
                </span>
              </span>
              <span className="text-[10px] text-[var(--fg-subtle)] font-medium hidden lg:inline leading-tight mt-0.5">
                Trustless Stellar Escrow
              </span>
            </div>
          </Link>

          {/* Central Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold",
                    "transition-all duration-150",
                    isActive
                      ? "text-[var(--primary-600)] bg-[var(--primary-50)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg-default)] hover:bg-[var(--surface-2)]"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[var(--primary-600)]" : "")} />
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--primary-600)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-2">
            <Link
              href="/create"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white",
                "bg-[var(--primary-600)] hover:bg-[var(--primary-700)] shadow-sm",
                "transition-all duration-150 active:scale-[0.97] focus-ring"
              )}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Listing</span>
            </Link>
          </div>

        </div>
      </div>

    </header>
  );
}

