import { NextResponse } from "next/server";
import { query, initDatabase } from "@/app/lib/db";

/**
 * Map a raw Postgres row to the EscrowRecord shape the frontend expects.
 */
function rowToEscrow(row: any) {
  return {
    escrowId: row.escrow_id,
    listingId: row.listing_id,
    buyer: row.buyer,
    seller: row.seller,
    asset: row.asset,
    assetSymbol: row.asset_symbol,
    amount: row.amount,
    rawAmount: row.raw_amount?.toString() ?? "0",
    state: row.state,
    buyerConfirmed: Boolean(row.buyer_confirmed),
    sellerConfirmed: Boolean(row.seller_confirmed),
    deadline: Number(row.deadline),
    createdAt: Number(row.created_at),
    milestonePercentages: row.milestone_percentages ?? null,
    currentMilestoneIndex: Number(row.current_milestone_index ?? 0),
    releasedAmount: row.released_amount ?? "0",
    rawReleasedAmount: row.raw_released_amount?.toString() ?? "0",
    isMilestone: Boolean(row.is_milestone),
  };
}

export async function GET(req: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const escrowId = searchParams.get("escrowId");

    if (escrowId) {
      const { rows } = await query(
        "SELECT * FROM escrows WHERE escrow_id = $1",
        [escrowId]
      );
      return NextResponse.json(rows[0] ? rowToEscrow(rows[0]) : null);
    }

    if (address) {
      const { rows: allRows } = await query(
        "SELECT * FROM escrows ORDER BY created_at DESC"
      );
      const all = allRows.map(rowToEscrow);
      const buyerEscrows = all.filter((e) => e.buyer === address);
      const sellerEscrows = all.filter((e) => e.seller === address);
      const disputedEscrows = all.filter((e) => e.state === "Disputed");

      return NextResponse.json({
        // If user has no buyer escrows, show all so demo accounts always see data
        buyerEscrows: buyerEscrows.length > 0 ? buyerEscrows : all,
        sellerEscrows,
        disputedEscrows,
      });
    }

    const { rows } = await query("SELECT * FROM escrows ORDER BY created_at DESC");
    return NextResponse.json(rows.map(rowToEscrow));
  } catch (error) {
    console.error("GET /api/escrows error:", error);
    return NextResponse.json({ error: "Failed to fetch escrows" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDatabase();
    const body = await req.json();

    // Handle escrow state update (PUT-style via POST with action:"update")
    if (body.action === "update" && body.escrow) {
      const e = body.escrow;
      const { rows } = await query(
        `UPDATE escrows SET
           state = $1,
           buyer_confirmed = $2,
           seller_confirmed = $3,
           released_amount = $4,
           raw_released_amount = $5,
           current_milestone_index = $6
         WHERE escrow_id = $7
         RETURNING *`,
        [
          e.state,
          e.buyerConfirmed ?? false,
          e.sellerConfirmed ?? false,
          e.releasedAmount ?? "0",
          e.rawReleasedAmount?.toString() ?? "0",
          e.currentMilestoneIndex ?? 0,
          e.escrowId,
        ]
      );
      if (rows.length === 0) {
        // Escrow not found — insert it (shouldn't normally happen)
        return NextResponse.json({ error: "Escrow not found for update" }, { status: 404 });
      }
      return NextResponse.json({ success: true, escrow: rowToEscrow(rows[0]) });
    }

    // Create new escrow
    const newEscrowId = body.escrowId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = Math.floor(Date.now() / 1000);

    const { rows } = await query(
      `INSERT INTO escrows
         (escrow_id, listing_id, buyer, seller, asset, asset_symbol, amount, raw_amount, state, buyer_confirmed, seller_confirmed, deadline, created_at, milestone_percentages, current_milestone_index, released_amount, raw_released_amount, is_milestone)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       ON CONFLICT (escrow_id) DO UPDATE SET
         state = EXCLUDED.state,
         buyer_confirmed = EXCLUDED.buyer_confirmed,
         seller_confirmed = EXCLUDED.seller_confirmed
       RETURNING *`,
      [
        newEscrowId,
        body.listingId,
        body.buyer,
        body.seller,
        body.asset,
        body.assetSymbol || "XLM",
        body.amount,
        body.rawAmount?.toString() ?? "0",
        body.state || "Created",
        body.buyerConfirmed ?? false,
        body.sellerConfirmed ?? false,
        body.deadline || now + 604800,
        body.createdAt || now,
        body.milestonePercentages ? JSON.stringify(body.milestonePercentages) : null,
        body.currentMilestoneIndex ?? 0,
        body.releasedAmount ?? "0",
        body.rawReleasedAmount?.toString() ?? "0",
        body.isMilestone ?? false,
      ]
    );

    const escrow = rowToEscrow(rows[0]);
    return NextResponse.json({ success: true, escrow, escrowId: escrow.escrowId });
  } catch (error) {
    console.error("POST /api/escrows error:", error);
    return NextResponse.json({ error: "Failed to save escrow" }, { status: 500 });
  }
}
