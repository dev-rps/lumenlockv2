"use client";

import React, { forwardRef } from "react";
import { cn } from "@/app/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "inset" | "bordered";
  hoverEffect?: boolean;
  glass?: boolean;
  borderAccent?: "primary" | "success" | "warning" | "danger";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      hoverEffect = false,
      glass = false,
      borderAccent,
      children,
      ...props
    },
    ref
  ) => {
    const base = "relative overflow-hidden";

    const variantClasses = {
      default:  "card-base",
      elevated: "card-elevated",
      inset:    "card-inset",
      bordered: "card-base",
    };

    const accentBorder = {
      primary: "border-l-4 border-l-[var(--primary-500)]",
      success: "border-l-4 border-l-[var(--success-icon)]",
      warning: "border-l-4 border-l-[var(--warning-icon)]",
      danger:  "border-l-4 border-l-[var(--danger-icon)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          base,
          glass ? "glass-panel" : variantClasses[variant],
          hoverEffect && "card-interactive cursor-pointer",
          borderAccent && accentBorder[borderAccent],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 md:p-6 pb-3 flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-lg md:text-xl font-bold tracking-tight text-[var(--fg-default)]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-[var(--fg-muted)] leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 md:p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-5 md:p-6 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardDivider({ className }: { className?: string }) {
  return <div className={cn("border-t border-[var(--border-subtle)] mx-5 md:mx-6", className)} />;
}
