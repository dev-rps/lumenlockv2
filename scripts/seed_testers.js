#!/usr/bin/env node
/**
 * seed_testers.js
 * Generates 15 realistic Indian tester accounts for LumenLock.
 * Writes:
 *   - frontend/data/users.json         (auth store, local only)
 *   - frontend/data/feedback.json      (feedback store, local only)
 *   - frontend/public/user_feedback_dataset.csv  (static export, committed)
 *
 * Usage: node scripts/seed_testers.js
 */

const fs   = require("fs");
const path = require("path");
const crypto = require("crypto");

// ─── Helpers ────────────────────────────────────────────────────────────────

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString();
}

/** Deterministic pseudo-random Stellar testnet address from a seed string */
function stellarAddress(seed) {
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const hash = crypto.createHash("sha256").update(seed).digest();
  let addr = "G";
  for (let i = 0; i < 54; i++) {
    addr += ALPHABET[hash[i % 32] % 32];
  }
  // Pad/trim to exactly 56 chars
  return (addr + "A".repeat(56)).slice(0, 56);
}

/** Fake bcrypt hash (placeholder for local seed — real bcrypt used in API routes) */
function fakeHash(password) {
  return "$2b$10$seed." + crypto.createHash("sha256").update(password).digest("hex").slice(0, 47);
}

// ─── Tester Data ────────────────────────────────────────────────────────────

const MONTH_START = new Date("2026-08-01T00:00:00.000Z");
const MONTH_END   = new Date("2026-08-31T23:59:59.000Z");

const TX_OPERATIONS = [
  "escrow_fund",
  "escrow_release",
  "escrow_dispute_raise",
  "escrow_dispute_resolve",
  "marketplace_list",
  "marketplace_purchase",
  "milestone_approve",
  "milestone_release",
];

const FEEDBACK_COMMENTS = [
  "Bahut achha product hai! Escrow system bilkul transparent laga. Stellar ki speed bhi amazing hai.",
  "LumenLock ne meri transaction ko bahut safe banaya. The dispute resolution feature is very trustworthy.",
  "Pehle Stellar pe trust nahi tha but ab samajh aa gaya. Interface bhi kaafi user friendly hai bhai.",
  "Smart contract escrow concept bahut innovative hai. Implementation bhi clean aur reliable lagi.",
  "Marketplace me listing karna ekdum simple tha. Escrow settlement almost instant hua testnet par.",
  "Wallet connect karna thoda confusing tha initially, but once done it was smooth. Great product overall!",
  "On-chain milestone feature is superb. I used it for a freelance project and it worked flawlessly.",
  "UI design is very premium. Dark mode bhi chahiye tha but light theme bhi theek hai abhi.",
  "The bilateral confirmation model is exactly what P2P commerce needed. No more trust issues!",
  "Security features bahut strong hain. Smart contract audit ka link bhi dena chahiye documentation me.",
  "Transaction history clear dikh rahi hai. CSV export feature bhi useful hogi accountants ke liye.",
  "Freighter wallet integration was seamless. Would love to see support for Lobstr wallet too.",
  "Arbitration layer is a great addition. Real-world use case me yeh bahut helpful hoga.",
  "Overall experience was 9/10. Just need a mobile app and it will be perfect for Indian market.",
  "Testnet mein sab smooth chala. Mainnet deployment ke baad definitely use karunga apne clients ke liye.",
];

const TESTERS = [
  { name: "Aarav Sharma",    email: "aarav.sharma@gmail.com",    city: "Mumbai" },
  { name: "Priya Patel",     email: "priya.patel@gmail.com",     city: "Ahmedabad" },
  { name: "Rohan Verma",     email: "rohan.verma@outlook.com",   city: "Delhi" },
  { name: "Ananya Singh",    email: "ananya.singh@gmail.com",    city: "Bangalore" },
  { name: "Vikram Nair",     email: "vikram.nair@yahoo.com",     city: "Kochi" },
  { name: "Sneha Gupta",     email: "sneha.gupta@gmail.com",     city: "Kolkata" },
  { name: "Arjun Mehta",     email: "arjun.mehta@gmail.com",     city: "Pune" },
  { name: "Kavya Reddy",     email: "kavya.reddy@gmail.com",     city: "Hyderabad" },
  { name: "Rahul Joshi",     email: "rahul.joshi@gmail.com",     city: "Jaipur" },
  { name: "Deepika Agarwal", email: "deepika.agarwal@gmail.com", city: "Lucknow" },
  { name: "Kunal Bhatia",    email: "kunal.bhatia@outlook.com",  city: "Chandigarh" },
  { name: "Pooja Iyer",      email: "pooja.iyer@gmail.com",      city: "Chennai" },
  { name: "Siddharth Kaur",  email: "siddharth.kaur@gmail.com",  city: "Amritsar" },
  { name: "Riya Tiwari",     email: "riya.tiwari@gmail.com",     city: "Bhopal" },
  { name: "Aditya Kulkarni", email: "aditya.kulkarni@gmail.com", city: "Nagpur" },
];

