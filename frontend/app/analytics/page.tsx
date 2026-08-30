"use client";

import React from "react";
import { Card } from "@/app/components/ui/Card";
import { ShieldCheck, BarChart3, TrendingUp, DollarSign, Clock, Layers, Users } from "@/app/components/ui/Icons";

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Value Locked (TVL)", value: "32,450 XLM", change: "+14.8%", isUp: true, icon: DollarSign },
    { label: "Escrows Settled", value: "142", change: "+28 this week", isUp: true, icon: ShieldCheck },
    { label: "Milestone Adoption Rate", value: "68.4%", change: "+5.2%", isUp: true, icon: Layers },
    { label: "Average Escrow Duration", value: "2.4 Days", change: "-0.6 days", isUp: true, icon: Clock },
    { label: "Active Unique Traders", value: "86", change: "+12", isUp: true, icon: Users },
    { label: "Dispute Rate", value: "0.7%", change: "-0.3%", isUp: true, icon: TrendingUp },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Soroban Protocol Performance</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Protocol Analytics & Key Metrics
        </h1>
        <p className="text-sm text-slate-500">
          On-chain escrow volume, settlement latency, and milestone distribution metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono text-slate-900">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {stat.change}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contract Reliability Card */}
      <Card className="p-6 md:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Smart Contract Safety & Settlement Health</h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          LumenLock enforces strict Checks-Effects-Interactions (CEI) order, Persistent storage TTL extension strategies, and bilateral mutual releases. In case of timeout without confirmation, buyer refund safety guarantees prevent funds from becoming locked indefinitely.
        </p>
      </Card>
    </div>
  );
}
