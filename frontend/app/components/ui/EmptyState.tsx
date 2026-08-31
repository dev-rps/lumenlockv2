"use client";

import React from "react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-14 px-6 text-center rounded-2xl border border-dashed",
        className
      )}
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border-default)",
      }}
    >
      {icon && (
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "var(--surface-2)" }}
        >
          <span style={{ color: "var(--fg-subtle)" }}>{icon}</span>
        </div>
      )}

      <p
        className="text-sm font-bold mb-1.5"
        style={{ color: "var(--fg-default)" }}
      >
        {title}
      </p>

      {description && (
        <p
          className="text-xs max-w-xs leading-relaxed"
          style={{ color: "var(--fg-muted)" }}
        >
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action.href ? (
            <a href={action.href}>
              <Button size="sm" variant="outline">
                {action.label}
              </Button>
            </a>
          ) : (
            <Button size="sm" variant="outline" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
