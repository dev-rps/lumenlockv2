"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface DividerProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({
  label,
  orientation = "horizontal",
  className,
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("w-px self-stretch shrink-0", className)}
        style={{ background: "var(--border-subtle)" }}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div
        className={cn("flex items-center gap-3 my-1", className)}
        role="separator"
      >
        <div
          className="flex-1 h-px"
          style={{ background: "var(--border-subtle)" }}
        />
        <span
          className="text-xs font-medium shrink-0 px-1"
          style={{ color: "var(--fg-subtle)" }}
        >
          {label}
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "var(--border-subtle)" }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("h-px w-full my-1", className)}
      style={{ background: "var(--border-subtle)" }}
      role="separator"
    />
  );
}
