"use client";

import React, { forwardRef } from "react";
import { cn } from "@/app/lib/utils";
import { Loader2 } from "@/app/components/ui/Icons";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "amber" | "emerald";
  size?: "sm" | "md" | "lg";
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
      sm: "h-8 px-3 text-xs font-medium rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm font-medium rounded-xl gap-2",
      lg: "h-12 px-6 text-base font-semibold rounded-xl gap-2.5",
    };

    const variantClasses = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-[0.98] border border-blue-600/30",
      secondary:
        "bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-[0.98] border border-slate-200/80",
      outline:
        "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm active:scale-[0.98]",
      danger:
        "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-sm active:scale-[0.98]",
      amber:
        "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 active:scale-[0.98] border border-amber-600/30",
      emerald:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 active:scale-[0.98] border border-emerald-600/30",
      ghost:
        "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:scale-[0.98]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-sans transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none",
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
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
