"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/app/lib/utils";
import { useAuthStore } from "@/app/state/authStore";

interface StarRatingProps {
  label:    string;
  value:    number;
  onChange: (v: number) => void;
}

function StarRating({ label, value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color:"var(--fg-default)" }}>{label}</span>
        <span className="text-xs font-mono px-2 py-0.5 rounded-md"
          style={{ background:"var(--primary-50)", color:"var(--primary-600)" }}>
          {value ? `${value}/5` : "—"}
        </span>
      </div>
      <div className="flex gap-1.5">
        {[1,2,3,4,5].map((star) => {
          const filled = star <= (hover || value);
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-all duration-150 focus:outline-none"
              style={{
                transform: filled ? "scale(1.15)" : "scale(1)",
                filter:    filled ? "drop-shadow(0 0 6px rgba(79,70,229,0.4))" : "none",
              }}
              aria-label={`${star} star`}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "var(--primary-500)" : "none"}
                stroke={filled ? "var(--primary-500)" : "var(--border-strong)"} strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface FeedbackFormProps {
  onSuccess?: () => void;
  compact?:   boolean;
}

export function FeedbackForm({ onSuccess, compact = false }: FeedbackFormProps) {
  const user = useAuthStore((s) => s.user);

  const [name,    setName]    = useState(user?.name  ?? "");
  const [email,   setEmail]   = useState(user?.email ?? "");
  const [fR,      setFR]      = useState(0);
  const [uxR,     setUxR]     = useState(0);
  const [ctR,     setCtR]     = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fR || !uxR || !ctR) { setError("Please rate all three categories"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method:  "POST",
        headers: { "Content-Type":"application/json" },
        body:    JSON.stringify({
          name, email,
          featureRating: fR, uxRating: uxR, contractRating: ctR, comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Submission failed"); setLoading(false); return; }
      setSuccess(true);
      onSuccess?.();
    } catch {
      setError("Network error — please try again");
    }
    setLoading(false);
  }, [name, email, fR, uxR, ctR, comment, onSuccess]);

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
          style={{ background:"var(--success-bg)", border:"2px solid var(--success-border)" }}
        >
          ✅
        </div>
        <div>
          <p className="font-bold text-lg" style={{ color:"var(--fg-default)" }}>Thank you!</p>
          <p className="text-sm mt-1" style={{ color:"var(--fg-muted)" }}>Your feedback has been saved.</p>
        </div>
        <button
          onClick={() => { setSuccess(false); setFR(0); setUxR(0); setCtR(0); setComment(""); }}
          className="text-sm font-semibold" style={{ color:"var(--primary-600)" }}
        >
          Submit another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", compact ? "" : "max-w-lg mx-auto")}>
      {/* Name + Email */}
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "grid-cols-2")}>
        {[
          { label:"Your Name", id:"fb-name",  type:"text",  value:name,  setter:setName,  placeholder:"Aarav Sharma" },
          { label:"Email",     id:"fb-email", type:"email", value:email, setter:setEmail, placeholder:"aarav@gmail.com" },
        ].map(({ label, id, type, value, setter, placeholder }) => (
          <div key={id} className="space-y-1.5">
            <label htmlFor={id} className="text-sm font-semibold" style={{ color:"var(--fg-default)" }}>{label}</label>
            <input
              id={id} type={type} value={value} placeholder={placeholder} required
              onChange={(e) => setter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl text-sm outline-none transition-all duration-150"
              style={{ background:"var(--surface-0)", border:"1.5px solid var(--border-default)", color:"var(--fg-default)" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary-400)"}
              onBlur={(e)  => e.currentTarget.style.borderColor = "var(--border-default)"}
            />
          </div>
        ))}
      </div>

      {/* Star Ratings */}
      <div className="space-y-4 p-4 rounded-2xl" style={{ background:"var(--surface-1)", border:"1px solid var(--border-subtle)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--fg-subtle)" }}>Rate LumenLock</p>
        <StarRating label="Feature Completeness" value={fR}  onChange={setFR}/>
        <StarRating label="UX & Interface"        value={uxR} onChange={setUxR}/>
        <StarRating label="Smart Contract Trust"  value={ctR} onChange={setCtR}/>
      </div>

      {/* Comment */}
      <div className="space-y-1.5">
        <label htmlFor="fb-comment" className="text-sm font-semibold" style={{ color:"var(--fg-default)" }}>
          Comments <span style={{ color:"var(--fg-subtle)", fontWeight:400 }}>(optional)</span>
        </label>
        <textarea
          id="fb-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={compact ? 3 : 4}
          placeholder="Share your experience with LumenLock…"
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-150 resize-none"
          style={{ background:"var(--surface-0)", border:"1.5px solid var(--border-default)", color:"var(--fg-default)" }}
          onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary-400)"}
          onBlur={(e)  => e.currentTarget.style.borderColor = "var(--border-default)"}
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background:"var(--danger-bg)", border:"1px solid var(--danger-border)", color:"var(--danger-text)" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        id="feedback-submit"
        disabled={loading}
        className="w-full h-12 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
          boxShadow:  "var(--shadow-primary)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation:"spin 0.8s linear infinite" }}/>
            Submitting…
          </span>
        ) : "Submit Feedback ✨"}
      </button>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </form>
  );
}
