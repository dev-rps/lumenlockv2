"use client";

import React, { useEffect, useRef } from "react";
import { useToastStore } from "@/app/state/toastStore";
import { CheckCircle2, AlertCircle, Info, Loader2, X, ExternalLink } from "@/app/components/ui/Icons";
import { getExplorerUrl } from "@/app/services/formatters";
import { cn } from "@/app/lib/utils";
import type { TransactionToast } from "@/app/types";

const TOAST_DURATION_MS = 5000;

function ToastItem({ toast, onRemove }: { toast: TransactionToast; onRemove: () => void }) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toast.type === "loading") return;
    const el = progressRef.current;
    if (!el) return;
    el.style.transform = "scaleX(1)";
    const animation = el.animate(
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      { duration: TOAST_DURATION_MS, easing: "linear", fill: "forwards" }
    );
    const timer = setTimeout(onRemove, TOAST_DURATION_MS);
    return () => {
      animation.cancel();
      clearTimeout(timer);
    };
  }, [toast.id, toast.type, onRemove]);

  type ToastType = TransactionToast["type"];

  const config: Record<ToastType, { icon: React.ReactNode; accent: string; progress: string }> = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--success-icon)" }} />,
      accent: "var(--success-icon)",
      progress: "var(--success-icon)",
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--danger-icon)" }} />,
      accent: "var(--danger-icon)",
      progress: "var(--danger-icon)",
    },
    warning: {
      icon: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--warning-icon)" }} />,
      accent: "var(--warning-icon)",
      progress: "var(--warning-icon)",
    },
    info: {
      icon: <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--info-icon)" }} />,
      accent: "var(--info-icon)",
      progress: "var(--info-icon)",
    },
    loading: {
      icon: <Loader2 className="w-4 h-4 animate-spin shrink-0 mt-0.5" style={{ color: "var(--info-icon)" }} />,
      accent: "var(--info-icon)",
      progress: "var(--info-icon)",
    },
  };

  const { icon, accent, progress } = config[toast.type];

  return (
    <div
      className={cn(
        "pointer-events-auto relative overflow-hidden",
        "bg-[var(--surface-0)] border border-[var(--border-subtle)]",
        "rounded-xl shadow-[var(--shadow-lg)]",
        "flex items-start gap-3 p-4",
        "w-full max-w-sm"
      )}
      style={{
        borderLeftColor: accent,
        borderLeftWidth: "3px",
        animation: "toast-slide-in 0.22s cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      {icon}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[var(--fg-default)] leading-tight">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-xs text-[var(--fg-muted)] mt-1 leading-relaxed break-words">
            {toast.description}
          </p>
        )}
        {toast.txHash && (
          <a
            href={getExplorerUrl(toast.txHash, "tx")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium mt-1.5"
            style={{ color: "var(--info-icon)" }}
          >
            <span>View on StellarExpert</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <button
        onClick={onRemove}
        className={cn(
          "text-[var(--fg-subtle)] hover:text-[var(--fg-default)]",
          "p-1 rounded-lg hover:bg-[var(--surface-2)]",
          "transition-colors duration-150 shrink-0 focus-ring"
        )}
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      {toast.type !== "loading" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--border-subtle)]">
          <div
            ref={progressRef}
            className="h-full origin-left"
            style={{ backgroundColor: progress }}
          />
        </div>
      )}
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const visible = toasts.slice(-4);

  return (
    <>
      <style>{`
        @keyframes toast-slide-in {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {visible.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
}
