"use client";

import React, { useState } from "react";
import { useContractEvents } from "@/app/hooks/useContractEvents";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { formatDateTime, truncateAddress, getExplorerUrl } from "@/app/services/formatters";
import {
  Activity,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "@/app/components/ui/Icons";
import type { ContractEvent } from "@/app/types";

export default function ActivityPage() {
  const { data: events, isLoading, refetch, isRefetching } = useContractEvents();
  const [filterType, setFilterType] = useState<string>("all");

  const getEventBadge = (type: string) => {
    switch (type) {
      case "escrow_opened":
        return <Badge variant="created">Escrow Opened</Badge>;
      case "escrow_funded":
        return <Badge variant="funded">Funds Deposited</Badge>;
      case "buyer_confirmed":
      case "seller_confirmed":
        return <Badge variant="locked">Confirmed</Badge>;
      case "funds_released":
        return <Badge variant="completed">Funds Released</Badge>;
      case "listing_created":
        return <Badge variant="active">Listing Published</Badge>;
      case "dispute_raised":
        return <Badge variant="disputed">Dispute Raised</Badge>;
      case "dispute_resolved":
        return <Badge variant="resolved">Dispute Resolved</Badge>;
      default:
        return <Badge variant="neutral">{type}</Badge>;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "escrow_funded":
        return <Coins className="w-4 h-4 text-indigo-600" />;
      case "funds_released":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "dispute_raised":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const filteredEvents = (events || []).filter((e: ContractEvent) => {
    if (filterType === "all") return true;
    return e.type.includes(filterType);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Soroban Event Stream</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Protocol Activity Feed
          </h1>
          <p className="text-sm text-slate-500">
            Real-time on-chain events emitted by MarketplaceRegistry and EscrowVault smart contracts.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: "all", label: "All Events" },
          { key: "listing", label: "Listings" },
          { key: "escrow", label: "Escrows" },
          { key: "released", label: "Settlements" },
          { key: "dispute", label: "Disputes" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              filterType === tab.key
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Stream */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
            Polling contract topics...
          </div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((evt: ContractEvent) => (
            <Card
              key={evt.id}
              className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  {getEventIcon(evt.type)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {getEventBadge(evt.type)}
                    <span className="text-[11px] font-mono text-slate-400">
                      Ledger #{evt.ledger}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-700">
                    {evt.data.amount && (
                      <span className="font-bold font-mono text-slate-900 mr-1.5">
                        {evt.data.amount}
                      </span>
                    )}
                    {evt.data.seller && (
                      <span>Seller: {truncateAddress(evt.data.seller)} </span>
                    )}
                    {evt.data.buyer && (
                      <span>Buyer: {truncateAddress(evt.data.buyer)}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium">
                  {formatDateTime(evt.timestamp)}
                </span>
                {evt.txHash && (
                  <a
                    href={getExplorerUrl(evt.txHash, "tx")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 hover:underline"
                  >
                    <span>Tx {evt.txHash.slice(0, 6)}...</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
            No events found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
