"use client";

import React, { createContext, useContext, useState, useId } from "react";
import { cn } from "@/app/lib/utils";

/* ─────────────── Context ─────────────── */
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("<Tab> must be used inside <Tabs>");
  return ctx;
}

/* ─────────────── Root ─────────────── */
interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultTab, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("flex flex-col gap-0", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ─────────────── Tab List ─────────────── */
interface TabListProps {
  children: React.ReactNode;
  className?: string;
  variant?: "pills" | "underline";
}

export function TabList({ children, className, variant = "pills" }: TabListProps) {
  if (variant === "underline") {
    return (
      <div
        className={cn(
          "flex items-center gap-0 border-b border-[var(--border-subtle)]",
          className
        )}
        role="tablist"
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-xl w-fit",
        className
      )}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-subtle)",
      }}
      role="tablist"
    >
      {children}
    </div>
  );
}

/* ─────────────── Tab ─────────────── */
interface TabProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  variant?: "pills" | "underline";
}

export function Tab({ id, children, className, variant = "pills" }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;

  if (variant === "underline") {
    return (
      <button
        role="tab"
        aria-selected={isActive}
        onClick={() => setActiveTab(id)}
        className={cn(
          "relative px-4 py-2.5 text-sm font-medium transition-colors duration-150",
          "border-b-2 -mb-px focus-ring rounded-t-md",
          isActive
            ? "text-[var(--primary-600)] border-[var(--primary-500)]"
            : "text-[var(--fg-muted)] border-transparent hover:text-[var(--fg-default)] hover:border-[var(--border-default)]",
          className
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(id)}
      className={cn(
        "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus-ring whitespace-nowrap",
        className
      )}
      style={
        isActive
          ? {
              background: "var(--surface-0)",
              color: "var(--primary-600)",
              boxShadow: "var(--shadow-sm)",
            }
          : {
              background: "transparent",
              color: "var(--fg-muted)",
            }
      }
    >
      {children}
    </button>
  );
}

/* ─────────────── Tab Panel ─────────────── */
interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== id) return null;
  return (
    <div role="tabpanel" className={cn("pt-4", className)}>
      {children}
    </div>
  );
}
