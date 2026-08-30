"use client";

import React from "react";
import Link from "next/link";
import { Listing } from "@/app/types";
import { Card } from "@/app/components/ui/Card";
import { StatusBadge } from "@/app/components/ui/Badge";
import { truncateAddress } from "@/app/services/formatters";
import { Layers, ArrowUpRight, Star } from "@/app/components/ui/Icons";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const isMilestone = !!(listing.milestoneConfig && listing.milestoneConfig.percentages.length > 0);

  return (
    <Link href={`/marketplace/${listing.id}`} className="group block h-full">
      <Card
        hoverEffect
        className="h-full flex flex-col justify-between p-5 md:p-6 transition-all duration-200 border-slate-200/90 group-hover:border-blue-300 group-hover:shadow-lg group-hover:shadow-blue-500/5"
      >
        <div className="space-y-3.5">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {listing.category || "Development"}
              </span>
              {isMilestone && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>{listing.milestoneConfig?.percentages.length} Milestones</span>
                </span>
              )}
            </div>
            <StatusBadge status={listing.status} />
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {listing.title}
            </h3>
            <p className="text-xs md:text-sm text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Seller Pill & Reputation */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                {listing.seller.slice(1, 3)}
              </div>
              <span className="font-mono">{truncateAddress(listing.seller, 4, 3)}</span>
            </div>
            {listing.rating && (
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>{listing.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({listing.completedEscrows || 0})</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & CTA Footer */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Escrow Protected</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg md:text-xl font-bold font-mono text-slate-900">
                {listing.price}
              </span>
              <span className="text-xs font-bold text-blue-600 font-mono">
                {listing.assetSymbol}
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-500 flex items-center justify-center transition-all shadow-xs">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
