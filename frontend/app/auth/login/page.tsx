"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/state/authStore";
import { cn } from "@/app/lib/utils";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
      <line x1="2" x2="22" y1="2" y2="22"/>
    </svg>
  );
}

const BRAND_STATS = [
  { label: "Active Testers", value: "15" },
  { label: "Testnet Txns",   value: "75+" },
  { label: "Avg Rating",     value: "4.7★" },
];

export default function LoginPage() {
  const router   = useRouter();
  const setUser  = useAuthStore((s) => s.setUser);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [mounted,  setMounted]  = useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); setLoading(false); return; }
      setUser(data.user);
      router.push("/dashboard");
    } catch {
      setError("Network error — please try again");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--surface-page)" }}>

      {/* ── Left Brand Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #312E81 0%, #4F46E5 45%, #6366F1 100%)",
        }}
      >
        {/* Animated orbs */}
        <div style={{
          position:"absolute", top:"-80px", left:"-80px",
          width:"320px", height:"320px", borderRadius:"50%",
          background:"rgba(255,255,255,0.05)",
          animation:"orb-float 8s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", bottom:"-60px", right:"-60px",
          width:"240px", height:"240px", borderRadius:"50%",
          background:"rgba(255,255,255,0.07)",
          animation:"orb-float 6s ease-in-out infinite reverse",
        }}/>
        <div style={{
          position:"absolute", top:"50%", right:"-40px",
          width:"180px", height:"180px", borderRadius:"50%",
          background:"rgba(255,255,255,0.04)",
          animation:"orb-float 10s ease-in-out infinite 2s",
        }}/>

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-none">LumenLock</p>
              <p className="text-white/60 text-xs mt-0.5">Stellar Soroban Escrow</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Trustless P2P Commerce<br/>on Stellar
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Secure peer-to-peer transactions backed by Soroban smart contract escrows with bilateral confirmation and milestone payouts.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {BRAND_STATS.map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)" }}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs">
            © 2026 LumenLock · Stellar Testnet
          </p>
        </div>

        <style>{`
          @keyframes orb-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50%       { transform: translateY(-20px) scale(1.05); }
          }
        `}</style>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div
          className="w-full max-w-md"
          style={{
            opacity:    mounted ? 1 : 0,
            transform:  mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"var(--primary-600)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
              </svg>
            </div>
            <span className="font-bold text-[var(--fg-default)]">LumenLock</span>
          </div>

          <h1 className="text-3xl font-bold mb-2" style={{ color:"var(--fg-default)" }}>
            Welcome back 👋
          </h1>
          <p className="text-sm mb-8" style={{ color:"var(--fg-muted)" }}>
            Sign in to your LumenLock account
          </p>

          {/* Demo hint */}
          <div className="mb-6 p-3 rounded-xl text-xs" style={{ background:"var(--info-bg)", border:"1px solid var(--info-border)", color:"var(--info-text)" }}>
            <strong>Demo credentials:</strong> aarav.sharma@gmail.com / Lumen@2026
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" style={{ color:"var(--fg-default)" }}>Email</label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-150"
                style={{
                  background:"var(--surface-0)",
                  border:"1.5px solid var(--border-default)",
                  color:"var(--fg-default)",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary-400)"}
                onBlur={(e)  => e.currentTarget.style.borderColor = "var(--border-default)"}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" style={{ color:"var(--fg-default)" }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 pr-11 rounded-xl text-sm outline-none transition-all duration-150"
                  style={{
                    background:"var(--surface-0)",
                    border:"1.5px solid var(--border-default)",
                    color:"var(--fg-default)",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary-400)"}
                  onBlur={(e)  => e.currentTarget.style.borderColor = "var(--border-default)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color:"var(--fg-subtle)" }}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background:"var(--danger-bg)", border:"1px solid var(--danger-border)", color:"var(--danger-text)" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className={cn(
                "w-full h-12 rounded-xl font-semibold text-sm text-white transition-all duration-200",
                "active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              )}
              style={{
                background:  "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
                boxShadow:   "var(--shadow-primary)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation:"spin 0.8s linear infinite" }}/>
                  Signing in…
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color:"var(--fg-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold" style={{ color:"var(--primary-600)" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
