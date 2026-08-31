import { NextResponse } from "next/server";
import { query, initDatabase } from "@/app/lib/db";
import { readJson } from "@/app/lib/storage";

export async function GET() {
  try {
    let rows: any[] = [];

    // 1. Fetch from Neon PostgreSQL ordered by submitted_at DESC (newest on top)
    try {
      await initDatabase();
      const res = await query(
        `SELECT id, name, email, wallet_address AS "walletAddress", network, bugs_reported AS "bugsReported", improvements, recommend, overall_rating AS "overallRating", feature_rating AS "featureRating", ux_rating AS "uxRating", contract_rating AS "contractRating", comment, submitted_at AS "submittedAt"
         FROM feedback
         ORDER BY submitted_at DESC;`
      );
      if (res.rows && res.rows.length > 0) {
        rows = res.rows;
      }
    } catch (dbErr) {
      console.error("Neon DB query error in /api/feedback/export:", dbErr);
    }

    // 2. Fallback to storage read if database query yields empty
    if (rows.length === 0) {
      const fallbackData = await readJson<any[]>("feedback.json", []);
      rows = fallbackData.sort(
        (a, b) => new Date(b.submittedAt || b.feedback_timestamp || 0).getTime() - new Date(a.submittedAt || a.feedback_timestamp || 0).getTime()
      );
    }

    // 3. Build CSV string
    const CSV_HEADERS = [
      "id",
      "name",
      "email",
      "wallet_address",
      "network",
      "bugs_reported",
      "improvements",
      "recommend",
      "overall_rating",
      "feature_rating",
      "ux_rating",
      "contract_rating",
      "comment",
      "submitted_at",
    ];

    const clean = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;

    const csvRows = rows.map((r) => {
      const id = r.id || r.userId || "";
      const name = r.name || "";
      const email = r.email || "";
      const wallet = r.walletAddress || r.wallet_address || "";
      const network = r.network || "Stellar Testnet";
      const bugs = r.bugsReported || r.bugs_reported || "N/A";
      const improvements = r.improvements || "";
      const recommend = r.recommend || "Yes";
      const overall = r.overallRating ?? r.overall_rating ?? 5;
      const feature = r.featureRating ?? r.feature_rating ?? overall;
      const ux = r.uxRating ?? r.ux_rating ?? overall;
      const contract = r.contractRating ?? r.contract_rating ?? overall;
      const comment = r.comment || r.feedback_comment || "";
      const submittedAt = r.submittedAt || r.submitted_at || r.feedback_timestamp || new Date().toISOString();

      return [
        clean(id),
        clean(name),
        clean(email),
        clean(wallet),
        clean(network),
        clean(bugs),
        clean(improvements),
        clean(recommend),
        overall,
        feature,
        ux,
        contract,
        clean(comment),
        clean(submittedAt),
      ].join(",");
    });

    const csvContent = [CSV_HEADERS.join(","), ...csvRows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="user_feedback_dataset.csv"',
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err) {
    console.error("CSV Export error:", err);
    return NextResponse.json({ error: "Failed to generate CSV export" }, { status: 500 });
  }
}
