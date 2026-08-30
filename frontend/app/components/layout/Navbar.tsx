"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, PlusCircle, LayoutDashboard, Compass, Activity, Settings, Wallet, ArrowUpRight } from "@/app/components/ui/Icons";
import { useWalletStore } from "@/app/state/walletStore";
import { truncateAddress } from "@/app/services/formatters";
import { cn } from "@/app/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, address, xlmBalance, network, setModalOpen } = useWalletStore();

  const navLinks = [
    { label: "Marketplace", href: "/marketplace", icon: Compass },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Activity", href: "/activity", icon: Activity },
    { label: "Transactions", href: "/transactions", icon: ArrowUpRight },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
              LumenLock
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                v2
              </span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Trustless Stellar Escrow
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-slate-100 text-blue-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5">
          {/* Create Listing Button */}
          <Link
            href="/create"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>

          {/* Network Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono">{network}</span>
          </div>

          {/* Wallet Connect Button */}
          {isConnected && address ? (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition active:scale-95"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono">{truncateAddress(address)}</span>
              {xlmBalance && (
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                  {xlmBalance} XLM
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Settings Link */}
          <Link
            href="/settings"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
            aria-label="Settings and Network Diagnostics"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
