"use client";

import React, { forwardRef } from "react";
import { cn } from "@/app/lib/utils";
import { Loader2 } from "@/app/components/ui/Icons";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "amber" | "emerald";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm:   "h-8 px-3 text-xs font-medium rounded-lg gap-1.5",
      md:   "h-10 px-4 text-sm font-medium rounded-xl gap-2",
      lg:   "h-11 px-5 text-sm font-semibold rounded-xl gap-2",
      xl:   "h-13 px-7 text-base font-semibold rounded-2xl gap-2.5",
      icon: "h-9 w-9 rounded-xl gap-0 flex-shrink-0",
    };

    const variantClasses = {
      primary:
        "bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white " +
        "shadow-[var(--shadow-primary)] active:scale-[0.97] " +
        "border border-[var(--primary-700)]/20 " +
        "transition-all duration-150",
      secondary:
        "bg-[var(--surface-2)] hover:bg-[var(--surface-inset)] text-[var(--fg-default)] " +
        "border border-[var(--border-subtle)] hover:border-[var(--border-default)] " +
        "active:scale-[0.97] transition-all duration-150",
      outline:
        "bg-[var(--surface-0)] hover:bg-[var(--surface-1)] text-[var(--fg-default)] " +
        "border border-[var(--border-default)] hover:border-[var(--primary-300)] " +
        "shadow-[var(--shadow-xs)] active:scale-[0.97] transition-all duration-150",
      danger:
        "bg-[var(--danger-bg)] hover:bg-[var(--danger-border)] text-[var(--danger-text)] " +
        "border border-[var(--danger-border)] hover:border-[var(--danger-icon)] " +
        "active:scale-[0.97] transition-all duration-150",
      amber:
        "bg-[var(--warning-icon)] hover:bg-[var(--warning-text)] text-white " +
        "shadow-[0_4px_14px_-2px_rgba(217,119,6,0.25)] active:scale-[0.97] " +
        "border border-amber-700/20 transition-all duration-150",
      emerald:
        "bg-[var(--success-icon)] hover:bg-emerald-700 text-white " +
        "shadow-[0_4px_14px_-2px_rgba(22,163,74,0.25)] active:scale-[0.97] " +
        "border border-emerald-700/20 transition-all duration-150",
      ghost:
        "bg-transparent hover:bg-[var(--surface-2)] text-[var(--fg-muted)] " +
        "hover:text-[var(--fg-default)] active:scale-[0.97] transition-all duration-150",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-sans cursor-pointer",
          "focus-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "select-none",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {size !== "icon" && <span>{children}</span>}
        {size === "icon" && !isLoading && children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
