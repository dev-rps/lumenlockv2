"use client";

import React, { useState } from "react";
import { FeedbackModal } from "./FeedbackModal";

export function FeedbackFAB() {
  const [open,    setOpen]    = useState(false);
  const [pulsed,  setPulsed]  = useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setPulsed(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <button
        id="feedback-fab"
        onClick={() => setOpen(true)}
        title="Give Feedback"
        className="fixed bottom-24 right-5 md:bottom-8 md:right-6 z-50"
        style={{
          width:"52px", height:"52px",
          borderRadius:"16px",
          background:"linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
          boxShadow:"var(--shadow-primary), 0 8px 24px rgba(79,70,229,0.25)",
          border:"none",
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          color:"white",
          transition:"transform 0.2s var(--ease-spring), box-shadow 0.2s ease",
          animation: pulsed ? "none" : "fab-pulse 2s ease-in-out 2",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1) rotate(-5deg)";
          e.currentTarget.style.boxShadow = "var(--shadow-primary), 0 12px 30px rgba(79,70,229,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "var(--shadow-primary), 0 8px 24px rgba(79,70,229,0.25)";
        }}
      >
        {/* Star icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </button>

      <FeedbackModal isOpen={open} onClose={() => setOpen(false)} />

      <style>{`
        @keyframes fab-pulse {
          0%,100% { transform:scale(1); box-shadow:var(--shadow-primary),0 8px 24px rgba(79,70,229,0.25); }
          50%      { transform:scale(1.12); box-shadow:var(--shadow-primary),0 12px 36px rgba(79,70,229,0.4); }
        }
      `}</style>
    </>
  );
}
