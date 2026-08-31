"use client";

import React from "react";
import { getAvatarGradient, getAvatarInitials } from "@/app/lib/avatar";
import { cn } from "@/app/lib/utils";

export interface AvatarProps {
  address: string;
  size?: "xs" | "sm" | "md" | "lg";
  ring?: boolean;
  className?: string;
}

const sizeMap = {
  xs: { wh: "w-5 h-5", text: "text-[9px]" },
  sm: { wh: "w-7 h-7", text: "text-[11px]" },
  md: { wh: "w-9 h-9", text: "text-xs" },
  lg: { wh: "w-12 h-12", text: "text-sm" },
};

export function Avatar({ address, size = "md", ring = false, className }: AvatarProps) {
  const { wh, text } = sizeMap[size];
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none",
        wh,
        text,
        ring && "ring-2 ring-white ring-offset-1 ring-offset-[var(--surface-0)]",
        className
      )}
      style={{ background: getAvatarGradient(address) }}
      aria-label={`Avatar for ${address}`}
      title={address}
    >
      {getAvatarInitials(address)}
    </div>
  );
}
