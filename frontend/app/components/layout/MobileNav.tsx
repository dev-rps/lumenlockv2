"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, PlusCircle, Activity, Settings } from "@/app/components/ui/Icons";
import { cn } from "@/app/lib/utils";

// Inline star icon for Feedback
function StarIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  const mobileTabs = [
    { label: "Market",    href: "/marketplace", icon: Compass },
    { label: "Dashboard", href: "/dashboard",   icon: LayoutDashboard },
    { label: "Create",    href: "/create",      icon: PlusCircle, isPrimary: true },
    { label: "Activity",  href: "/activity",    icon: Activity },
    { label: "Feedback",  href: "/feedback",    icon: StarIcon },
  ];

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-mobile-nav"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {mobileTabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));
          const Icon = tab.icon;

          if (tab.isPrimary) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-5 gap-1"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white",
                    "transition-transform duration-200 active:scale-90",
                    "bg-[var(--primary-600)]",
                    "shadow-[var(--shadow-primary)]"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-[var(--fg-muted)]">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl gap-1",
                "transition-colors duration-150",
                isActive
                  ? "text-[var(--primary-600)]"
                  : "text-[var(--fg-subtle)] hover:text-[var(--fg-muted)]"
              )}
            >
              {/* Active background pill */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "var(--primary-50)" }}
                />
              )}
              <Icon
                className={cn(
                  "relative w-5 h-5 transition-all duration-150",
                  isActive ? "stroke-[2.5]" : "stroke-[1.8]"
                )}
              />
              <span
                className={cn(
                  "relative text-[10px] tracking-tight font-medium transition-all duration-150",
                  isActive ? "font-semibold" : ""
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
