"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWalletStore } from "@/app/state/walletStore";
import { useUserEscrows } from "@/app/hooks/useEscrow";
import { useListings } from "@/app/hooks/useListings";
import { STELLAR_CONFIG } from "@/app/services/stellar";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StatusBadge } from "@/app/components/ui/Badge";
import { truncateAddress, formatDate } from "@/app/services/formatters";
import {
  LayoutDashboard,
  ArrowUpRight,
  PlusCircle,
  Coins,
  Scale,
  ShoppingBag,
  Lock,
} from "@/app/components/ui/Icons";
import type { EscrowRecord, Listing } from "@/app/types";

export default function DashboardPage() {
  const { isConnected, address, setModalOpen } = useWalletStore();
  const { data: userEscrows } = useUserEscrows(address);
  const { data: listings } = useListings();

  const [activeTab, setActiveTab] = useState<"buyer" | "seller" | "listings" | "disputes">("buyer");

  const myListings = (listings || []).filter((l: Listing) => isConnected && l.seller === address);
  const isArbiter = isConnected && address === STELLAR_CONFIG.arbiterAddress;

  const totalSecuredVolume = (userEscrows?.buyerEscrows || []).reduce(
    (acc: number, e: EscrowRecord) => acc + (parseFloat(e.amount) || 0),
    0
  );

  const activeEscrowsCount = (userEscrows?.buyerEscrows || []).filter((e: EscrowRecord) =>
    ["Created", "Funded", "PartiallyReleased", "Disputed"].includes(e.state)
  ).length;

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Connect Your Stellar Wallet</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Connect your Freighter, Albedo, or xBull wallet to view your active escrows, manage listings, and track settlement releases.
          </p>
        </div>
        <Button size="lg" onClick={() => setModalOpen(true)} leftIcon={<Lock className="w-4 h-4" />}>
          Connect Stellar Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Escrow Command Center
          </h1>
          <p className="text-sm text-slate-500 font-mono mt-1">
            Connected: {truncateAddress(address, 8, 8)}
          </p>
        </div>

        <Link href="/create">
          <Button leftIcon={<PlusCircle className="w-4 h-4" />}>Create Listing</Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-white border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Active Locked Escrows
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">
              {activeEscrowsCount}
            </span>
            <span className="text-xs font-semibold text-blue-600">Active Contracts</span>
          </div>
        </Card>

        <Card className="p-5 bg-white border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Secured Volume
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">
              {totalSecuredVolume.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600">XLM / USDC</span>
          </div>
        </Card>

        <Card className="p-5 bg-white border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Published Listings
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">
              {myListings.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">In Registry</span>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { key: "buyer", label: `Buyer Escrows (${userEscrows?.buyerEscrows.length || 0})` },
          { key: "seller", label: `Seller Escrows (${userEscrows?.sellerEscrows.length || 0})` },
          { key: "listings", label: `My Listings (${myListings.length})` },
          {
            key: "disputes",
            label: isArbiter ? "Arbiter Desk ⚖️" : "Disputes & Support",
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "buyer" | "seller" | "listings" | "disputes")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents: Buyer Escrows */}
      {activeTab === "buyer" && (
        <div className="space-y-4">
          {userEscrows?.buyerEscrows && userEscrows.buyerEscrows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userEscrows.buyerEscrows.map((escrow: EscrowRecord) => (
                <Link
                  key={escrow.escrowId}
                  href={`/escrow/${escrow.escrowId}`}
                  className="block group"
                >
                  <Card hoverEffect className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        Escrow #{escrow.escrowId}
                      </span>
                      <StatusBadge status={escrow.state} />
                    </div>

                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Seller</span>
                        <span className="font-mono text-xs font-semibold text-slate-800">
                          {truncateAddress(escrow.seller, 6, 4)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold font-mono text-slate-900">
                          {escrow.amount} {escrow.assetSymbol}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold group-hover:text-blue-700">
                      <span>Open Settlement Room</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto space-y-4">
              <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">No Buyer Escrows Yet</h3>
                <p className="text-xs text-slate-500">
                  You haven&apos;t opened any escrow purchases on the marketplace.
                </p>
              </div>
              <Link href="/marketplace">
                <Button size="sm">Browse Listings</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: Seller Escrows */}
      {activeTab === "seller" && (
        <div className="space-y-4">
          {userEscrows?.sellerEscrows && userEscrows.sellerEscrows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userEscrows.sellerEscrows.map((escrow: EscrowRecord) => (
                <Link
                  key={escrow.escrowId}
                  href={`/escrow/${escrow.escrowId}`}
                  className="block group"
                >
                  <Card hoverEffect className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        Escrow #{escrow.escrowId}
                      </span>
                      <StatusBadge status={escrow.state} />
                    </div>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Buyer</span>
                        <span className="font-mono text-xs font-semibold text-slate-800">
                          {truncateAddress(escrow.buyer, 6, 4)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold font-mono text-slate-900">
                          {escrow.amount} {escrow.assetSymbol}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto space-y-4">
              <Coins className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">No Seller Orders</h3>
                <p className="text-xs text-slate-500">
                  When buyers initiate an escrow for your listings, they will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: My Listings */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myListings.map((listing: Listing) => (
                <Link
                  key={listing.id}
                  href={`/marketplace/${listing.id}`}
                  className="block group"
                >
                  <Card hoverEffect className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {listing.category}
                      </span>
                      <StatusBadge status={listing.status} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {listing.title}
                    </h4>
                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-400">{formatDate(listing.createdAt)}</span>
                      <span className="font-mono font-bold text-slate-900">
                        {listing.price} {listing.assetSymbol}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto space-y-4">
              <PlusCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">No Listings Created</h3>
                <p className="text-xs text-slate-500">
                  Publish a smart contract listing on the Soroban registry.
                </p>
              </div>
              <Link href="/create">
                <Button size="sm">Create First Listing</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: Disputes / Arbiter Desk */}
      {activeTab === "disputes" && (
        <Card className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isArbiter ? "Designated Arbiter Panel" : "Dispute Escalation Hub"}
              </h3>
              <p className="text-xs text-slate-500">
                Arbiter Address: <code className="font-mono">{truncateAddress(STELLAR_CONFIG.arbiterAddress)}</code>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            When disputes are raised, smart contract funds remain in custody lock. The arbiter verifies deliverables, reviews contract events, and invokes <code className="text-blue-700">resolve_dispute()</code>.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-center justify-between">
            <span>No pending active disputes under review.</span>
            <span className="text-emerald-700 font-semibold">All Escrows Healthy</span>
          </div>
        </Card>
      )}
    </div>
  );
}
