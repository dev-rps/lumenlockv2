"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { ListingStatus, EscrowState } from "@/app/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "active"
    | "locked"
    | "completed"
    | "refunded"
    | "disputed"
    | "funded"
    | "partial"
    | "created"
    | "resolved"
    | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = true,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    created: "bg-blue-50 text-blue-700 border-blue-200/80",
    locked: "bg-amber-50 text-amber-700 border-amber-200/80",
    funded: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    partial: "bg-purple-50 text-purple-700 border-purple-200/80",
    completed: "bg-emerald-50 text-emerald-800 border-emerald-300 font-medium",
    refunded: "bg-slate-100 text-slate-700 border-slate-300",
    disputed: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
    resolved: "bg-teal-50 text-teal-700 border-teal-200",
  };

  const dotColors = {
    default: "bg-slate-400",
    neutral: "bg-slate-400",
    active: "bg-emerald-500",
    created: "bg-blue-500",
    locked: "bg-amber-500",
    funded: "bg-indigo-500",
    partial: "bg-purple-500",
    completed: "bg-emerald-500",
    refunded: "bg-slate-500",
    disputed: "bg-rose-500",
    resolved: "bg-teal-500",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1 rounded-md",
    md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border select-none tracking-tight",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      <span>{children}</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: ListingStatus | EscrowState | string }) {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "active":
      return <Badge variant="active">Active</Badge>;
    case "locked":
      return <Badge variant="locked">Locked</Badge>;
    case "created":
      return <Badge variant="created">Created</Badge>;
    case "funded":
      return <Badge variant="funded">Funded</Badge>;
    case "partiallyreleased":
      return <Badge variant="partial">In Milestones</Badge>;
    case "released":
    case "completed":
      return <Badge variant="completed">Completed</Badge>;
    case "refunded":
      return <Badge variant="refunded">Refunded</Badge>;
    case "disputed":
      return <Badge variant="disputed">Under Dispute</Badge>;
    case "resolved":
      return <Badge variant="resolved">Resolved</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}
