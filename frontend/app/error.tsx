"use client";

import React, { useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("LumenLock Application Error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {error.message || "An unexpected error occurred while communicating with the Stellar network."}
        </p>
      </div>
      <Button size="md" onClick={() => reset()} leftIcon={<RefreshCw className="w-4 h-4" />}>
        Try Again
      </Button>
    </div>
  );
}
