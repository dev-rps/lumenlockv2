"use client";

import React, { useState, useEffect } from "react";
import { FeedbackForm } from "./FeedbackForm";

export function FeedbackModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ animation:"fade-in 0.18s ease-out forwards" }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ background:"rgba(26,24,22,0.45)" }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full sm:max-w-lg bg-[var(--surface-0)] border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow:"var(--shadow-xl)",
          animation:"modal-slide-up 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
          maxHeight:"92vh",
          display:"flex",
          flexDirection:"column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="h-1 w-10 rounded-full mx-auto mt-3 sm:hidden" style={{ background:"var(--border-default)" }}/>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0"
          style={{ borderBottom:"1px solid var(--border-subtle)" }}>
          <div>
            <h3 className="font-bold text-base" style={{ color:"var(--fg-default)" }}>Share Your Feedback ✨</h3>
            <p className="text-xs mt-0.5" style={{ color:"var(--fg-muted)" }}>Help us improve LumenLock</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150"
            style={{ color:"var(--fg-subtle)", background:"var(--surface-2)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <FeedbackForm compact onSuccess={() => setTimeout(onClose, 1800)} />
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
        @keyframes modal-slide-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
