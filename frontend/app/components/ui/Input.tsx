"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/app/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      inputSize = "md",
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasError = !!errorText;

    const sizeClasses = {
      sm: "h-8 text-xs px-3 rounded-lg",
      md: "h-10 text-sm px-3.5 rounded-xl",
      lg: "h-12 text-base px-4 rounded-xl",
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold"
            style={{ color: "var(--fg-default)" }}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="absolute left-3 flex items-center pointer-events-none"
              style={{ color: "var(--fg-subtle)" }}
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full font-sans bg-[var(--surface-0)] text-[var(--fg-default)]",
              "border placeholder:text-[var(--fg-subtle)]",
              "transition-all duration-150 outline-none",
              "focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary-300)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              hasError
                ? "border-[var(--danger-icon)] bg-[var(--danger-bg)]"
                : "border-[var(--border-default)] hover:border-[var(--border-strong)]",
              leftIcon ? "pl-9" : "",
              rightIcon ? "pr-9" : "",
              sizeClasses[inputSize],
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {rightIcon && (
            <span
              className="absolute right-3 flex items-center pointer-events-none"
              style={{ color: "var(--fg-subtle)" }}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {hasError && (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium"
            style={{ color: "var(--danger-text)" }}
            role="alert"
          >
            {errorText}
          </p>
        )}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-xs"
            style={{ color: "var(--fg-subtle)" }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
