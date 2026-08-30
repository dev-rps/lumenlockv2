"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useListings } from "@/app/hooks/useListings";
import { ListingCard } from "@/app/components/marketplace/ListingCard";
import { ListingCardSkeleton } from "@/app/components/ui/Skeleton";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { MilestoneProgressBar } from "@/app/components/ui/MilestoneProgressBar";
import {
  ShieldCheck,
  Compass,
  PlusCircle,
  Sparkles,
  Lock,
  CheckCircle2,
  Clock,
  Scale,
  ArrowRight,
  Layers,
  Coins,
  ArrowUpRight,
  TrendingUp,
  Zap,
} from "@/app/components/ui/Icons";

export default function HomePage() {
  const { data: listings, isLoading } = useListings();

  // Interactive Escrow Simulator State
  const [simAmount, setSimAmount] = useState<number>(200);
  const [simMilestones, setSimMilestones] = useState<number[]>([30, 70]);
  const [simAsset, setSimAsset] = useState<"XLM" | "USDC">("XLM");

  const featuredListings = (listings || []).slice(0, 3);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 md:pt-16 pb-8 md:pb-12 gradient-hero-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-blue-800">
                Stellar Soroban Escrow Protocol v2
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Trustless P2P Commerce with{" "}
              <span className="gradient-brand">Smart Escrow</span> Settlement
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Buy and sell services, code, and digital products without mutual trust. Funds remain securely locked in Soroban smart contracts until bilateral confirmation or milestone completion.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/marketplace" className="w-full sm:w-auto">
                <Button size="lg" className="w-full shadow-lg shadow-blue-500/20" leftIcon={<Compass className="w-4 h-4" />}>
                  Explore Marketplace
                </Button>
              </Link>
              <Link href="/create" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  Create Escrow Listing
                </Button>
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bilateral Dual Confirmation</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Milestone Tranche Payouts</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Automatic 7-Day Refund</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Volume Secured
            </span>
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">
              128,500+ XLM
            </span>
          </div>

          <div className="space-y-1 text-center md:text-left border-l border-slate-100 pl-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Escrows Completed
            </span>
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">
              340+
            </span>
          </div>

          <div className="space-y-1 text-center md:text-left border-l border-slate-100 pl-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Dispute Rate
            </span>
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-emerald-600">
              &lt; 0.5%
            </span>
          </div>

          <div className="space-y-1 text-center md:text-left border-l border-slate-100 pl-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Network
            </span>
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-blue-600">
              Stellar Soroban
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Escrow Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6 md:p-10 border-blue-200 bg-gradient-to-br from-white to-blue-50/40 shadow-lg shadow-blue-500/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>Interactive Protocol Simulator</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Simulate Your Custom Milestone Escrow Flow
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Test how funds are partitioned into verifiable delivery tranches, locked in the <code className="text-blue-700">EscrowVault</code> contract, and released immediately upon mutual confirmation.
              </p>

              {/* Slider Controls */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Total Agreement Value:</span>
                    <span className="font-mono text-blue-600 text-sm">
                      {simAmount} {simAsset}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Asset:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSimAsset("XLM")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                        simAsset === "XLM" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600"
                      }`}
                    >
                      XLM (Native)
                    </button>
                    <button
                      onClick={() => setSimAsset("USDC")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                        simAsset === "USDC" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600"
                      }`}
                    >
                      USDC
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Visualization Box */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Escrow Tranche Breakdown
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  100% Fully Backed
                </span>
              </div>

              <MilestoneProgressBar
                percentages={simMilestones}
                labels={["Stage 1: Architecture & Design", "Stage 2: Deployment & Release"]}
                currentIndex={0}
                totalAmount={simAmount.toString()}
                assetSymbol={simAsset}
              />

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Tranche 1 Release</span>
                  <span className="font-bold font-mono text-slate-900">
                    {((simAmount * 30) / 100).toFixed(0)} {simAsset} (30%)
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Tranche 2 Release</span>
                  <span className="font-bold font-mono text-slate-900">
                    {((simAmount * 70) / 100).toFixed(0)} {simAsset} (70%)
                  </span>
                </div>
              </div>

              <Link href="/create">
                <Button className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Create This Milestone Agreement
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Featured Marketplace Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Featured Active Listings
            </h2>
            <p className="text-sm text-slate-500">
              Top escrow-verified services available for immediate engagement.
            </p>
          </div>
          <Link href="/marketplace">
            <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              View All Listings
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works 4-Step Sequence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            How LumenLock Protects Every Trade
          </h2>
          <p className="text-sm text-slate-500">
            A 4-step bilateral state machine running entirely on Soroban smart contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: "01",
              title: "Create or Choose Listing",
              desc: "Seller publishes a listing with title, deliverables, price in XLM/USDC, and optional milestone tranches.",
              icon: PlusCircle,
            },
            {
              step: "02",
              title: "Open & Fund Escrow",
              desc: "Buyer initiates escrow. Tokens are transferred directly into the EscrowVault smart contract custody.",
              icon: Lock,
            },
            {
              step: "03",
              title: "Deliver & Confirm",
              desc: "Seller delivers work. Both parties confirm satisfaction in the bilateral settlement room.",
              icon: CheckCircle2,
            },
            {
              step: "04",
              title: "Auto-Release or Refund",
              desc: "Vault automatically transfers funds to seller. If deadline expires without confirmation, buyer claims 100% refund.",
              icon: ShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="p-6 space-y-3 relative overflow-hidden bg-white">
                <span className="text-3xl font-extrabold font-mono text-slate-200 block">
                  {item.step}
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Ready to Transact Securely on Stellar?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Join developers, designers, and web3 builders using LumenLock for trustless peer-to-peer escrow payments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/marketplace">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 shadow-md">
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/create">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Publish a Listing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
