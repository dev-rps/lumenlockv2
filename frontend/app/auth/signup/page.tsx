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

function PasswordStrength({ password }: { password: string }) {
  const hasLength  = password.length >= 8;
  const hasUpper   = /[A-Z]/.test(password);
  const hasLower   = /[a-z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score      = [hasLength, hasUpper, hasLower, hasSpecial].filter(Boolean).length;

  const colors = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? colors[score] : "var(--surface-2)",
            }}
          />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: colors[score] }}>
        {labels[score]}
      </p>
    </div>
  );
}

const FEATURES = [
  "Trustless escrow settlement",
  "Milestone-based payments",
  "On-chain dispute arbitration",
  "Stellar Soroban smart contracts",
];

export default function SignupPage() {
  const router  = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [pw,      setPw]      = useState("");
  const [pwConf,  setPwConf]  = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw !== pwConf) { setError("Passwords do not match"); return; }
    if (pw.length < 6)  { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password: pw }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Signup failed"); setLoading(false); return; }
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
        style={{ background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 45%, #4F46E5 100%)" }}
      >
        {/* Animated orbs */}
        {[
          { top:"-100px", left:"-100px", size:"350px", delay:"0s",  dur:"9s" },
          { top:"40%",    right:"-70px", size:"200px", delay:"3s",  dur:"7s" },
          { bottom:"-80px", left:"30%", size:"260px",  delay:"1.5s", dur:"11s" },
        ].map((orb, i) => (
          <div key={i} style={{
            position:"absolute", borderRadius:"50%",
            background:"rgba(255,255,255,0.06)",
            width:orb.size, height:orb.size,
            top:orb.top, left:orb.left, right:(orb as {right?:string}).right, bottom:(orb as {bottom?:string}).bottom,
            animation:`orb-float ${orb.dur} ease-in-out infinite ${orb.delay}`,
          }}/>
        ))}

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
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

          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Join 15 Indian testers<br/>building the future
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Create your free account and start exploring trustless P2P commerce on the Stellar testnet.
          </p>

          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7"/>
                  </svg>
                </div>
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/30 text-xs">© 2026 LumenLock · Stellar Testnet</p>

        <style>{`
          @keyframes orb-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50%       { transform: translateY(-18px) scale(1.04); }
          }
        `}</style>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
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
            Create account 🚀
          </h1>
          <p className="text-sm mb-8" style={{ color:"var(--fg-muted)" }}>
            Join the LumenLock testnet community
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label:"Full Name", id:"su-name", type:"text",  value:name,  setter:setName,  placeholder:"Aarav Sharma" },
              { label:"Email",     id:"su-email", type:"email", value:email, setter:setEmail, placeholder:"aarav.sharma@gmail.com" },
            ].map(({ label, id, type, value, setter, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <label className="text-sm font-semibold" style={{ color:"var(--fg-default)" }}>{label}</label>
                <input
                  id={id}
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-150"
                  style={{ background:"var(--surface-0)", border:"1.5px solid var(--border-default)", color:"var(--fg-default)" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary-400)"}
                  onBlur={(e)  => e.currentTarget.style.borderColor = "var(--border-default)"}
                />
              </div>
            ))}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" style={{ color:"var(--fg-default)" }}>Password</label>
              <div className="relative">
                <input
                  id="su-password"
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 pr-11 rounded-xl text-sm outline-none transition-all duration-150"
                  style={{ background:"var(--surface-0)", border:"1.5px solid var(--border-default)", color:"var(--fg-default)" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary-400)"}
                  onBlur={(e)  => e.currentTarget.style.borderColor = "var(--border-default)"}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:"var(--fg-subtle)" }}>
                  <EyeIcon open={showPw}/>
                </button>
              </div>
              <PasswordStrength password={pw}/>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" style={{ color:"var(--fg-default)" }}>Confirm Password</label>
              <input
                id="su-confirm"
                type="password"
                value={pwConf}
                onChange={(e) => setPwConf(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-150"
                style={{
                  background:"var(--surface-0)",
                  border:`1.5px solid ${pwConf && pw !== pwConf ? "var(--danger-icon)" : "var(--border-default)"}`,
                  color:"var(--fg-default)",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary-400)"}
                onBlur={(e) => e.currentTarget.style.borderColor = pwConf && pw !== pwConf ? "var(--danger-icon)" : "var(--border-default)"}
              />
              {pwConf && pw !== pwConf && (
                <p className="text-xs" style={{ color:"var(--danger-text)" }}>Passwords don&apos;t match</p>
              )}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background:"var(--danger-bg)", border:"1px solid var(--danger-border)", color:"var(--danger-text)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              id="signup-submit"
              disabled={loading || (!!pwConf && pw !== pwConf)}
              className={cn(
                "w-full h-12 rounded-xl font-semibold text-sm text-white transition-all duration-200",
                "active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              )}
              style={{
                background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
                boxShadow:  "var(--shadow-primary)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation:"spin 0.8s linear infinite" }}/>
                  Creating account…
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color:"var(--fg-muted)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold" style={{ color:"var(--primary-600)" }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
