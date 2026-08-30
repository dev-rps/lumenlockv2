"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
        <Compass className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The escrow room, listing, or protocol route you are looking for does not exist on this network.
        </p>
      </div>
      <Link href="/marketplace">
        <Button size="lg" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Marketplace
        </Button>
      </Link>
    </div>
  );
}
