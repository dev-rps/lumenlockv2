"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { AlertTriangle, RefreshCw, Home } from "@/app/components/ui/Icons";
import { telemetry } from "@/app/services/telemetry";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    telemetry.trackEvent({
      category: "error",
      name: "uncaught_app_error",
      status: "error",
      details: {
        message: error.message,
        digest: error.digest,
        stack: error.stack?.slice(0, 300),
      },
    });
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Application Error</h2>
        <p className="text-xs text-slate-600 leading-relaxed font-mono bg-slate-100 p-3 rounded-lg border border-slate-200 text-left overflow-x-auto">
          {error.message || "An unexpected error occurred while communicating with the Stellar network."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          size="md"
          variant="primary"
          onClick={() => reset()}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Try Again
        </Button>
        <Link href="/" className="w-full sm:w-auto">
          <Button
            size="md"
            variant="outline"
            leftIcon={<Home className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
