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
  shape?: "pill" | "tag";
  dot?: boolean;
  glow?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  shape = "pill",
  dot = true,
  glow = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<string, string> = {
    default:   "bg-[var(--surface-2)] text-[var(--fg-muted)] border-[var(--border-subtle)]",
    neutral:   "bg-[var(--surface-1)] text-[var(--fg-subtle)] border-[var(--border-subtle)]",
    active:    "bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]",
    created:   "bg-[var(--info-bg)] text-[var(--info-text)] border-[var(--info-border)]",
    locked:    "bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-border)]",
    funded:    "bg-[var(--primary-50)] text-[var(--primary-700)] border-[var(--primary-200)]",
    partial:   "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]",
    refunded:  "bg-[var(--surface-2)] text-[var(--fg-muted)] border-[var(--border-default)]",
    disputed:  "bg-[var(--danger-bg)] text-[var(--danger-text)] border-[var(--danger-border)]",
    resolved:  "bg-teal-50 text-teal-700 border-teal-200",
  };

  const dotColors: Record<string, string> = {
    default:   "bg-[var(--fg-subtle)]",
    neutral:   "bg-[var(--fg-subtle)]",
    active:    "bg-[var(--success-icon)]",
    created:   "bg-[var(--info-icon)]",
    locked:    "bg-[var(--warning-icon)]",
    funded:    "bg-[var(--primary-500)]",
    partial:   "bg-purple-500",
    completed: "bg-[var(--success-icon)]",
    refunded:  "bg-[var(--fg-subtle)]",
    disputed:  "bg-[var(--danger-icon)] animate-pulse",
    resolved:  "bg-teal-500",
  };

  const glowColors: Record<string, string> = {
    active:    "shadow-[0_0_0_3px_rgba(22,163,74,0.15)]",
    funded:    "shadow-[0_0_0_3px_rgba(79,70,229,0.15)]",
    completed: "shadow-[0_0_0_3px_rgba(22,163,74,0.15)]",
    disputed:  "shadow-[0_0_0_3px_rgba(225,29,72,0.15)]",
    created:   "shadow-[0_0_0_3px_rgba(37,99,235,0.12)]",
    default: "", neutral: "", locked: "", partial: "", refunded: "", resolved: "",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const shapeStyles = {
    pill: "rounded-full",
    tag:  "rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border select-none tracking-tight",
        "transition-shadow duration-150",
        sizeStyles[size],
        shapeStyles[shape],
        variantStyles[variant],
        glow && glowColors[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />
      )}
      <span>{children}</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: ListingStatus | EscrowState | string }) {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "active":
      return <Badge variant="active" glow>Active</Badge>;
    case "locked":
      return <Badge variant="locked">Locked</Badge>;
    case "created":
      return <Badge variant="created">Created</Badge>;
    case "funded":
      return <Badge variant="funded" glow>Funded</Badge>;
    case "partiallyreleased":
      return <Badge variant="partial">In Milestones</Badge>;
    case "released":
    case "completed":
      return <Badge variant="completed">Completed</Badge>;
    case "refunded":
      return <Badge variant="refunded">Refunded</Badge>;
    case "disputed":
      return <Badge variant="disputed" glow>Under Dispute</Badge>;
    case "resolved":
      return <Badge variant="resolved">Resolved</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}
