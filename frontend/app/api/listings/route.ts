import { NextResponse } from "next/server";
import { query, initDatabase } from "@/app/lib/db";

/**
 * Map a raw Postgres row to the Listing shape the frontend expects.
 */
function rowToListing(row: any) {
  return {
    id: row.id,
    seller: row.seller,
    title: row.title,
    description: row.description,
    price: row.price,
    rawPrice: row.raw_price?.toString() ?? "0",
    asset: row.asset,
    assetSymbol: row.asset_symbol,
    category: row.category,
    milestoneConfig: row.milestone_config ?? null,
    status: row.status,
    createdAt: Number(row.created_at),
    rating: parseFloat(row.rating ?? "5"),
    completedEscrows: Number(row.completed_escrows ?? 0),
  };
}

export async function GET() {
  try {
    await initDatabase();
    const { rows } = await query(
      "SELECT * FROM listings WHERE status = 'Active' ORDER BY created_at DESC"
    );
    return NextResponse.json(rows.map(rowToListing));
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDatabase();
    const body = await req.json();

    if (!body.seller || !body.title || !body.price) {
      return NextResponse.json({ error: "Missing required fields: seller, title, price" }, { status: 400 });
    }

    // Generate a unique ID: timestamp + random suffix
    const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const rawPrice = BigInt(Math.round(parseFloat(body.price || "0") * 10_000_000)).toString();
    const createdAt = body.createdAt || Math.floor(Date.now() / 1000);
    const milestoneConfig = body.milestoneConfig ? JSON.stringify(body.milestoneConfig) : null;

    const { rows } = await query(
      `INSERT INTO listings
         (id, seller, title, description, price, raw_price, asset, asset_symbol, category, milestone_config, status, created_at, rating, completed_escrows)
       VALUES
         ($1,  $2,     $3,    $4,          $5,    $6,        $7,    $8,           $9,       $10,              $11,    $12,        $13,    $14)
       RETURNING *`,
      [
        newId,
        body.seller,
        body.title,
        body.description || "",
        body.price,
        rawPrice,
        body.asset || "",
        body.assetSymbol || "XLM",
        body.category || "Development",
        milestoneConfig,
        body.status || "Active",
        createdAt,
        5.0,
        0,
      ]
    );

    const listing = rowToListing(rows[0]);
    return NextResponse.json({ success: true, listing, listingId: listing.id });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json({ error: "Failed to save listing" }, { status: 500 });
  }
}
