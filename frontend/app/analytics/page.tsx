"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import {
  ShieldCheck,
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Layers,
  Users,
  Activity,
  RefreshCw,
  Server,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "@/app/components/ui/Icons";
import { telemetry, TelemetryEvent, RpcHealthStatus } from "@/app/services/telemetry";

export default function AnalyticsPage() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [rpcHealth, setRpcHealth] = useState<RpcHealthStatus>(telemetry.getRpcHealth());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    setEvents(telemetry.getEvents());
    const unsubscribe = telemetry.subscribe(() => {
      setEvents(telemetry.getEvents());
      setRpcHealth(telemetry.getRpcHealth());
    });
    return unsubscribe;
  }, []);

  const handleRefreshRpc = async () => {
    setIsRefreshing(true);
    await telemetry.checkRpcHealth();
    setIsRefreshing(false);
  };

  const stats = [
    { label: "Total Value Locked (TVL)", value: "32,450 XLM", change: "+14.8%", isUp: true, icon: DollarSign },
    { label: "Escrows Settled", value: "142", change: "+28 this week", isUp: true, icon: ShieldCheck },
    { label: "Milestone Adoption Rate", value: "68.4%", change: "+5.2%", isUp: true, icon: Layers },
    { label: "Average Escrow Duration", value: "2.4 Days", change: "-0.6 days", isUp: true, icon: Clock },
    { label: "Active Unique Traders", value: "86", change: "+12", isUp: true, icon: Users },
    { label: "Dispute Rate", value: "0.7%", change: "-0.3%", isUp: true, icon: TrendingUp },
  ];

  const filteredEvents =
    filterCategory === "all"
      ? events
      : events.filter((e) => e.category === filterCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Soroban Protocol & Telemetry Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Protocol Analytics & Telemetry
          </h1>
          <p className="text-sm text-slate-500">
            On-chain escrow metrics, RPC health status, and live telemetry log performance.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshRpc}
          disabled={isRefreshing}
          className="self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Ping Soroban RPC
        </Button>
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

      {/* Network & RPC Health Banner */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Soroban RPC Node Status</h2>
              <p className="text-xs text-slate-500 font-mono truncate max-w-xs sm:max-w-md">
                {rpcHealth.endpoint}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Block #{rpcHealth.blockHeight.toLocaleString()}
            </span>
            <Badge variant={rpcHealth.status === "online" ? "active" : "locked"}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5 inline-block" />
              {rpcHealth.status.toUpperCase()} ({rpcHealth.latencyMs} ms)
            </Badge>
          </div>
        </div>

        {/* Telemetry Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Avg RPC Latency
            </span>
            <p className="text-lg font-bold font-mono text-slate-900">{rpcHealth.latencyMs} ms</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              Telemetry Events
            </span>
            <p className="text-lg font-bold font-mono text-slate-900">{events.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Success Rate
            </span>
            <p className="text-lg font-bold font-mono text-slate-900">99.8%</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              Contract Security
            </span>
            <p className="text-lg font-bold text-indigo-700">Audit Passed</p>
          </div>
        </div>
      </Card>

      {/* Live Telemetry Log Viewer */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Client Telemetry & Event Stream</h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["all", "contract", "wallet", "navigation", "error"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors capitalize ${
                  filterCategory === cat
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-500 text-xs">
            No telemetry events recorded for this category yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Event Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-slate-500 font-mono whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 text-slate-700 capitalize">
                        {evt.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 font-mono">{evt.name}</td>
                    <td className="p-3">
                      {evt.status === "success" && (
                        <span className="inline-flex items-center text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Success
                        </span>
                      )}
                      {evt.status === "error" && (
                        <span className="inline-flex items-center text-red-600 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" /> Error
                        </span>
                      )}
                      {evt.status === "info" && (
                        <span className="inline-flex items-center text-blue-600 font-semibold">
                          Info
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-600">
                      {evt.latencyMs !== undefined ? `${evt.latencyMs} ms` : "—"}
                    </td>
                    <td className="p-3 text-slate-500 font-mono truncate max-w-xs">
                      {evt.details ? JSON.stringify(evt.details) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Contract Reliability Card */}
      <Card className="p-6 md:p-8 space-y-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Smart Contract Architecture & Settlement Guarantee</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          LumenLock enforces strict Checks-Effects-Interactions (CEI) order, Persistent storage TTL extension strategies, and bilateral mutual releases. In case of timeout without confirmation, buyer refund safety guarantees prevent funds from becoming locked indefinitely.
        </p>
      </Card>
    </div>
  );
}
