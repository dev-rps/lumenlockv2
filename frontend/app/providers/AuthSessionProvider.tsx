"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/state/authStore";

/**
 * Mounts in layout.tsx and triggers a session check on every page load.
 * Renders nothing — purely side-effect.
 */
export function AuthSessionProvider() {
  const checkSession = useAuthStore((s) => s.checkSession);
  useEffect(() => {
    checkSession();
  }, [checkSession]);
  return null;
}
