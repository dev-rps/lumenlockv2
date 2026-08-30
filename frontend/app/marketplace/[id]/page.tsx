"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useListing } from "@/app/hooks/useListings";
import { useOpenEscrow } from "@/app/hooks/useEscrow";
import { useWalletStore } from "@/app/state/walletStore";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StatusBadge } from "@/app/components/ui/Badge";
import { MilestoneProgressBar } from "@/app/components/ui/MilestoneProgressBar";
import { truncateAddress, formatDate, getExplorerUrl } from "@/app/services/formatters";
import {
  ShieldCheck,
  Clock,
  ExternalLink,
  Layers,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "@/app/components/ui/Icons";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const { data: listing, isLoading } = useListing(listingId);
  const { isConnected, address, setModalOpen } = useWalletStore();
  const openEscrowMutation = useOpenEscrow();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-slate-500 mt-4">Loading listing details from Soroban registry...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Listing Not Found</h2>
        <p className="text-sm text-slate-500">The requested listing does not exist or has been removed.</p>
        <Link href="/marketplace">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const isMilestone = !!(listing.milestoneConfig && listing.milestoneConfig.percentages.length > 0);
  const isSeller = isConnected && address === listing.seller;

  const handleBuyWithEscrow = async () => {
    if (!isConnected || !address) {
      setModalOpen(true);
      return;
    }

    try {
      const result = await openEscrowMutation.mutateAsync({
        listingId: listing.id,
        buyer: address,
      });

      router.push(`/escrow/${result.escrowId}`);
    } catch {
      // Error handled in mutation toast
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb / Back Link */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Listings</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Listing Details (Left 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {listing.category || "Service"}
                </span>
                {isMilestone && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{listing.milestoneConfig?.percentages.length} Milestone Payouts</span>
                  </span>
                )}
              </div>
              <StatusBadge status={listing.status} />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
              {listing.title}
            </h1>

            {/* Seller Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-mono font-bold text-blue-700 text-xs">
                  {listing.seller.slice(1, 3)}
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Seller Stellar Account</span>
                  <a
                    href={getExplorerUrl(listing.seller, "account")}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-medium text-slate-800 hover:text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>{truncateAddress(listing.seller, 6, 6)}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Listing Created</span>
                <span className="font-medium text-slate-700">{formatDate(listing.createdAt)}</span>
              </div>
            </div>
          </Card>

          {/* Description Card */}
          <Card className="p-6 md:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Service Description & Scope</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </Card>

          {/* Milestone Details (if configured) */}
          {isMilestone && listing.milestoneConfig && (
            <Card className="p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Milestone Release Schedule</h3>
                  <p className="text-xs text-slate-500">
                    Funds are released in tranches only upon mutual delivery confirmation.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {listing.milestoneConfig.percentages.length} Stages
                </span>
              </div>

              <MilestoneProgressBar
                percentages={listing.milestoneConfig.percentages}
                labels={listing.milestoneConfig.labels}
                currentIndex={0}
                totalAmount={listing.price}
                assetSymbol={listing.assetSymbol}
              />
            </Card>
          )}

          {/* Escrow Guarantees */}
          <Card className="p-6 bg-slate-50/70 border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Soroban Escrow Protocol Protection</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dual Confirmation</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Funds stay in vault custody until buyer confirms delivery satisfaction.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>7-Day Timeout Refund</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Buyer can claim 100% refund if seller goes unresponsive past deadline.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dispute Freezing</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Either party can freeze funds to trigger third-party arbiter adjudication.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Sidebar (Right Col) */}
        <div className="space-y-6">
          <Card className="p-6 space-y-5 border-slate-300 shadow-md">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Escrow Price
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-slate-900">
                  {listing.price}
                </span>
                <span className="text-base font-bold text-blue-600 font-mono">
                  {listing.assetSymbol}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Protocol Custody Fee</span>
                <span className="font-mono font-medium text-emerald-600">0.00 XLM (Free)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Settlement Asset</span>
                <span className="font-mono font-medium text-slate-900">{listing.assetSymbol} (Stellar SAC)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Escrow Status</span>
                <span className="font-medium text-emerald-700">{listing.status}</span>
              </div>
            </div>

            {listing.status === "Active" ? (
              <Button
                size="lg"
                onClick={handleBuyWithEscrow}
                isLoading={openEscrowMutation.isPending}
                disabled={isSeller}
                className="w-full shadow-md"
                leftIcon={<Lock className="w-4 h-4" />}
              >
                {isSeller ? "You Own This Listing" : "Buy with Escrow Protection"}
              </Button>
            ) : (
              <Button size="lg" disabled className="w-full">
                Listing is {listing.status}
              </Button>
            )}

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Tokens are held securely by the <code className="text-slate-600">EscrowVault</code> contract. You inspect the deliverables before funds are released.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
