"use client";

import React, { useEffect } from "react";
import { X } from "@/app/components/ui/Icons";
import { cn } from "@/app/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ animation: "fade-in 0.18s ease-out forwards" }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--fg-default)]/40 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fade-in 0.18s ease-out forwards" }}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative w-full z-10",
          "bg-[var(--surface-0)]",
          "border border-[var(--border-subtle)]",
          "shadow-[var(--shadow-xl)]",
          "flex flex-col",
          "max-h-[92vh] sm:max-h-[85vh]",
          "rounded-t-3xl sm:rounded-2xl",
          maxWidthClasses[maxWidth]
        )}
        style={{
          animation: "modal-slide-up 0.22s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-12 bg-[var(--border-default)] rounded-full mx-auto mt-3 sm:hidden" />

        {/* Sticky header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 shrink-0">
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="font-display text-lg font-bold tracking-tight text-[var(--fg-default)]">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[var(--fg-muted)] mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={cn(
              "rounded-xl p-1.5 shrink-0 ml-4",
              "text-[var(--fg-subtle)] hover:text-[var(--fg-default)]",
              "hover:bg-[var(--surface-2)]",
              "transition-colors duration-150",
              "focus-ring"
            )}
            aria-label="Close modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 pb-6 flex-1 min-h-0">{children}</div>
      </div>

      <style>{`
        @keyframes modal-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
