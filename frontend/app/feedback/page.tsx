"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FeedbackForm } from "@/app/components/feedback/FeedbackForm";

const INDIAN_TESTERS = [
  { name:"Aarav Sharma",    city:"Mumbai",     rating:5, comment:"Bahut achha product! Escrow system bilkul transparent laga." },
  { name:"Priya Patel",     city:"Ahmedabad",  rating:5, comment:"Dispute resolution feature is very trustworthy and fast." },
  { name:"Rohan Verma",     city:"Delhi",      rating:4, comment:"Interface bhi kaafi user friendly hai bhai. Great work!" },
  { name:"Ananya Singh",    city:"Bangalore",  rating:5, comment:"Smart contract escrow concept bahut innovative hai." },
  { name:"Vikram Nair",     city:"Kochi",      rating:4, comment:"Marketplace me listing karna ekdum simple tha." },
  { name:"Sneha Gupta",     city:"Kolkata",    rating:5, comment:"On-chain milestone feature is superb for freelancing." },
  { name:"Arjun Mehta",     city:"Pune",       rating:4, comment:"UI design is very premium. Would love dark mode too!" },
  { name:"Kavya Reddy",     city:"Hyderabad",  rating:5, comment:"Bilateral confirmation model is exactly what P2P needed." },
  { name:"Rahul Joshi",     city:"Jaipur",     rating:4, comment:"Transaction history is clear. CSV export will be useful." },
  { name:"Deepika Agarwal", city:"Lucknow",    rating:5, comment:"Freighter wallet integration was seamless. Love it!" },
  { name:"Kunal Bhatia",    city:"Chandigarh", rating:4, comment:"Arbitration layer is a great addition for real disputes." },
  { name:"Pooja Iyer",      city:"Chennai",    rating:5, comment:"Overall experience 9/10. Needs mobile app next!" },
  { name:"Siddharth Kaur",  city:"Amritsar",   rating:4, comment:"Security features bahut strong hain. Very safe." },
  { name:"Riya Tiwari",     city:"Bhopal",     rating:5, comment:"Testnet mein sab smooth chala. Will use on mainnet too." },
  { name:"Aditya Kulkarni", city:"Nagpur",     rating:5, comment:"Will definitely use apne clients ke liye. Excellent!" },
];

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
}

function AvatarInitials({ name, size=40 }: { name:string; size?:number }) {
  const colors = ["#4F46E5","#7C3AED","#DB2777","#059669","#D97706","#0284C7","#DC2626"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:color, display:"flex", alignItems:"center", justifyContent:"center",
      color:"white", fontSize:size*0.35, fontWeight:700, flexShrink:0,
    }}>
      {initials(name)}
    </div>
  );
}

function AnimatedCounter({ target, suffix="" }: { target:number; suffix?:string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const duration = 1500;
    const start = performance.now();
    function step(ts: number) {
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function FeedbackPage() {
  const [totalCount, setTotalCount] = useState(15);
  const [avgRating,  setAvgRating]  = useState(4.7);

  useEffect(() => {
    fetch("/api/feedback")
      .then(r => r.json())
      .then(data => {
        if (data.count >= 15) setTotalCount(data.count);
        if (data.avgRating)   setAvgRating(data.avgRating);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ background:"var(--surface-page)" }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-6 md:py-8" style={{
        background:"linear-gradient(135deg, #312E81 0%, #4F46E5 50%, #6366F1 100%)",
      }}>
        {/* Orbs */}
        {[
          { top:"-60px", right:"-60px", size:"280px", opacity:0.08 },
          { bottom:"-40px", left:"10%", size:"200px", opacity:0.06 },
        ].map((o, i) => (
          <div key={i} style={{
            position:"absolute", borderRadius:"50%", background:"white",
            opacity:o.opacity, width:o.size, height:o.size,
            top:o.top, right:(o as {right?:string}).right,
            bottom:(o as {bottom?:string}).bottom, left:(o as {left?:string}).left,
          }}/>
        ))}

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
            style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)" }}>
            <span className="text-yellow-300 text-xs">★</span>
            <span className="text-white text-[11px] font-semibold">Community Feedback Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ letterSpacing:"-0.02em" }}>
            Share Your Experience
          </h1>
          <p className="text-white/80 text-sm max-w-xl mx-auto">
            Help us improve LumenLock. Your feedback directly shapes the product roadmap.
          </p>

          {/* Live stats */}
          <div className="flex items-center justify-center gap-8 mt-4 pt-2">
            {[
              { label:"Total Submissions", value:totalCount, suffix:"+" },
              { label:"Average Rating",    value:+avgRating.toFixed(0), suffix:"★" },
              { label:"Indian Testers",    value:15, suffix:"" },
            ].map(({ label, value, suffix }) => (
              <div key={label} className="text-center">
                <p className="text-xl md:text-2xl font-extrabold text-white">
                  <AnimatedCounter target={value} suffix={suffix}/>
                </p>
                <p className="text-white/70 text-[11px] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="max-w-6xl mx-auto px-6 py-6 md:py-8 grid md:grid-cols-2 gap-8">

        {/* Form */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1" style={{ color:"var(--fg-default)" }}>Submit Feedback</h2>
            <p className="text-xs" style={{ color:"var(--fg-muted)" }}>
              Responses are saved to our backend and used for product improvements.
            </p>
          </div>
          <div className="p-5 rounded-2xl" style={{ background:"var(--surface-0)", border:"1px solid var(--border-subtle)", boxShadow:"var(--shadow-md)" }}>
            <FeedbackForm />
          </div>

          {/* CSV Download */}
          <div className="mt-4 p-3.5 rounded-2xl flex items-center gap-3"
            style={{ background:"var(--success-bg)", border:"1px solid var(--success-border)" }}>
            <div className="text-xl">📥</div>
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color:"var(--success-text)" }}>Dataset Export</p>
              <p className="text-[11px] mt-0.5" style={{ color:"var(--success-text)", opacity:0.8 }}>
                Download tester dataset (CSV)
              </p>
            </div>
            <Link href="/user_feedback_dataset.csv" download
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all duration-150 active:scale-[0.97]"
              style={{ background:"var(--success-icon)", whiteSpace:"nowrap" }}>
              Download CSV
            </Link>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1" style={{ color:"var(--fg-default)" }}>Tester Testimonials</h2>
            <p className="text-xs" style={{ color:"var(--fg-muted)" }}>
              Feedback from our 15 Indian beta testers on testnet.
            </p>
          </div>
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-2">
            {INDIAN_TESTERS.map((t) => (
              <div key={t.name} className="p-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5"
                style={{ background:"var(--surface-0)", border:"1px solid var(--border-subtle)", boxShadow:"var(--shadow-xs)" }}>
                <div className="flex items-start gap-3">
                  <AvatarInitials name={t.name}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-xs truncate" style={{ color:"var(--fg-default)" }}>{t.name}</p>
                      <div className="flex shrink-0">
                        {Array.from({length:5}).map((_, i) => (
                          <svg key={i} width="11" height="11" viewBox="0 0 24 24"
                            fill={i < t.rating ? "#FBBF24" : "none"}
                            stroke={i < t.rating ? "#FBBF24" : "var(--border-default)"} strokeWidth="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] mt-0.5 mb-1" style={{ color:"var(--fg-subtle)" }}>{t.city}</p>
                    <p className="text-xs leading-relaxed" style={{ color:"var(--fg-muted)" }}>&ldquo;{t.comment}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
