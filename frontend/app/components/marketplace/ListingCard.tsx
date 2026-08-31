"use client";

import React from "react";
import Link from "next/link";
import { Listing } from "@/app/types";
import { Card } from "@/app/components/ui/Card";
import { StatusBadge } from "@/app/components/ui/Badge";
import { truncateAddress } from "@/app/services/formatters";
import { Layers, ArrowUpRight, Star } from "@/app/components/ui/Icons";
import { cn } from "@/app/lib/utils";

interface ListingCardProps {
  listing: Listing;
}

/** Generates a deterministic gradient from a wallet address string */
function getAvatarGradient(address: string): string {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1},65%,55%) 0%, hsl(${h2},70%,45%) 100%)`;
}

export function ListingCard({ listing }: ListingCardProps) {
  const isMilestone = !!(
    listing.milestoneConfig && listing.milestoneConfig.percentages.length > 0
  );

  return (
    <Link href={`/marketplace/${listing.id}`} className="group block h-full">
      <Card
        hoverEffect
        className="h-full flex flex-col justify-between p-5"
      >
        {/* ── Top bar ── */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Category chip */}
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full",
                  "border border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--fg-muted)]"
                )}
              >
                {listing.category || "Development"}
              </span>
              {isMilestone && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full",
                    "border border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-text)]"
                  )}
                >
                  <Layers className="w-3 h-3" />
                  <span>{listing.milestoneConfig?.percentages.length} Milestones</span>
                </span>
              )}
            </div>
            <StatusBadge status={listing.status} />
          </div>

          {/* ── Title & Description ── */}
          <div>
            <h3
              className={cn(
                "text-base font-bold leading-snug line-clamp-2",
                "text-[var(--fg-default)]",
                "group-hover:text-[var(--primary-600)]",
                "transition-colors duration-150"
              )}
            >
              {listing.title}
            </h3>
            <p className="text-xs text-[var(--fg-muted)] line-clamp-2 mt-1.5 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* ── Seller row ── */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {/* Gradient avatar */}
              <div
                className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white text-[9px] font-bold"
                style={{ background: getAvatarGradient(listing.seller) }}
              >
                {listing.seller.slice(1, 3)}
              </div>
              <span className="font-mono text-[var(--fg-muted)]">
                {truncateAddress(listing.seller, 4, 3)}
              </span>
            </div>
            {listing.rating && (
              <div
                className="flex items-center gap-1 font-semibold"
                style={{ color: "var(--warning-icon)" }}
              >
                <Star className="w-3.5 h-3.5" style={{ fill: "var(--warning-icon)", stroke: "var(--warning-icon)" }} />
                <span className="text-[var(--fg-default)]">{listing.rating.toFixed(1)}</span>
                <span className="text-[var(--fg-subtle)] font-normal">
                  ({listing.completedEscrows || 0})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Price & CTA ── */}
        <div
          className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] text-[var(--fg-subtle)] font-medium block mb-0.5">
              Escrow Protected
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-[var(--fg-default)]">
                {listing.price}
              </span>
              <span
                className="text-xs font-bold font-mono"
                style={{ color: "var(--primary-500)" }}
              >
                {listing.assetSymbol}
              </span>
            </div>
          </div>

          {/* Arrow CTA */}
          <div
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center",
              "border border-[var(--border-subtle)] bg-[var(--surface-1)]",
              "text-[var(--fg-subtle)]",
              "group-hover:bg-[var(--primary-600)] group-hover:text-white",
              "group-hover:border-[var(--primary-600)]",
              "transition-all duration-200"
            )}
          >
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
