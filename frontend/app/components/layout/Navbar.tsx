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
} from "@/app/components/ui/Icons";
import { useWalletStore } from "@/app/state/walletStore";
import { useAuthStore } from "@/app/state/authStore";
import { truncateAddress } from "@/app/services/formatters";
import { cn } from "@/app/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, address, xlmBalance, network, setModalOpen } = useWalletStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Marketplace", href: "/marketplace",  icon: Compass },
    { label: "Dashboard",   href: "/dashboard",    icon: LayoutDashboard },
    { label: "Activity",    href: "/activity",      icon: Activity },
    { label: "Transactions",href: "/transactions",  icon: ArrowUpRight },
    { label: "Feedback",    href: "/feedback",      icon: Activity },
  ];

  const { user, isLoggedIn, logout } = useAuthStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full glass-nav transition-all duration-300",
        scrolled ? "h-[60px]" : "h-[68px]"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

        {/* ── Brand ── */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div
            className={cn(
              "flex items-center justify-center text-white rounded-xl",
              "bg-[var(--primary-600)]",
              "transition-all duration-300 group-hover:scale-105",
              "shadow-[0_2px_8px_rgba(79,70,229,0.3)]",
              scrolled ? "w-8 h-8" : "w-9 h-9"
            )}
          >
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span
              className="font-display font-bold text-[var(--fg-default)] leading-none flex items-center gap-1.5"
              style={{ fontSize: scrolled ? "15px" : "17px", transition: "font-size 0.3s" }}
            >
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
            {!scrolled && (
              <span className="text-[11px] text-[var(--fg-subtle)] font-medium hidden sm:inline leading-tight mt-0.5">
                Trustless Stellar Escrow
              </span>
            )}
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5">
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
                  "relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium",
                  "transition-all duration-150",
                  isActive
                    ? "text-[var(--primary-600)] bg-[var(--primary-50)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg-default)] hover:bg-[var(--surface-2)]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-[var(--primary-500)]" : "")} />
                <span>{link.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "var(--primary-500)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2">

          {/* Auth / Login */}
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-semibold" style={{ color:"var(--fg-default)" }}>
                {user.name.split(" ")[0]}
              </span>
              <button
                onClick={() => logout()}
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl",
                  "text-xs font-semibold",
                  "border border-[var(--border-subtle)] bg-[var(--surface-0)]",
                  "hover:bg-[var(--surface-1)] transition-all duration-150 focus-ring"
                )}
                style={{ color:"var(--fg-muted)" }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl",
                "text-xs font-semibold text-white",
                "bg-[var(--primary-600)] hover:bg-[var(--primary-700)]",
                "shadow-[var(--shadow-primary)]",
                "transition-all duration-150 active:scale-[0.97] focus-ring"
              )}
            >
              Sign In
            </Link>
          )}

          {/* Network badge */}
          <div
            className={cn(
              "hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg",
              "text-[11px] font-medium text-[var(--fg-muted)]",
              "border border-[var(--border-subtle)] bg-[var(--surface-1)]"
            )}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--success-icon)]"
              style={{ boxShadow: "0 0 0 3px rgba(22,163,74,0.15)" }}
            />
            <span className="font-mono">{network}</span>
          </div>

          {/* Wallet */}
          {isConnected && address ? (
            <button
              onClick={() => setModalOpen(true)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl",
                "border border-[var(--border-subtle)] bg-[var(--surface-0)]",
                "hover:bg-[var(--surface-1)] hover:border-[var(--border-default)]",
                "text-[var(--fg-default)] text-xs font-semibold",
                "shadow-[var(--shadow-xs)] transition-all duration-150 active:scale-[0.97] focus-ring"
              )}
            >
              <span
                className="w-2 h-2 rounded-full bg-[var(--success-icon)]"
                style={{ boxShadow: "0 0 0 3px rgba(22,163,74,0.15)" }}
              />
              <span className="font-mono text-[var(--fg-default)]">
                {truncateAddress(address)}
              </span>
              {xlmBalance && (
                <span
                  className="hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[10px] font-mono"
                  style={{
                    background: "var(--surface-2)",
                    color: "var(--fg-muted)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {xlmBalance} XLM
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-[var(--fg-subtle)]" />
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl",
                "text-xs font-semibold text-white",
                "bg-[var(--primary-600)] hover:bg-[var(--primary-700)]",
                "shadow-[var(--shadow-primary)]",
                "transition-all duration-150 active:scale-[0.97] focus-ring"
              )}
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Settings */}
          <Link
            href="/settings"
            className={cn(
              "p-2 rounded-xl",
              "border border-[var(--border-subtle)] bg-[var(--surface-0)]",
              "text-[var(--fg-subtle)] hover:text-[var(--fg-default)]",
              "hover:bg-[var(--surface-1)] hover:border-[var(--border-default)]",
              "transition-all duration-150 focus-ring"
            )}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
