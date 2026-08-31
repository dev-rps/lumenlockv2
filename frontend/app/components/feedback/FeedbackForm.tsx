"use client";

import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { useAuthStore } from "@/app/state/authStore";
import { useWalletStore } from "@/app/state/walletStore";

interface FeedbackFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export function FeedbackForm({ onSuccess, compact = false }: FeedbackFormProps) {
  const user = useAuthStore((s) => s.user);
  const connectedAddress = useWalletStore((s) => s.address);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress || connectedAddress || "");
  const [network, setNetwork] = useState("Stellar Testnet");
  const [bugsReported, setBugsReported] = useState("");
  const [improvements, setImprovements] = useState("");
  const [recommend, setRecommend] = useState<"Yes" | "No" | "Maybe">("Yes");
  const [featureRating, setFeatureRating] = useState<number>(5);
  const [uxRating, setUxRating] = useState<number>(5);
  const [contractRating, setContractRating] = useState<number>(5);

  // Auto-calculated Overall Rating (average of feature, ux, and contract ratings)
  const rawAvg = (featureRating + uxRating + contractRating) / 3;
  const overallRating = Math.round(rawAvg);
  const overallFormatted = rawAvg.toFixed(1);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Sync state if user or wallet state loads asynchronously
  useEffect(() => {
    if (user?.name && !name) setName(user.name);
    if (user?.email && !email) setEmail(user.email);
    if ((user?.walletAddress || connectedAddress) && !walletAddress) {
      setWalletAddress(user?.walletAddress || connectedAddress || "");
    }
  }, [user, connectedAddress, name, email, walletAddress]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim()) {
        setError("Name and Email are required.");
        return;
      }
      if (!network.trim()) {
        setError("Network selection is required.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            walletAddress: walletAddress.trim(),
            network: network.trim(),
            bugsReported: bugsReported.trim() || "N/A",
            improvements: improvements.trim(),
            recommend,
            featureRating,
            uxRating,
            contractRating,
            overallRating,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Submission failed");
          setLoading(false);
          return;
        }

        setSuccess(true);
        onSuccess?.();
      } catch {
        setError("Network error — please try again.");
      }
      setLoading(false);
    },
    [name, email, walletAddress, network, bugsReported, improvements, recommend, featureRating, uxRating, contractRating, overallRating, onSuccess]
  );

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: "var(--success-bg)", border: "2px solid var(--success-border)" }}
        >
          🎉
        </div>
        <div>
          <h3 className="font-bold text-xl" style={{ color: "var(--fg-default)" }}>
            Thank You for Your Feedback!
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
            Your insights directly help us build a safer, faster escrow experience on Stellar.
          </p>
        </div>
        <button
          onClick={() => {
            setSuccess(false);
            setBugsReported("");
            setImprovements("");
          }}
          className="text-sm font-semibold mt-2 hover:underline"
          style={{ color: "var(--primary-600)" }}
        >
          Submit another feedback →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", compact ? "" : "max-w-xl mx-auto")}>
      {/* Name * */}
      <div className="space-y-1.5">
        <label htmlFor="fb-name" className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--fg-default)" }}>
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fb-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Aarav Sharma"
          required
          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-150"
          style={{ background: "var(--surface-0)", border: "1.5px solid var(--border-default)", color: "var(--fg-default)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-400)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
      </div>

      {/* Email * */}
      <div className="space-y-1.5">
        <label htmlFor="fb-email" className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--fg-default)" }}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="fb-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. aarav.sharma@gmail.com"
          required
          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-150"
          style={{ background: "var(--surface-0)", border: "1.5px solid var(--border-default)", color: "var(--fg-default)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-400)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
      </div>

      {/* Wallet Address */}
      <div className="space-y-1.5">
        <label htmlFor="fb-wallet" className="text-sm font-semibold" style={{ color: "var(--fg-default)" }}>
          Wallet Address <span className="text-xs font-normal" style={{ color: "var(--fg-subtle)" }}>(Optional)</span>
        </label>
        <input
          id="fb-wallet"
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="G..."
          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-150 font-mono"
          style={{ background: "var(--surface-0)", border: "1.5px solid var(--border-default)", color: "var(--fg-default)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-400)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
      </div>

      {/* Network * */}
      <div className="space-y-1.5">
        <label htmlFor="fb-network" className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--fg-default)" }}>
          Network <span className="text-red-500">*</span>
        </label>
        <select
          id="fb-network"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          required
          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-150"
          style={{ background: "var(--surface-0)", border: "1.5px solid var(--border-default)", color: "var(--fg-default)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-400)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
        >
          <option value="Stellar Testnet">Stellar Testnet (Soroban)</option>
          <option value="Stellar Mainnet">Stellar Mainnet</option>
          <option value="Local Standalone RPC">Local Standalone RPC</option>
        </select>
      </div>

      {/* Did you encounter any bugs or usability issues? If NO (write N/A) */}
      <div className="space-y-1.5">
        <label htmlFor="fb-bugs" className="text-sm font-semibold leading-snug" style={{ color: "var(--fg-default)" }}>
          Did you encounter any bugs or usability issues? If NO (write N/A)
        </label>
        <textarea
          id="fb-bugs"
          value={bugsReported}
          onChange={(e) => setBugsReported(e.target.value)}
          rows={3}
          placeholder="Describe any bugs encountered, or write N/A..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-150 resize-none"
          style={{ background: "var(--surface-0)", border: "1.5px solid var(--border-default)", color: "var(--fg-default)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-400)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
      </div>

      {/* What improvements would you like to see? */}
      <div className="space-y-1.5">
        <label htmlFor="fb-improvements" className="text-sm font-semibold leading-snug" style={{ color: "var(--fg-default)" }}>
          What improvements would you like to see?
        </label>
        <textarea
          id="fb-improvements"
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
          rows={3}
          placeholder="Share your feature suggestions, UI feedback, or ideas..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-150 resize-none"
          style={{ background: "var(--surface-0)", border: "1.5px solid var(--border-default)", color: "var(--fg-default)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-400)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
      </div>

      {/* Would you recommend this product to others? * */}
      <div className="space-y-2">
        <label className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--fg-default)" }}>
          Would you recommend this product to others? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["Yes", "No", "Maybe"] as const).map((option) => {
            const active = recommend === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setRecommend(option)}
                className="h-11 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2"
                style={{
                  background: active ? "var(--primary-50)" : "var(--surface-0)",
                  border: active ? "2px solid var(--primary-600)" : "1.5px solid var(--border-default)",
                  color: active ? "var(--primary-700)" : "var(--fg-default)",
                  boxShadow: active ? "0 0 0 3px rgba(79,70,229,0.15)" : "none",
                }}
              >
                <span
                  className="w-4 h-4 rounded-full border flex items-center justify-center"
                  style={{
                    borderColor: active ? "var(--primary-600)" : "var(--border-strong)",
                    background: active ? "var(--primary-600)" : "transparent",
                  }}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Ratings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--border-subtle)" }}>
          <div>
            <h4 className="text-sm font-bold" style={{ color: "var(--fg-default)" }}>Detailed Category Ratings</h4>
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>Rate each area from 1 (Poor) to 5 (Excellent)</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: "var(--primary-50)", color: "var(--primary-600)" }}>
            3 Category Ratings
          </span>
        </div>

        {/* 1. Feature Experience Rating */}
        <div className="space-y-2 p-4 rounded-2xl" style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--fg-default)" }}>
                Feature Experience <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px]" style={{ color: "var(--fg-muted)" }}>Escrow workflows, milestones, dispute resolution</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
              {featureRating} / 5
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2 pt-1">
            {[1, 2, 3, 4, 5].map((num) => {
              const active = featureRating === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFeatureRating(num)}
                  className="h-10 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-center"
                  style={{
                    background: active ? "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)" : "var(--surface-0)",
                    border: active ? "none" : "1.5px solid var(--border-default)",
                    color: active ? "#ffffff" : "var(--fg-default)",
                    boxShadow: active ? "var(--shadow-primary)" : "none",
                    transform: active ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. UI / UX Design Rating */}
        <div className="space-y-2 p-4 rounded-2xl" style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--fg-default)" }}>
                UI / UX Design <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px]" style={{ color: "var(--fg-muted)" }}>Interface layout, responsiveness, visual clarity</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
              {uxRating} / 5
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2 pt-1">
            {[1, 2, 3, 4, 5].map((num) => {
              const active = uxRating === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setUxRating(num)}
                  className="h-10 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-center"
                  style={{
                    background: active ? "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)" : "var(--surface-0)",
                    border: active ? "none" : "1.5px solid var(--border-default)",
                    color: active ? "#ffffff" : "var(--fg-default)",
                    boxShadow: active ? "var(--shadow-primary)" : "none",
                    transform: active ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Smart Contract & Security Rating */}
        <div className="space-y-2 p-4 rounded-2xl" style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--fg-default)" }}>
                Smart Contract & Security <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px]" style={{ color: "var(--fg-muted)" }}>Wallet integration, transaction safety & trust</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg" style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}>
              {contractRating} / 5
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2 pt-1">
            {[1, 2, 3, 4, 5].map((num) => {
              const active = contractRating === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setContractRating(num)}
                  className="h-10 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-center"
                  style={{
                    background: active ? "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)" : "var(--surface-0)",
                    border: active ? "none" : "1.5px solid var(--border-default)",
                    color: active ? "#ffffff" : "var(--fg-default)",
                    boxShadow: active ? "var(--shadow-primary)" : "none",
                    transform: active ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Auto-Calculated Overall Rating Summary Card (Just before Submit button) */}
      <div
        className="p-5 rounded-2xl relative overflow-hidden transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)",
          border: "2px solid var(--primary-500)",
          boxShadow: "0 4px 20px rgba(79,70,229,0.12)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <h4 className="text-sm font-bold" style={{ color: "var(--fg-default)" }}>
                Overall Rating (Auto-Calculated)
              </h4>
              <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                Computed average of Feature, UI/UX, and Smart Contract ratings
              </p>
            </div>
          </div>
          <span
            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
            style={{ background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)" }}
          >
            Auto Calculated
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(79,70,229,0.15)" }}>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={star <= overallRating ? "#FBBF24" : "none"}
                stroke={star <= overallRating ? "#FBBF24" : "var(--border-default)"}
                strokeWidth="1.5"
                className="transition-all duration-200"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono" style={{ color: "var(--primary-700)" }}>
              {overallFormatted}
            </span>
            <span className="text-sm font-bold text-gray-500 ml-1">/ 5</span>
            <p className="text-[10px] text-gray-500">
              (Saved as {overallRating}/5 in database & CSV)
            </p>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)", color: "var(--danger-text)" }}>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        id="feedback-submit"
        disabled={loading}
        className="w-full h-12 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
          boxShadow: "var(--shadow-primary)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation: "spin 0.8s linear infinite" }} />
            Submitting Feedback…
          </span>
        ) : (
          "Submit Feedback ✨"
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
