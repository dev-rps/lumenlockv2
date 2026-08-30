"use client";

import React from "react";
import { Plus, Trash2, AlertCircle, CheckCircle2 } from "@/app/components/ui/Icons";
import { Button } from "@/app/components/ui/Button";

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

  const handleUpdate = (index: number, field: "percentage" | "label", value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Milestone Tranche Structure</h4>
          <p className="text-xs text-slate-500">
            Split the escrow payout into verifiable delivery stages (must sum to 100%)
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <span className={isValid ? "text-emerald-600" : "text-rose-600"}>
            Total: {sum}%
          </span>
          {isValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
        </div>
      </div>

      {/* Visual Bar */}
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex gap-0.5">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            style={{ width: `${Math.min(100, m.percentage || 0)}%` }}
            className={`h-full transition-all ${
              idx % 2 === 0 ? "bg-blue-600" : "bg-indigo-600"
            }`}
          />
        ))}
      </div>

      {/* Milestone List */}
      <div className="space-y-2.5">
        {milestones.map((m, idx) => {
          const trancheVal = ((parseFloat(totalPrice || "0") * (m.percentage || 0)) / 100).toFixed(2);

          return (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs"
            >
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>

              <input
                type="text"
                value={m.label}
                onChange={(e) => handleUpdate(idx, "label", e.target.value)}
                placeholder="Milestone description..."
                className="flex-1 text-xs md:text-sm font-medium bg-transparent border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 p-1"
              />

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={m.percentage || ""}
                    onChange={(e) =>
                      handleUpdate(idx, "percentage", parseInt(e.target.value) || 0)
                    }
                    className="w-12 text-xs font-bold font-mono text-right bg-transparent border-0 focus:ring-0 p-0 text-slate-900"
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>

                <span className="text-xs font-mono font-medium text-slate-500 w-24 text-right">
                  ≈ {trancheVal} {assetSymbol}
                </span>

                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {milestones.length < 5 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddMilestone}
          className="w-full border-dashed"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Another Milestone Stage ({milestones.length}/5)
        </Button>
      )}
    </div>
  );
}
