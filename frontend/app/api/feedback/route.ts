import { NextRequest, NextResponse } from "next/server";
import { query, initDatabase } from "@/app/lib/db";
import { readJson, appendToArray } from "@/app/lib/storage";

export interface FeedbackEntry {
  id:             string;
  userId?:        string;
  name:           string;
  email:          string;
  walletAddress?: string;
  network?:       string;
  bugsReported?:  string;
  improvements?:  string;
  recommend:      "Yes" | "No" | "Maybe";
  overallRating:  number; // 1 to 5
  featureRating?: number;
  uxRating?:      number;
  contractRating?:number;
  comment?:       string;
  submittedAt:    string;
  userAgent?:     string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<FeedbackEntry>;
    const {
      name,
      email,
      walletAddress,
      network = "Stellar Testnet",
      bugsReported = "N/A",
      improvements = "",
      recommend = "Yes",
      overallRating = 5,
      featureRating,
      uxRating,
      contractRating,
      comment = "",
    } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    if (typeof overallRating !== "number" || overallRating < 1 || overallRating > 5) {
      return NextResponse.json({ error: "Satisfaction rating must be between 1 and 5" }, { status: 400 });
    }

    const validRecommend = ["Yes", "No", "Maybe"].includes(recommend) ? recommend : "Yes";
    const ratingNum = Math.min(5, Math.max(1, Math.round(overallRating)));

    const entry: FeedbackEntry = {
      id:             `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name:           name.trim(),
      email:          email.trim().toLowerCase(),
      walletAddress:  (walletAddress ?? "").trim(),
      network:        network.trim() || "Stellar Testnet",
      bugsReported:   bugsReported.trim() || "N/A",
      improvements:   improvements.trim(),
      recommend:      validRecommend as "Yes" | "No" | "Maybe",
      overallRating:  ratingNum,
      featureRating:  featureRating ?? ratingNum,
      uxRating:       uxRating ?? ratingNum,
      contractRating: contractRating ?? ratingNum,
      comment:        comment.trim() || improvements.trim() || (bugsReported !== "N/A" ? bugsReported : ""),
      submittedAt:    new Date().toISOString(),
      userAgent:      req.headers.get("user-agent") ?? undefined,
    };

    // 1. Insert into Neon PostgreSQL
    try {
      await initDatabase();
      await query(
        `INSERT INTO feedback (id, name, email, wallet_address, network, bugs_reported, improvements, recommend, overall_rating, feature_rating, ux_rating, contract_rating, comment, user_agent, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          entry.id,
          entry.name,
          entry.email,
          entry.walletAddress || "",
          entry.network,
          entry.bugsReported,
          entry.improvements,
          entry.recommend,
          entry.overallRating,
          entry.featureRating,
          entry.uxRating,
          entry.contractRating,
          entry.comment,
          entry.userAgent || "",
          entry.submittedAt,
        ]
      );
    } catch (dbErr) {
      console.error("Neon DB insert error in /api/feedback POST:", dbErr);
    }

    // 2. Fallback local JSON append
    try {
      await appendToArray<FeedbackEntry>("feedback.json", entry);
    } catch {
      // ignore local write errors
    }

    return NextResponse.json({ ok: true, id: entry.id, overallRating: entry.overallRating });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 1. Fetch from Neon PostgreSQL
    try {
      await initDatabase();
      const res = await query<FeedbackEntry>(
        `SELECT id, name, email, wallet_address AS "walletAddress", network, bugs_reported AS "bugsReported", improvements, recommend, overall_rating AS "overallRating", feature_rating AS "featureRating", ux_rating AS "uxRating", contract_rating AS "contractRating", comment, user_agent AS "userAgent", submitted_at AS "submittedAt"
         FROM feedback
         ORDER BY submitted_at DESC`
      );
      if (res.rows && res.rows.length > 0) {
        const feedback = res.rows.map((row) => ({
          ...row,
          overallRating: Math.round(Number(row.overallRating)),
          featureRating: Math.round(Number(row.featureRating || row.overallRating)),
          uxRating: Math.round(Number(row.uxRating || row.overallRating)),
          contractRating: Math.round(Number(row.contractRating || row.overallRating)),
        }));
        const avg = +(feedback.reduce((s, f) => s + f.overallRating, 0) / feedback.length).toFixed(1);
        return NextResponse.json({ feedback, count: feedback.length, avgRating: avg });
      }
    } catch (dbErr) {
      console.error("Neon DB query error in /api/feedback GET:", dbErr);
    }

    // 2. Fallback to storage read
    const feedback = await readJson<FeedbackEntry[]>("feedback.json", []);
    const avg = feedback.length
      ? +(feedback.reduce((s, f) => s + f.overallRating, 0) / feedback.length).toFixed(1)
      : 0;
    return NextResponse.json({ feedback, count: feedback.length, avgRating: avg });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
