"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { EscrowState } from "@/app/types";
import { Check, Clock, AlertTriangle, ShieldCheck, XCircle } from "lucide-react";

interface EscrowStateVisualizerProps {
  state: EscrowState;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  isMilestone?: boolean;
  currentMilestoneIndex?: number;
  totalMilestones?: number;
  className?: string;
}

export function EscrowStateVisualizer({
  state,
  buyerConfirmed,
  sellerConfirmed,
  isMilestone = false,
  currentMilestoneIndex = 0,
  totalMilestones = 1,
  className,
}: EscrowStateVisualizerProps) {
  const steps = [
    {
      title: "Escrow Opened",
      description: "Buyer committed, listing locked",
      isComplete: state !== "Created",
      isCurrent: state === "Created",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      title: "Funds Deposited",
      description: "Vault holds assets safely",
      isComplete: !["Created"].includes(state),
      isCurrent: state === "Funded" && !buyerConfirmed && !sellerConfirmed,
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      title: isMilestone
        ? `Milestone ${currentMilestoneIndex + 1}/${totalMilestones} Confirmation`
        : "Dual Confirmation",
      description: `Buyer: ${buyerConfirmed ? "Confirmed ✓" : "Pending"} | Seller: ${
        sellerConfirmed ? "Confirmed ✓" : "Pending"
      }`,
      isComplete: ["Released", "Resolved"].includes(state),
      isCurrent:
        ["Funded", "PartiallyReleased"].includes(state) &&
        (buyerConfirmed || sellerConfirmed),
      icon: <Check className="w-4 h-4" />,
    },
    {
      title: state === "Refunded" ? "Refund Executed" : "Funds Released",
      description:
        state === "Refunded"
          ? "Returned to Buyer after deadline"
          : state === "Disputed"
          ? "Under Arbiter Review"
          : "Transferred to Seller",
      isComplete: ["Released", "Refunded", "Resolved"].includes(state),
      isCurrent: ["Released", "Refunded", "Resolved", "Disputed"].includes(state),
      icon:
        state === "Refunded" ? (
          <XCircle className="w-4 h-4" />
        ) : state === "Disputed" ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <Check className="w-4 h-4" />
        ),
    },
  ];

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        {steps.map((step, idx) => {
          const isDone = step.isComplete;
          const isCurrent = step.isCurrent;

          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2.5 min-w-fit">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                    isDone
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                      : isCurrent
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 ring-4 ring-blue-100 animate-pulse"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  )}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.icon}
                </div>
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-xs font-bold leading-tight",
                      isDone
                        ? "text-slate-900"
                        : isCurrent
                        ? "text-blue-700"
                        : "text-slate-400"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {step.description}
                  </p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 min-w-[24px] mx-1 rounded-full transition-colors",
                    isDone ? "bg-emerald-500" : "bg-slate-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