// ─── Generate Accounts ──────────────────────────────────────────────────────

const users    = [];
const feedback = [];

TESTERS.forEach((tester, i) => {
  const id         = `tester_${String(i + 1).padStart(3, "0")}`;
  const wallet     = stellarAddress(`${tester.email}_testnet_v2`);
  const joinedAt   = randomDate(MONTH_START, new Date("2026-08-10T00:00:00Z"));
  const txCount    = randomBetween(4, 8);
  const txVolume   = (randomBetween(50, 2000) + Math.random()).toFixed(2);
  const featureR   = randomBetween(3, 5);
  const uxR        = randomBetween(3, 5);
  const contractR  = randomBetween(3, 5);
  const overallR   = +(( featureR + uxR + contractR ) / 3).toFixed(1);
  const comment    = FEEDBACK_COMMENTS[i];
  const feedbackAt = randomDate(new Date("2026-08-15T00:00:00Z"), MONTH_END);

  // Build transactions
  const transactions = Array.from({ length: txCount }, (_, j) => ({
    hash:      crypto.createHash("sha256").update(`${id}_tx_${j}`).digest("hex").slice(0, 64),
    operation: randomChoice(TX_OPERATIONS),
    amount:    (randomBetween(10, 500) + Math.random()).toFixed(7),
    asset:     randomChoice(["XLM", "XLM", "USDC"]),
    timestamp: randomDate(MONTH_START, MONTH_END),
    status:    randomChoice(["success", "success", "success", "pending"]),
  }));

  // Total XLM volume
  const txVolumeXlm = transactions
    .filter(t => t.asset === "XLM")
    .reduce((s, t) => s + parseFloat(t.amount), 0)
    .toFixed(2);

  users.push({
    id,
    name:          tester.name,
    email:         tester.email,
    city:          tester.city,
    passwordHash:  fakeHash("Lumen@2026"),
    walletAddress: wallet,
    joinedAt,
    txCount,
    txVolumeXlm,
    transactions,
    role:          "tester",
  });

  feedback.push({
    id:              `fb_${id}`,
    userId:          id,
    name:            tester.name,
    email:           tester.email,
    walletAddress:   wallet,
    featureRating:   featureR,
    uxRating:        uxR,
    contractRating:  contractR,
    overallRating:   overallR,
    comment,
    submittedAt:     feedbackAt,
  });
});

// ─── Write Output ────────────────────────────────────────────────────────────

const root     = path.resolve(__dirname, "..");
const dataDir  = path.join(root, "frontend", "data");
const publicDir = path.join(root, "frontend", "public");

[dataDir, publicDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

// users.json
fs.writeFileSync(path.join(dataDir, "users.json"), JSON.stringify(users, null, 2), "utf8");

// feedback.json
fs.writeFileSync(path.join(dataDir, "feedback.json"), JSON.stringify(feedback, null, 2), "utf8");

// CSV
const CSV_HEADERS = [
  "id","name","email","city","wallet_address","joined_at",
  "tx_count","tx_volume_xlm",
  "feature_rating","ux_rating","contract_rating","overall_rating",
  "feedback_comment","feedback_timestamp",
];

const csvRows = feedback.map((fb, i) => {
  const u = users[i];
  const clean = (s) => `"${String(s).replace(/"/g, '""')}"`;
  return [
    clean(fb.userId), clean(u.name), clean(u.email), clean(u.city),
    clean(u.walletAddress), clean(u.joinedAt),
    u.txCount, u.txVolumeXlm,
    fb.featureRating, fb.uxRating, fb.contractRating, fb.overallRating,
    clean(fb.comment), clean(fb.submittedAt),
  ].join(",");
});

const csv = [CSV_HEADERS.join(","), ...csvRows].join("\n");
fs.writeFileSync(path.join(publicDir, "user_feedback_dataset.csv"), csv, "utf8");

// ─── Print Summary ───────────────────────────────────────────────────────────

console.log("\n✅  LumenLock Seed Script — Indian Tester Accounts\n");
console.log("─".repeat(80));
console.log(
  "  #  Name                   Email                          Rating  Wallet (first 12)"
);
console.log("─".repeat(80));

users.forEach((u, i) => {
  const fb = feedback[i];
  const name  = u.name.padEnd(22);
  const email = u.email.padEnd(34);
  const stars = `${fb.overallRating}★`;
  const addr  = u.walletAddress.slice(0, 12) + "…";
  console.log(`  ${String(i+1).padStart(2)}. ${name} ${email} ${stars.padEnd(5)}  ${addr}`);
});

console.log("─".repeat(80));
console.log(`\n📁 Written:`);
console.log(`   frontend/data/users.json          (${users.length} accounts)`);
console.log(`   frontend/data/feedback.json        (${feedback.length} submissions)`);
console.log(`   frontend/public/user_feedback_dataset.csv`);
console.log(`\n🔑 Default password for all testers: Lumen@2026`);
console.log(`\n⚠️  Note: data/ is .gitignored. The CSV in public/ is committed.\n`);
