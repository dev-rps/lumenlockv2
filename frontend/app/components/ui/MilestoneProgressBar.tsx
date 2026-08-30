"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { Check } from "@/app/components/ui/Icons";

interface MilestoneProgressBarProps {
  percentages: number[];
  labels?: string[];
  currentIndex: number;
  isCompleted?: boolean;
  totalAmount?: string;
  assetSymbol?: string;
  className?: string;
}

export function MilestoneProgressBar({
  percentages,
  labels = [],
  currentIndex,
  isCompleted = false,
  totalAmount,
  assetSymbol = "XLM",
  className,
}: MilestoneProgressBarProps) {
  if (!percentages || percentages.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-3.5 w-full", className)}>
      {/* Visual Bar */}
      <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
        {percentages.map((pct, idx) => {
          const isDone = isCompleted || idx < currentIndex;
          const isCurrent = !isCompleted && idx === currentIndex;

          return (
            <div
              key={idx}
              style={{ width: `${pct}%` }}
              className={cn(
                "h-full border-r border-white/60 transition-all duration-500",
                isDone
                  ? "bg-emerald-500"
                  : isCurrent
                  ? "bg-blue-600 relative overflow-hidden"
                  : "bg-slate-200"
              )}
            >
              {isCurrent && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Milestone Stages */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {percentages.map((pct, idx) => {
          const isDone = isCompleted || idx < currentIndex;
          const isCurrent = !isCompleted && idx === currentIndex;
          const label = labels[idx] || `Milestone ${idx + 1}`;

          const trancheAmount = totalAmount
            ? (Number(totalAmount) * pct) / 100
            : null;

          return (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left",
                isDone
                  ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-950"
                  : isCurrent
                  ? "bg-blue-50/70 border-blue-200 text-blue-950 shadow-sm"
                  : "bg-slate-50/50 border-slate-200/60 text-slate-500 opacity-75"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-blue-600 text-white animate-pulse"
                    : "bg-slate-200 text-slate-600"
                )}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold truncate">{label}</p>
                  <span className="text-[11px] font-mono font-medium opacity-80 shrink-0 ml-1">
                    {pct}%
                  </span>
                </div>
                {trancheAmount !== null && (
                  <p className="text-[11px] font-mono opacity-70 truncate">
                    {trancheAmount} {assetSymbol}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
