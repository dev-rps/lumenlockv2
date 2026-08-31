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
  Lock,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  ArrowUpRight,
  Zap,
} from "@/app/components/ui/Icons";
import { cn } from "@/app/lib/utils";
import type { Listing } from "@/app/types";

export default function HomePage() {
  const { data: listings, isLoading } = useListings();

  const [simAmount, setSimAmount] = useState<number>(200);
  const [simMilestones] = useState<number[]>([30, 70]);
  const [simAsset, setSimAsset] = useState<"XLM" | "USDC">("XLM");

  const featuredListings = (listings || []).slice(0, 3);

  return (
    <div className="space-y-20 md:space-y-28">

      {/* ────────────────────── Hero ────────────────────── */}
      <section className="relative overflow-hidden pt-14 md:pt-20 pb-8 bg-mesh-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-7">

            {/* Live badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
              style={{
                background: "var(--primary-50)",
                border: "1px solid var(--primary-200)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-[var(--success-icon)]"
                style={{
                  boxShadow: "0 0 0 3px rgba(22,163,74,0.2)",
                  animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                }}
              />
              <span
                className="text-xs font-bold"
                style={{ color: "var(--primary-700)" }}
              >
                Stellar Soroban Escrow Protocol v2
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold"
              style={{ color: "var(--fg-default)", letterSpacing: "-0.03em", lineHeight: 1.08 }}
            >
              Trustless P2P Commerce{" "}
              <br className="hidden sm:block" />
              with{" "}
              <span className="text-gradient-primary">Smart Escrow</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
               style={{ color: "var(--fg-muted)" }}>
              Buy and sell services, code, and digital products without mutual trust. Funds remain
              securely locked in Soroban smart contracts until bilateral confirmation or milestone
              completion.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <Link href="/marketplace" className="w-full sm:w-auto">
                <Button size="lg" className="w-full" leftIcon={<Compass className="w-4 h-4" />}>
                  Explore Marketplace
                </Button>
              </Link>
              <Link href="/create" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Create Escrow Listing
                </Button>
              </Link>
            </div>

            {/* Trust guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-5">
              {[
                { icon: CheckCircle2, label: "Bilateral Dual Confirmation", color: "var(--success-icon)" },
                { icon: Layers,       label: "Milestone Tranche Payouts",   color: "var(--primary-500)" },
                { icon: Clock,        label: "Automatic 7-Day Refund",       color: "var(--warning-icon)" },
              ].map(({ icon: Icon, label, color }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "var(--fg-muted)" }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────── Protocol Metrics ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border-subtle)] rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface-0)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {[
            { label: "Total Volume Secured", value: "128,500+ XLM",     color: "var(--fg-default)" },
            { label: "Escrows Completed",    value: "340+",             color: "var(--fg-default)" },
            { label: "Dispute Rate",         value: "< 0.5%",           color: "var(--success-text)" },
            { label: "Network",              value: "Stellar Soroban",  color: "var(--primary-600)" },
          ].map((stat, i) => (
            <div
              key={i}
              className="space-y-1 text-center md:text-left p-6 md:p-8"
            >
              <span
                className="text-xs font-semibold uppercase tracking-wider block"
                style={{ color: "var(--fg-subtle)" }}
              >
                {stat.label}
              </span>
              <span
                className="font-display text-2xl md:text-3xl font-extrabold font-mono block"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────── Escrow Simulator ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card
          variant="elevated"
          className="p-6 md:p-10"
          style={{ borderColor: "var(--primary-100)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left — Controls */}
            <div className="lg:col-span-6 space-y-5">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: "var(--primary-50)",
                  color: "var(--primary-600)",
                  border: "1px solid var(--primary-200)",
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Interactive Protocol Simulator</span>
              </div>

              <h2
                className="font-display text-2xl md:text-3xl font-extrabold leading-tight"
                style={{ color: "var(--fg-default)" }}
              >
                Simulate Your Custom Milestone Escrow Flow
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                Test how funds are partitioned into verifiable delivery tranches, locked in the{" "}
                <code
                  className="text-xs px-1.5 py-0.5 rounded-md font-mono"
                  style={{
                    background: "var(--primary-50)",
                    color: "var(--primary-600)",
                    border: "1px solid var(--primary-100)",
                  }}
                >
                  EscrowVault
                </code>{" "}
                contract, and released immediately upon mutual confirmation.
              </p>

              <div className="space-y-5 pt-2">
                {/* Amount slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-3"
                       style={{ color: "var(--fg-default)" }}>
                    <span>Total Agreement Value</span>
                    <span
                      className="font-mono text-sm"
                      style={{ color: "var(--primary-600)" }}
                    >
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
                    className="w-full"
                    style={{
                      background: `linear-gradient(to right, var(--primary-500) 0%, var(--primary-500) ${((simAmount - 50) / 950) * 100}%, var(--surface-2) ${((simAmount - 50) / 950) * 100}%, var(--surface-2) 100%)`,
                    }}
                  />
                </div>

                {/* Asset toggle */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--fg-default)" }}
                  >
                    Asset:
                  </span>
                  <div
                    className="flex rounded-xl overflow-hidden border border-[var(--border-subtle)]"
                    role="group"
                  >
                    {(["XLM", "USDC"] as const).map((asset) => (
                      <button
                        key={asset}
                        onClick={() => setSimAsset(asset)}
                        className={cn(
                          "px-4 py-1.5 text-xs font-bold transition-all duration-150",
                          simAsset === asset
                            ? "text-white"
                            : "text-[var(--fg-muted)] hover:text-[var(--fg-default)] hover:bg-[var(--surface-2)]"
                        )}
                        style={
                          simAsset === asset
                            ? { background: "var(--primary-600)" }
                            : { background: "var(--surface-0)" }
                        }
                      >
                        {asset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Visualization */}
            <div
              className="lg:col-span-6 rounded-2xl border p-6 space-y-5"
              style={{
                background: "var(--surface-0)",
                borderColor: "var(--border-subtle)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--fg-subtle)" }}
                >
                  Escrow Tranche Breakdown
                </span>
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                  style={{
                    background: "var(--success-bg)",
                    color: "var(--success-text)",
                    border: "1px solid var(--success-border)",
                  }}
                >
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
                {[
                  { label: "Tranche 1 Release", pct: 30 },
                  { label: "Tranche 2 Release", pct: 70 },
                ].map(({ label, pct }) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl space-y-1"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span className="text-[11px] block" style={{ color: "var(--fg-subtle)" }}>
                      {label}
                    </span>
                    <span
                      className="font-bold font-mono"
                      style={{ color: "var(--fg-default)" }}
                    >
                      {((simAmount * pct) / 100).toFixed(0)} {simAsset} ({pct}%)
                    </span>
                  </div>
                ))}
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

      {/* ────────────────────── Featured Listings ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2
              className="font-display text-2xl md:text-3xl font-extrabold"
              style={{ color: "var(--fg-default)" }}
            >
              Featured Active Listings
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
              Top escrow-verified services available for immediate engagement.
            </p>
          </div>
          <Link href="/marketplace">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              View All Listings
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredListings.map((listing: Listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ────────────────────── How It Works ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2
            className="font-display text-2xl md:text-3xl font-extrabold"
            style={{ color: "var(--fg-default)" }}
          >
            How LumenLock Protects Every Trade
          </h2>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
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
              accent: "var(--primary-500)",
              accentBg: "var(--primary-50)",
            },
            {
              step: "02",
              title: "Open & Fund Escrow",
              desc: "Buyer initiates escrow. Tokens are transferred directly into the EscrowVault smart contract custody.",
              icon: Lock,
              accent: "var(--warning-icon)",
              accentBg: "var(--warning-bg)",
            },
            {
              step: "03",
              title: "Deliver & Confirm",
              desc: "Seller delivers work. Both parties confirm satisfaction in the bilateral settlement room.",
              icon: CheckCircle2,
              accent: "var(--success-icon)",
              accentBg: "var(--success-bg)",
            },
            {
              step: "04",
              title: "Auto-Release or Refund",
              desc: "Vault automatically transfers funds to seller. If deadline expires without confirmation, buyer claims 100% refund.",
              icon: ShieldCheck,
              accent: "var(--primary-600)",
              accentBg: "var(--primary-50)",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="p-6 space-y-4">
                <span
                  className="font-display text-4xl font-extrabold font-mono block leading-none"
                  style={{ color: "var(--border-default)" }}
                >
                  {item.step}
                </span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: item.accentBg }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.accent }} />
                </div>
                <div className="space-y-1.5">
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--fg-default)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ────────────────────── CTA Banner ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div
          className="rounded-3xl p-8 md:p-14 text-center space-y-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--primary-700) 0%, var(--primary-600) 50%, var(--primary-500) 100%)",
          }}
        >
          {/* Decorative mesh overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)",
            }}
          />

          <div className="relative max-w-2xl mx-auto space-y-3">
            <h2
              className="font-display text-2xl md:text-4xl font-extrabold text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ready to Transact Securely on Stellar?
            </h2>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              Join developers, designers, and web3 builders using LumenLock for trustless
              peer-to-peer escrow payments.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/marketplace">
              <Button
                size="lg"
                className="text-[var(--primary-700)] font-bold"
                style={{ background: "white" }}
              >
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/create">
              <Button
                size="lg"
                className="text-white border-white/30 hover:bg-white/15"
                variant="outline"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(4px)",
                  borderColor: "rgba(255,255,255,0.25)",
                }}
              >
                Publish a Listing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
