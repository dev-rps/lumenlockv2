import { NextRequest, NextResponse } from "next/server";
import { readJson, appendToArray } from "@/app/lib/storage";

export interface FeedbackEntry {
  id:             string;
  name:           string;
  email:          string;
  featureRating:  number;
  uxRating:       number;
  contractRating: number;
  overallRating:  number;
  comment:        string;
  submittedAt:    string;
  userAgent?:     string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<FeedbackEntry>;
    const { name, email, featureRating, uxRating, contractRating, comment } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    const ratings = [featureRating, uxRating, contractRating];
    if (ratings.some(r => typeof r !== "number" || r < 1 || r > 5)) {
      return NextResponse.json({ error: "All ratings must be between 1 and 5" }, { status: 400 });
    }

    const overall = +((( featureRating! + uxRating! + contractRating! ) / 3).toFixed(1));

    const entry: FeedbackEntry = {
      id:             `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name:           name.trim(),
      email:          email.trim().toLowerCase(),
      featureRating:  featureRating!,
      uxRating:       uxRating!,
      contractRating: contractRating!,
      overallRating:  overall,
      comment:        (comment ?? "").trim(),
      submittedAt:    new Date().toISOString(),
      userAgent:      req.headers.get("user-agent") ?? undefined,
    };

    await appendToArray<FeedbackEntry>("feedback.json", entry);

    return NextResponse.json({ ok: true, id: entry.id, overallRating: overall });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feedback = await readJson<FeedbackEntry[]>("feedback.json", []);
    const avg = feedback.length
      ? +(feedback.reduce((s, f) => s + f.overallRating, 0) / feedback.length).toFixed(1)
      : 0;
    return NextResponse.json({ feedback, count: feedback.length, avgRating: avg });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
