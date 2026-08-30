"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWalletStore } from "@/app/state/walletStore";
import { useCreateListing } from "@/app/hooks/useListings";
import { STELLAR_CONFIG } from "@/app/services/stellar";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { MilestoneEditor, MilestoneItem } from "@/app/components/marketplace/MilestoneEditor";
import { MilestoneProgressBar } from "@/app/components/ui/MilestoneProgressBar";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function CreateListingPage() {
  const router = useRouter();
  const { isConnected, address, setModalOpen } = useWalletStore();
  const createListingMutation = useCreateListing();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Development");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("100");
  const [assetSymbol, setAssetSymbol] = useState<"XLM" | "USDC">("XLM");
  const [enableMilestones, setEnableMilestones] = useState(true);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    { percentage: 30, label: "Initial Architecture & Milestone 1" },
    { percentage: 70, label: "Final Delivery & Handover" },
  ]);

  const categories = ["Development", "Design", "Consulting", "Marketing", "Digital Asset", "Other"];

  const milestoneSum = milestones.reduce((acc, m) => acc + (Number(m.percentage) || 0), 0);
  const isMilestoneValid = !enableMilestones || milestoneSum === 100;

  const isStep1Valid = title.trim().length >= 4 && description.trim().length >= 10;
  const isStep2Valid = parseFloat(price) > 0;
  const isStep3Valid = isMilestoneValid;

  const handlePublish = async () => {
    if (!isConnected || !address) {
      setModalOpen(true);
      return;
    }

    const assetAddress =
      assetSymbol === "XLM"
        ? STELLAR_CONFIG.xlmTokenAddress
        : STELLAR_CONFIG.usdcTokenAddress;

    const milestoneConfig = enableMilestones
      ? {
          percentages: milestones.map((m) => Number(m.percentage)),
          labels: milestones.map((m) => m.label),
        }
      : null;

    try {
      const result = await createListingMutation.mutateAsync({
        seller: address,
        title,
        description,
        price,
        asset: assetAddress,
        assetSymbol,
        category,
        milestoneConfig,
      });

      router.push(`/marketplace/${result.listingId}`);
    } catch {
      // Error handled in mutation toast
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-2">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Create New Escrow Listing
        </h1>
        <p className="text-sm text-slate-500">
          Set up a smart contract-backed listing with optional milestone tranches.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
        {[
          { num: 1, label: "Basic Details" },
          { num: 2, label: "Pricing & Asset" },
          { num: 3, label: "Milestones" },
          { num: 4, label: "Review & Publish" },
        ].map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <button
              key={step.num}
              onClick={() => {
                if (step.num === 1) setCurrentStep(1);
                if (step.num === 2 && isStep1Valid) setCurrentStep(2);
                if (step.num === 3 && isStep1Valid && isStep2Valid) setCurrentStep(3);
                if (step.num === 4 && isStep1Valid && isStep2Valid && isStep3Valid) setCurrentStep(4);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                isCurrent
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : isDone
                  ? "text-emerald-700 hover:bg-slate-50"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isCurrent
                    ? "bg-blue-600 text-white"
                    : isDone
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
              </div>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Basic Details */}
      {currentStep === 1 && (
        <Card className="p-6 md:p-8 space-y-6 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Step 1: Listing Information</h3>
            <p className="text-xs text-slate-500">Provide clear deliverables and scope.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Listing Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Soroban Smart Contract Architecture & Audit"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Detailed Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your service, deliverables, delivery timeline, and requirements..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              disabled={!isStep1Valid}
              onClick={() => setCurrentStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Pricing
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Pricing & Asset */}
      {currentStep === 2 && (
        <Card className="p-6 md:p-8 space-y-6 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Step 2: Price & Token Settlement</h3>
            <p className="text-xs text-slate-500">Define price in XLM or USDC (Stellar Asset Contract).</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Listing Price</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-2.5 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Settlement Asset</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssetSymbol("XLM")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      assetSymbol === "XLM"
                        ? "bg-blue-50 border-blue-400 text-blue-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    XLM (Native)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssetSymbol("USDC")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      assetSymbol === "USDC"
                        ? "bg-blue-50 border-blue-400 text-blue-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    USDC (Testnet)
                  </button>
                </div>
              </div>
            </div>

            {/* Fee summary */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Escrow Amount:</span>
                <span className="font-mono font-bold text-slate-900">{price} {assetSymbol}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>LumenLock Protocol Custody Fee:</span>
                <span className="font-mono text-emerald-600">0.00 {assetSymbol} (0%)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button
              disabled={!isStep2Valid}
              onClick={() => setCurrentStep(3)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Milestones
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Milestones */}
      {currentStep === 3 && (
        <Card className="p-6 md:p-8 space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Step 3: Milestone Payouts</h3>
              <p className="text-xs text-slate-500">
                Enable partial releases or choose single final settlement.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableMilestones}
                onChange={(e) => setEnableMilestones(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">Enable Milestones</span>
            </label>
          </div>

          {enableMilestones ? (
            <MilestoneEditor
              milestones={milestones}
              onChange={setMilestones}
              totalPrice={price}
              assetSymbol={assetSymbol}
            />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center space-y-2">
              <p className="text-xs font-bold text-slate-900">Single Payout on Final Delivery</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                100% of {price} {assetSymbol} will be held until both buyer and seller confirm final project completion.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button
              disabled={!isStep3Valid}
              onClick={() => setCurrentStep(4)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Review & Publish
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Review & Publish */}
      {currentStep === 4 && (
        <Card className="p-6 md:p-8 space-y-6 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Step 4: Review On-Chain Listing</h3>
            <p className="text-xs text-slate-500">
              Confirm your listing details before invoking the Soroban <code className="text-blue-700">create_listing</code> transaction.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {category}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-2">{title}</h4>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold font-mono text-slate-900">{price}</span>{" "}
                <span className="text-xs font-bold text-blue-600 font-mono">{assetSymbol}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-slate-200">
              {description}
            </p>

            {enableMilestones && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700">Configured Milestones:</span>
                <MilestoneProgressBar
                  percentages={milestones.map((m) => Number(m.percentage))}
                  labels={milestones.map((m) => m.label)}
                  currentIndex={0}
                  totalAmount={price}
                  assetSymbol={assetSymbol}
                />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-900 leading-relaxed">
              Once created, the listing will be registered in the <code className="font-mono font-bold">MarketplaceRegistry</code> smart contract and visible to all Stellar buyers.
            </p>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              Back
            </Button>
            <Button
              size="lg"
              onClick={handlePublish}
              isLoading={createListingMutation.isPending}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Sign & Publish Listing
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
