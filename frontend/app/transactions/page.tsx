"use client";

import React from "react";
import { useTxStore } from "@/app/state/txStore";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { formatDateTime, getExplorerUrl } from "@/app/services/formatters";
import { ArrowUpRight, ExternalLink, Trash2, CheckCircle2, AlertCircle, Clock } from "@/app/components/ui/Icons";

export default function TransactionsPage() {
  const { transactions, clearHistory } = useTxStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Transaction Center
          </h1>
          <p className="text-sm text-slate-500">
            Audit trail of transactions submitted to the Stellar Soroban network.
          </p>
        </div>

        {transactions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear History
          </Button>
        )}
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <Card
              key={tx.hash}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.status === "success"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : tx.status === "failed"
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-blue-50 text-blue-600 border border-blue-200"
                  }`}
                >
                  {tx.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : tx.status === "failed" ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4 animate-spin" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      {tx.type.replace(/_/g, " ")}
                    </span>
                    <Badge
                      variant={
                        tx.status === "success"
                          ? "completed"
                          : tx.status === "failed"
                          ? "disputed"
                          : "funded"
                      }
                      size="sm"
                    >
                      {tx.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{tx.description}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium">
                  {formatDateTime(Math.floor(tx.timestamp / 1000))}
                </span>
                <a
                  href={getExplorerUrl(tx.hash, "tx")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-blue-600 hover:text-blue-700 hover:underline mt-0.5"
                >
                  <span>{tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto space-y-3 shadow-xs">
          <ArrowUpRight className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Transactions Recorded</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            When you sign and submit transactions (e.g. creating listings, funding escrows, or releasing payouts), your transaction receipts will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
