"use client";

import React, { useState } from "react";
import { useContractEvents } from "@/app/hooks/useContractEvents";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { EventRowSkeleton } from "@/app/components/ui/Skeleton";
import { formatDateTime, truncateAddress, getExplorerUrl } from "@/app/services/formatters";
import {
  Activity,
  ExternalLink,
  Coins,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "@/app/components/ui/Icons";
import { cn } from "@/app/lib/utils";
import type { ContractEvent } from "@/app/types";

const EVENT_TABS = [
  { key: "all",      label: "All Events" },
  { key: "listing",  label: "Listings" },
  { key: "escrow",   label: "Escrows" },
  { key: "released", label: "Settlements" },
  { key: "dispute",  label: "Disputes" },
];

function getEventConfig(type: string): {
  badge: React.ReactNode;
  icon: React.ReactNode;
  iconBg: string;
  accent: string;
} {
  switch (type) {
    case "escrow_opened":
      return {
        badge: <Badge variant="created">Escrow Opened</Badge>,
        icon:  <Activity className="w-4 h-4" style={{ color: "var(--info-icon)" }} />,
        iconBg: "var(--info-bg)",
        accent: "var(--info-icon)",
      };
    case "escrow_funded":
      return {
        badge: <Badge variant="funded">Funds Deposited</Badge>,
        icon:  <Coins className="w-4 h-4" style={{ color: "var(--primary-500)" }} />,
        iconBg: "var(--primary-50)",
        accent: "var(--primary-500)",
      };
    case "buyer_confirmed":
    case "seller_confirmed":
      return {
        badge: <Badge variant="locked">Confirmed</Badge>,
        icon:  <CheckCircle2 className="w-4 h-4" style={{ color: "var(--warning-icon)" }} />,
        iconBg: "var(--warning-bg)",
        accent: "var(--warning-icon)",
      };
    case "funds_released":
      return {
        badge: <Badge variant="completed">Funds Released</Badge>,
        icon:  <CheckCircle2 className="w-4 h-4" style={{ color: "var(--success-icon)" }} />,
        iconBg: "var(--success-bg)",
        accent: "var(--success-icon)",
      };
    case "listing_created":
      return {
        badge: <Badge variant="active">Listing Published</Badge>,
        icon:  <Activity className="w-4 h-4" style={{ color: "var(--success-icon)" }} />,
        iconBg: "var(--success-bg)",
        accent: "var(--success-icon)",
      };
    case "dispute_raised":
      return {
        badge: <Badge variant="disputed">Dispute Raised</Badge>,
        icon:  <AlertTriangle className="w-4 h-4" style={{ color: "var(--danger-icon)" }} />,
        iconBg: "var(--danger-bg)",
        accent: "var(--danger-icon)",
      };
    case "dispute_resolved":
      return {
        badge: <Badge variant="resolved">Dispute Resolved</Badge>,
        icon:  <CheckCircle2 className="w-4 h-4" style={{ color: "teal" }} />,
        iconBg: "#F0FDFA",
        accent: "#0D9488",
      };
    default:
      return {
        badge: <Badge variant="neutral">{type}</Badge>,
        icon:  <Activity className="w-4 h-4" style={{ color: "var(--fg-subtle)" }} />,
        iconBg: "var(--surface-2)",
        accent: "var(--fg-subtle)",
      };
  }
}

export default function ActivityPage() {
  const { data: events, isLoading, refetch, isRefetching } = useContractEvents();
  const [filterType, setFilterType] = useState<string>("all");

  const filteredEvents = (events || []).filter((e: ContractEvent) => {
    if (filterType === "all") return true;
    return e.type.includes(filterType);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ── Header ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="space-y-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: "var(--primary-50)",
              border: "1px solid var(--primary-200)",
              color: "var(--primary-700)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--success-icon)",
                boxShadow: "0 0 0 3px rgba(22,163,74,0.2)",
                animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
              }}
            />
            <span>Live Soroban Event Stream</span>
          </div>
          <h1
            className="font-display text-2xl md:text-3xl font-extrabold"
            style={{ color: "var(--fg-default)" }}
          >
            Protocol Activity Feed
          </h1>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Real-time on-chain events emitted by MarketplaceRegistry and EscrowVault smart contracts.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold",
            "border border-[var(--border-default)] bg-[var(--surface-0)]",
            "text-[var(--fg-default)] hover:bg-[var(--surface-1)]",
            "shadow-[var(--shadow-xs)] transition-all duration-150",
            "active:scale-[0.97] disabled:opacity-60 focus-ring"
          )}
        >
          <RefreshCw
            className={cn("w-3.5 h-3.5", isRefetching && "animate-spin")}
          />
          <span>{isRefetching ? "Refreshing..." : "Refresh Feed"}</span>
        </button>
      </div>

      {/* ── Filter Tabs ── */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl w-fit"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-subtle)",
        }}
        role="tablist"
      >
        {EVENT_TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={filterType === tab.key}
            onClick={() => setFilterType(tab.key)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
              "focus-ring whitespace-nowrap"
            )}
            style={
              filterType === tab.key
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
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Events Stream ── */}
      <div className="space-y-2.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <EventRowSkeleton key={i} />)
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((evt: ContractEvent) => {
            const { badge, icon, iconBg, accent } = getEventConfig(evt.type);
            return (
              <Card
                key={evt.id}
                className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{ borderLeftColor: accent, borderLeftWidth: "3px" }}
              >
                <div className="flex items-start sm:items-center gap-3">
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: iconBg,
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {badge}
                      <span
                        className="text-[11px] font-mono"
                        style={{ color: "var(--fg-subtle)" }}
                      >
                        Ledger #{evt.ledger}
                      </span>
                    </div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {typeof evt.data.amount === "string" && (
                        <span
                          className="font-bold font-mono mr-1.5"
                          style={{ color: "var(--fg-default)" }}
                        >
                          {evt.data.amount}
                        </span>
                      )}
                      {typeof evt.data.seller === "string" && (
                        <span>Seller: {truncateAddress(evt.data.seller)} </span>
                      )}
                      {typeof evt.data.buyer === "string" && (
                        <span>Buyer: {truncateAddress(evt.data.buyer)}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right meta */}
                <div
                  className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 text-right border-t sm:border-t-0 pt-2 sm:pt-0"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: "var(--fg-subtle)" }}
                  >
                    {formatDateTime(evt.timestamp)}
                  </span>
                  {evt.txHash && (
                    <a
                      href={getExplorerUrl(evt.txHash, "tx")}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono hover:underline"
                      style={{ color: "var(--info-icon)" }}
                    >
                      <span>Tx {evt.txHash.slice(0, 6)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          /* ── Empty state ── */
          <div
            className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed"
            style={{
              background: "var(--surface-1)",
              borderColor: "var(--border-default)",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "var(--surface-2)" }}
            >
              <Activity className="w-6 h-6" style={{ color: "var(--fg-subtle)" }} />
            </div>
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "var(--fg-default)" }}
            >
              No events found
            </p>
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
              Try a different filter or refresh the feed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
