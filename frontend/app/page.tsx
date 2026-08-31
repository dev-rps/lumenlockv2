"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Utility hooks ───────────────────────────────────────────────────────────

function useInView(threshold = 0.2) {
  const ref  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(target: number, started: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const start = performance.now();
    function step(ts: number) {
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);
  return count;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TESTERS = [
  { name:"Aarav Sharma",    city:"Mumbai",     rating:5, initials:"AS", comment:"Escrow system bilkul transparent laga. Stellar ki speed amazing hai!" },
  { name:"Priya Patel",     city:"Ahmedabad",  rating:5, initials:"PP", comment:"Dispute resolution feature is very trustworthy and works fast." },
  { name:"Rohan Verma",     city:"Delhi",      rating:4, initials:"RV", comment:"Interface kaafi user friendly hai. Pehli baar blockchain use kiya!" },
  { name:"Ananya Singh",    city:"Bangalore",  rating:5, initials:"AS", comment:"Smart contract escrow concept bahut innovative. Implementation clean hai." },
  { name:"Vikram Nair",     city:"Kochi",      rating:4, initials:"VN", comment:"Marketplace me listing karna ekdum simple tha. Escrow instant hua." },
  { name:"Sneha Gupta",     city:"Kolkata",    rating:5, initials:"SG", comment:"On-chain milestone feature is superb for freelance work!" },
  { name:"Arjun Mehta",     city:"Pune",       rating:4, initials:"AM", comment:"UI design is very premium. Would love dark mode too eventually." },
  { name:"Kavya Reddy",     city:"Hyderabad",  rating:5, initials:"KR", comment:"Bilateral confirmation model is exactly what P2P commerce needed!" },
  { name:"Rahul Joshi",     city:"Jaipur",     rating:4, initials:"RJ", comment:"Transaction history clear dikh rahi hai. CSV export bhi useful hogi." },
  { name:"Deepika Agarwal", city:"Lucknow",    rating:5, initials:"DA", comment:"Freighter wallet integration was seamless. Very impressed!" },
  { name:"Kunal Bhatia",    city:"Chandigarh", rating:4, initials:"KB", comment:"Arbitration layer is a great addition for real-world use cases." },
  { name:"Pooja Iyer",      city:"Chennai",    rating:5, initials:"PI", comment:"Overall 9/10! Just need a mobile app and it will be perfect." },
  { name:"Siddharth Kaur",  city:"Amritsar",   rating:4, initials:"SK", comment:"Security features bahut strong hain. Smart contract audit link add karo." },
  { name:"Riya Tiwari",     city:"Bhopal",     rating:5, initials:"RT", comment:"Testnet mein sab smooth chala. Mainnet ke baad definitely use karunga." },
  { name:"Aditya Kulkarni", city:"Nagpur",     rating:5, initials:"AK", comment:"Will use for my clients ke liye. Excellent escrow protocol!" },
];

const AVATAR_COLORS: Record<string, string> = {
  A:"#4F46E5", B:"#7C3AED", C:"#DB2777", D:"#059669", E:"#D97706",
  F:"#0284C7", G:"#DC2626", H:"#7C3AED", I:"#4F46E5", J:"#059669",
  K:"#DB2777", L:"#D97706", M:"#0284C7", N:"#4F46E5", O:"#7C3AED",
  P:"#DB2777", Q:"#059669", R:"#D97706", S:"#4F46E5", T:"#0284C7",
  U:"#7C3AED", V:"#DC2626", W:"#4F46E5", X:"#059669", Y:"#D97706", Z:"#DB2777",
};

const HOW_IT_WORKS = [
  {
    step:1, icon:"📦",
    title:"Create a Listing",
    desc:"Sellers post services or digital goods on the decentralized marketplace registry.",
  },
  {
    step:2, icon:"🔒",
    title:"Funds Locked in Escrow",
    desc:"Buyers send funds to the Soroban smart contract. No one can access them unilaterally.",
  },
  {
    step:3, icon:"✅",
    title:"Bilateral Release",
    desc:"Both parties confirm delivery. Funds release instantly. Disputes go to arbitration.",
  },
];

const STATS = [
  { label:"Beta Testers",       value:15,  suffix:"",   icon:"👥" },
  { label:"Testnet Transactions",value:75, suffix:"+",  icon:"⚡" },
  { label:"Avg Tester Rating",  value:47,  suffix:"",   icon:"★",  display:(v:number) => (v/10).toFixed(1) },
  { label:"Avg Settlement Time", value:3,  suffix:"s",  icon:"🚀" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function TesterCard({ t, delay=0 }: { t:typeof TESTERS[0]; delay?:number }) {
  const { ref, visible } = useInView(0.1);
  return (
    <div ref={ref} style={{
      opacity:   visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
      transition:`opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      background:"var(--surface-0)",
      border:"1px solid var(--border-subtle)",
      borderRadius:20,
      padding:"16px",
      boxShadow:"var(--shadow-sm)",
      flexShrink:0,
      width:260,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <div style={{
          width:36, height:36, borderRadius:"50%",
          background:AVATAR_COLORS[t.initials[0]] || "#4F46E5",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"white", fontSize:13, fontWeight:700,
        }}>{t.initials}</div>
        <div>
          <p style={{ fontWeight:600, fontSize:13, color:"var(--fg-default)", lineHeight:1.2 }}>{t.name}</p>
          <p style={{ fontSize:11, color:"var(--fg-subtle)" }}>{t.city}</p>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:1 }}>
          {[1,2,3,4,5].map(i=>(
            <svg key={i} width="10" height="10" viewBox="0 0 24 24"
              fill={i<=t.rating?"#FBBF24":"none"} stroke={i<=t.rating?"#FBBF24":"#D1D5DB"} strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
        </div>
      </div>
      <p style={{ fontSize:12, color:"var(--fg-muted)", lineHeight:1.6 }}>&ldquo;{t.comment}&rdquo;</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [heroMounted, setHeroMounted] = useState(false);
  const statsSection = useInView(0.3);
  const howSection   = useInView(0.2);
  const ctaSection   = useInView(0.3);

  // Carousel auto-scroll
  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let paused = false;
    el.addEventListener("mouseenter", () => paused = true);
    el.addEventListener("mouseleave", () => paused = false);
    const id = setInterval(() => {
      if (!paused) el.scrollLeft += 1;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0;
    }, 20);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const stat0 = useCountUp(STATS[0].value, statsSection.visible);
  const stat1 = useCountUp(STATS[1].value, statsSection.visible);
  const stat2 = useCountUp(STATS[2].value, statsSection.visible);
  const stat3 = useCountUp(STATS[3].value, statsSection.visible);
  const statValues = [stat0, stat1, stat2, stat3];

  return (
    <div style={{ background:"var(--surface-page)", overflowX:"hidden" }}>

      {/* ═════════════════════════ HERO ═════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight:"92vh",
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"center",
          padding:"80px 24px 60px",
        }}
      >
        {/* Animated gradient background */}
        <div style={{
          position:"absolute", inset:0, zIndex:0,
          background:"var(--surface-page)",
          backgroundImage:`
            radial-gradient(ellipse 90% 60% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 50%, rgba(79,70,229,0.06) 0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 20% 70%, rgba(124,58,237,0.05) 0%, transparent 50%)
          `,
          animation:"bg-shift 8s ease-in-out infinite alternate",
        }}/>

        {/* Floating orbs */}
        {[
          { size:240, x:"10%",  y:"20%",  delay:"0s",  dur:"7s",  opacity:0.04 },
          { size:160, x:"85%",  y:"15%",  delay:"2s",  dur:"9s",  opacity:0.05 },
          { size:200, x:"75%",  y:"65%",  delay:"1s",  dur:"11s", opacity:0.03 },
          { size:120, x:"5%",   y:"70%",  delay:"3s",  dur:"8s",  opacity:0.04 },
        ].map((orb, i) => (
          <div key={i} style={{
            position:"absolute",
            width:orb.size, height:orb.size, borderRadius:"50%",
            background:"var(--primary-600)",
            left:orb.x, top:orb.y, opacity:orb.opacity,
            filter:"blur(40px)",
            animation:`orb-float ${orb.dur} ease-in-out infinite ${orb.delay}`,
            zIndex:0,
          }}/>
        ))}

        <div className="relative z-10 text-center max-w-4xl mx-auto">

          {/* Live badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"6px 16px", borderRadius:999, marginBottom:28,
            background:"var(--primary-50)",
            border:"1px solid var(--primary-200)",
            opacity: heroMounted ? 1 : 0,
            transform: heroMounted ? "translateY(0)" : "translateY(-8px)",
            transition:"opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
          }}>
            <span style={{
              width:8, height:8, borderRadius:"50%", background:"var(--success-icon)",
              boxShadow:"0 0 0 3px rgba(22,163,74,0.2)",
              animation:"pulse 2s infinite",
              display:"inline-block",
            }}/>
            <span style={{ fontSize:12, fontWeight:700, color:"var(--primary-700)" }}>
              Live on Stellar Testnet · 15 Indian Testers Active
            </span>
          </div>

          {/* Headline — word-by-word stagger */}
          <h1 style={{
            fontSize:"clamp(2.5rem, 5vw, 4.5rem)",
            fontWeight:800,
            color:"var(--fg-default)",
            lineHeight:1.08,
            letterSpacing:"-0.03em",
            marginBottom:20,
          }}>
            {["Trustless", "P2P Commerce", "with", "Smart Escrow"].map((word, i) => (
              <span
                key={word}
                style={{
                  display: i === 2 ? "inline" : "inline-block",
                  marginRight:12,
                  opacity:    heroMounted ? 1 : 0,
                  transform:  heroMounted ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${0.2 + i * 0.12}s, transform 0.6s ease ${0.2 + i * 0.12}s`,
                  background: (i === 3)
                    ? "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 100%)"
                    : undefined,
                  WebkitBackgroundClip: (i === 3) ? "text" : undefined,
                  WebkitTextFillColor: (i === 3) ? "transparent" : undefined,
                  backgroundClip: (i === 3) ? "text" : undefined,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize:"clamp(1rem, 2vw, 1.2rem)",
            color:"var(--fg-muted)",
            maxWidth:600,
            margin:"0 auto 36px",
            lineHeight:1.7,
            opacity:    heroMounted ? 1 : 0,
            transform:  heroMounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s",
          }}>
            Buy and sell services, code, and digital products without mutual trust.
            Funds remain locked in Soroban smart contract escrow until both parties confirm.
          </p>

          {/* CTAs */}
          <div style={{
            display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap",
            opacity:    heroMounted ? 1 : 0,
            transform:  heroMounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s",
          }}>
            <Link
              href="/marketplace"
              style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"14px 28px", borderRadius:14, fontWeight:700, fontSize:15,
                color:"white", textDecoration:"none",
                background:"linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
                boxShadow:"var(--shadow-primary), 0 8px 24px rgba(79,70,229,0.2)",
                transition:"transform 0.2s var(--ease-spring), box-shadow 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="var(--shadow-primary),0 12px 32px rgba(79,70,229,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="var(--shadow-primary),0 8px 24px rgba(79,70,229,0.2)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Explore Marketplace
            </Link>
            <Link
              href="/auth/signup"
              style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"14px 28px", borderRadius:14, fontWeight:700, fontSize:15,
                color:"var(--fg-default)", textDecoration:"none",
                background:"var(--surface-0)",
                border:"1.5px solid var(--border-default)",
                boxShadow:"var(--shadow-sm)",
                transition:"transform 0.2s var(--ease-spring), border-color 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor="var(--primary-300)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.borderColor="var(--border-default)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Join as Tester
            </Link>
          </div>

          {/* Tester ticker */}
          <div style={{
            marginTop:44,
            opacity:    heroMounted ? 1 : 0,
            transition: "opacity 0.6s ease 1.1s",
          }}>
            <p style={{ fontSize:11, color:"var(--fg-subtle)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>
              Trusted by Indian developers
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
              {TESTERS.slice(0,8).map((t) => (
                <div key={t.name} style={{
                  display:"flex", alignItems:"center", gap:6,
                  padding:"4px 10px", borderRadius:999,
                  background:"var(--surface-0)", border:"1px solid var(--border-subtle)",
                  boxShadow:"var(--shadow-xs)",
                }}>
                  <div style={{
                    width:20, height:20, borderRadius:"50%",
                    background:AVATAR_COLORS[t.initials[0]] || "#4F46E5",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"white", fontSize:9, fontWeight:700,
                  }}>{t.initials}</div>
                  <span style={{ fontSize:11, color:"var(--fg-muted)", fontWeight:500 }}>{t.name.split(" ")[0]}</span>
                  <span style={{ fontSize:10, color:"#FBBF24" }}>{"★".repeat(t.rating)}</span>
                </div>
              ))}
              <div style={{
                display:"flex", alignItems:"center",
                padding:"4px 10px", borderRadius:999,
                background:"var(--primary-50)", border:"1px solid var(--primary-200)",
                fontSize:11, color:"var(--primary-700)", fontWeight:600,
              }}>+7 more</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════ STATS ═════════════════════════════════════ */}
      <section ref={statsSection.ref} className="py-16 px-6"
        style={{ background:"var(--surface-0)", borderTop:"1px solid var(--border-subtle)", borderBottom:"1px solid var(--border-subtle)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => {
            const displayVal = s.display ? s.display(statValues[i]) : String(statValues[i]);
            return (
              <div key={s.label} style={{
                textAlign:"center",
                opacity:    statsSection.visible ? 1 : 0,
                transform:  statsSection.visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i*0.1}s, transform 0.5s ease ${i*0.1}s`,
              }}>
                <div style={{ fontSize:32, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:"2.5rem", fontWeight:800, color:"var(--fg-default)", lineHeight:1 }}>
                  {displayVal}{s.suffix}
                </div>
                <div style={{ fontSize:13, color:"var(--fg-muted)", marginTop:6 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═════════════════ HOW IT WORKS ═════════════════════════════ */}
      <section ref={howSection.ref} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color:"var(--fg-default)" }}>
              How LumenLock Works
            </h2>
            <p style={{ color:"var(--fg-muted)", maxWidth:500, margin:"0 auto" }}>
              Three simple steps to trustless peer-to-peer commerce on Stellar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5"
              style={{ background:"linear-gradient(90deg, transparent, var(--primary-200), transparent)" }}/>

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{
                textAlign:"center",
                opacity:    howSection.visible ? 1 : 0,
                transform:  howSection.visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i*0.2}s, transform 0.6s ease ${i*0.2}s`,
              }}>
                <div style={{
                  width:64, height:64, borderRadius:20, margin:"0 auto 16px",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:28,
                  background:"var(--primary-50)", border:"2px solid var(--primary-100)",
                  position:"relative",
                }}>
                  {step.icon}
                  <div style={{
                    position:"absolute", top:-8, right:-8,
                    width:22, height:22, borderRadius:"50%",
                    background:"var(--primary-600)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"white", fontSize:11, fontWeight:700,
                  }}>{step.step}</div>
                </div>
                <h3 className="font-bold mb-2" style={{ color:"var(--fg-default)", fontSize:18 }}>{step.title}</h3>
                <p style={{ color:"var(--fg-muted)", fontSize:14, lineHeight:1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════ TESTIMONIAL CAROUSEL ═════════════════════ */}
      <section className="py-16" style={{ background:"var(--surface-1)", borderTop:"1px solid var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2" style={{ color:"var(--fg-default)" }}>
            What Indian Testers Say
          </h2>
          <p style={{ color:"var(--fg-muted)" }}>Real feedback from our 15 Indian beta testers on Stellar testnet</p>
        </div>

        <div
          ref={carouselRef}
          style={{
            display:"flex", gap:16,
            overflowX:"auto", paddingLeft:32, paddingRight:32, paddingBottom:8,
            scrollbarWidth:"none", cursor:"grab",
          }}
        >
          {[...TESTERS, ...TESTERS].map((t, i) => (
            <TesterCard key={`${t.name}_${i}`} t={t} delay={(i % 15) * 60}/>
          ))}
        </div>
        <style>{`::-webkit-scrollbar { display:none; }`}</style>
      </section>

      {/* ═════════════════ CTA ══════════════════════════════════════ */}
      <section ref={ctaSection.ref} className="py-20 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background:"linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)",
            opacity:    ctaSection.visible ? 1 : 0,
            transform:  ctaSection.visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* Shimmer overlay */}
          <div style={{
            position:"absolute", inset:0, borderRadius:"inherit",
            background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
            backgroundSize:"200% 100%",
            animation:"shimmer-cta 3s ease-in-out infinite",
          }}/>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to build trust?</h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              Join LumenLock and experience the future of trustless P2P commerce on Stellar.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <Link href="/auth/signup" style={{
                padding:"14px 32px", borderRadius:14, fontWeight:700, fontSize:15,
                color:"var(--primary-700)", textDecoration:"none",
                background:"white", boxShadow:"var(--shadow-md)",
                transition:"transform 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.transform="scale(1.03)"}
              onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
              >
                Get Started Free →
              </Link>
              <Link href="/feedback" style={{
                padding:"14px 32px", borderRadius:14, fontWeight:700, fontSize:15,
                color:"white", textDecoration:"none",
                background:"rgba(255,255,255,0.15)", border:"1.5px solid rgba(255,255,255,0.3)",
                backdropFilter:"blur(8px)",
                transition:"transform 0.2s ease, background 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.background="rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.background="rgba(255,255,255,0.15)"; }}
              >
                ★ Give Feedback
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global keyframes */}
      <style>{`
        @keyframes orb-float {
          0%,100% { transform:translateY(0) scale(1); }
          50%      { transform:translateY(-24px) scale(1.06); }
        }
        @keyframes bg-shift {
          from { background-position:0% 50%; }
          to   { background-position:100% 50%; }
        }
        @keyframes pulse {
          0%,100% { box-shadow:0 0 0 3px rgba(22,163,74,0.2); }
          50%      { box-shadow:0 0 0 6px rgba(22,163,74,0.1); }
        }
        @keyframes shimmer-cta {
          0%   { background-position:-200% 0; }
          100% { background-position:200% 0; }
        }
      `}</style>
    </div>
  );
}
