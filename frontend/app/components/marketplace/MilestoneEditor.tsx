"use client";

import React from "react";
import { Plus, Trash2, AlertCircle, CheckCircle2, Minus } from "@/app/components/ui/Icons";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/utils";

export interface MilestoneItem {
  percentage: number;
  label: string;
}

interface MilestoneEditorProps {
  milestones: MilestoneItem[];
  onChange: (milestones: MilestoneItem[]) => void;
  totalPrice?: string;
  assetSymbol?: string;
}

const SEGMENT_COLORS = [
  "var(--primary-500)",
  "var(--primary-400)",
  "#818CF8",
  "#A5B4FC",
  "#C7D2FE",
];

export function MilestoneEditor({
  milestones,
  onChange,
  totalPrice = "100",
  assetSymbol = "XLM",
}: MilestoneEditorProps) {
  const sum = milestones.reduce((acc, m) => acc + (Number(m.percentage) || 0), 0);
  const isValid = sum === 100;

  const handleAddMilestone = () => {
    if (milestones.length >= 5) return;
    const remaining = Math.max(0, 100 - sum);
    onChange([
      ...milestones,
      {
        percentage: remaining > 0 ? remaining : 20,
        label: `Stage ${milestones.length + 1} Deliverable`,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    if (milestones.length <= 1) return;
    onChange(milestones.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: "percentage" | "label", value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleStep = (index: number, delta: number) => {
    const next = Math.min(99, Math.max(1, (milestones[index].percentage || 0) + delta));
    handleUpdate(index, "percentage", next);
  };

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-4 md:p-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[var(--fg-default)]">
            Milestone Tranche Structure
          </h4>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            Split escrow payout into verifiable stages — must sum to 100%
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg",
            "border transition-colors duration-200",
            isValid
              ? "bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]"
              : "bg-[var(--danger-bg)] text-[var(--danger-text)] border-[var(--danger-border)]"
          )}
        >
          {isValid ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          <span>{sum}%</span>
        </div>
      </div>

      {/* ── Segmented progress bar ── */}
      <div className="h-2 w-full rounded-full bg-[var(--surface-2)] overflow-hidden flex gap-0.5">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            style={{
              width: `${Math.min(100, m.percentage || 0)}%`,
              background: SEGMENT_COLORS[idx % SEGMENT_COLORS.length],
              transition: "width 0.3s var(--ease-smooth)",
            }}
            className="h-full rounded-sm"
          />
        ))}
      </div>

      {/* ── Milestone list ── */}
      <div className="space-y-2">
        {milestones.map((m, idx) => {
          const trancheVal = ((parseFloat(totalPrice || "0") * (m.percentage || 0)) / 100).toFixed(2);
          const color = SEGMENT_COLORS[idx % SEGMENT_COLORS.length];

          return (
            <div
              key={idx}
              className={cn(
                "flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
                "p-3 bg-[var(--surface-0)] rounded-xl",
                "border border-[var(--border-subtle)]",
                "shadow-[var(--shadow-xs)]",
                "transition-shadow duration-150 hover:shadow-[var(--shadow-sm)]"
              )}
            >
              {/* Index dot */}
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                style={{ background: color }}
              >
                {idx + 1}
              </div>

              {/* Label input */}
              <input
                type="text"
                value={m.label}
                onChange={(e) => handleUpdate(idx, "label", e.target.value)}
                placeholder="Milestone description..."
                className={cn(
                  "flex-1 text-sm font-medium bg-transparent",
                  "border-0 focus:outline-none focus:ring-0",
                  "text-[var(--fg-default)] placeholder:text-[var(--fg-subtle)] p-1"
                )}
              />

              <div className="flex items-center gap-2 shrink-0">
                {/* Stepper */}
                <div
                  className={cn(
                    "flex items-center gap-0 rounded-lg overflow-hidden",
                    "border border-[var(--border-subtle)] bg-[var(--surface-1)]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleStep(idx, -5)}
                    className="px-2 py-1.5 text-[var(--fg-muted)] hover:text-[var(--fg-default)] hover:bg-[var(--surface-2)] transition-colors duration-100"
                    aria-label="Decrease"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={m.percentage || ""}
                    onChange={(e) => handleUpdate(idx, "percentage", parseInt(e.target.value) || 0)}
                    className="w-10 text-xs font-bold font-mono text-center bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-[var(--fg-default)]"
                  />
                  <span className="text-xs text-[var(--fg-subtle)] pr-1">%</span>
                  <button
                    type="button"
                    onClick={() => handleStep(idx, 5)}
                    className="px-2 py-1.5 text-[var(--fg-muted)] hover:text-[var(--fg-default)] hover:bg-[var(--surface-2)] transition-colors duration-100"
                    aria-label="Increase"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Tranche value */}
                <span className="text-xs font-mono font-medium text-[var(--fg-muted)] w-24 text-right">
                  ≈ {trancheVal} {assetSymbol}
                </span>

                {/* Remove */}
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 rounded-lg text-[var(--fg-subtle)] hover:text-[var(--danger-icon)] hover:bg-[var(--danger-bg)] transition-colors duration-150 focus-ring"
                    aria-label="Remove milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add button ── */}
      {milestones.length < 5 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddMilestone}
          className="w-full border-dashed text-[var(--fg-muted)] hover:text-[var(--primary-600)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)]"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Milestone Stage ({milestones.length}/5) · {Math.max(0, 100 - sum)}% remaining
        </Button>
      )}
    </div>
  );
}
