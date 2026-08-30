"use client";

import React from "react";
import { useToastStore } from "@/app/state/toastStore";
import { CheckCircle2, AlertCircle, Info, Loader2, X, ExternalLink } from "lucide-react";
import { getExplorerUrl } from "@/app/services/formatters";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
          loading: <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0 mt-0.5" />,
        };

        const bgStyles = {
          success: "border-emerald-200 bg-white/95 text-slate-900 shadow-emerald-500/5",
          error: "border-rose-200 bg-white/95 text-slate-900 shadow-rose-500/5",
          warning: "border-amber-200 bg-white/95 text-slate-900 shadow-amber-500/5",
          info: "border-blue-200 bg-white/95 text-slate-900 shadow-blue-500/5",
          loading: "border-blue-200 bg-white/95 text-slate-900 shadow-blue-500/5",
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all flex items-start gap-3 ${bgStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">
                  {toast.description}
                </p>
              )}
              {toast.txHash && (
                <a
                  href={getExplorerUrl(toast.txHash, "tx")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 mt-1.5 underline underline-offset-2"
                >
                  <span>View on StellarExpert</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100 shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
