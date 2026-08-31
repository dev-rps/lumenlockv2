import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/app/lib/storage";
import { EscrowRecord } from "@/app/types";
import { STELLAR_CONFIG } from "@/app/services/stellar";

const INITIAL_ESCROWS: EscrowRecord[] = [
  {
    escrowId: "1",
    listingId: "1",
    buyer: "GBV2LUMENLOCKBUYERDEMOACCOUNT77777777777777777777777777777",
    seller: "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ",
    asset: STELLAR_CONFIG.xlmTokenAddress,
    assetSymbol: "XLM",
    amount: "150",
    rawAmount: 1500000000n,
    state: "Funded",
    buyerConfirmed: false,
    sellerConfirmed: false,
    deadline: Math.floor(Date.now() / 1000) + 604800,
    createdAt: Math.floor(Date.now() / 1000) - 3600 * 4,
    milestonePercentages: [30, 70],
    currentMilestoneIndex: 0,
    releasedAmount: "0",
    rawReleasedAmount: 0n,
    isMilestone: true,
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const escrowId = searchParams.get("escrowId");

    let escrows = await readJson<any[]>("escrows.json", []);
    if (!escrows || escrows.length === 0) {
      escrows = INITIAL_ESCROWS.map((e) => ({
        ...e,
        rawAmount: e.rawAmount.toString(),
        rawReleasedAmount: e.rawReleasedAmount.toString(),
      }));
      await writeJson("escrows.json", escrows);
    }

    if (escrowId) {
      const found = escrows.find((e) => e.escrowId === escrowId);
      return NextResponse.json(found || null);
    }

    if (address) {
      const buyerEscrows = escrows.filter((e) => e.buyer === address);
      const sellerEscrows = escrows.filter((e) => e.seller === address);
      const disputedEscrows = escrows.filter((e) => e.state === "Disputed");
      return NextResponse.json({
        buyerEscrows: buyerEscrows.length > 0 ? buyerEscrows : escrows,
        sellerEscrows,
        disputedEscrows,
      });
    }

    return NextResponse.json(escrows);
  } catch (error) {
    console.error("GET /api/escrows error:", error);
    return NextResponse.json({ error: "Failed to fetch escrows" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let escrows = await readJson<any[]>("escrows.json", []);
    if (!escrows || escrows.length === 0) {
      escrows = INITIAL_ESCROWS.map((e) => ({
        ...e,
        rawAmount: e.rawAmount.toString(),
        rawReleasedAmount: e.rawReleasedAmount.toString(),
      }));
    }

    if (body.action === "update" && body.escrow) {
      const index = escrows.findIndex((e) => e.escrowId === body.escrow.escrowId);
      if (index !== -1) {
        escrows[index] = { ...escrows[index], ...body.escrow };
      } else {
        escrows.unshift(body.escrow);
      }
      await writeJson("escrows.json", escrows);
      return NextResponse.json({ success: true, escrow: body.escrow });
    }

    const nextId = (escrows.length + 1).toString();
    const newEscrow = {
      escrowId: body.escrowId || nextId,
      listingId: body.listingId,
      buyer: body.buyer,
      seller: body.seller,
      asset: body.asset,
      assetSymbol: body.assetSymbol || "XLM",
      amount: body.amount,
      rawAmount: (body.rawAmount || 0).toString(),
      state: body.state || "Created",
      buyerConfirmed: body.buyerConfirmed ?? false,
      sellerConfirmed: body.sellerConfirmed ?? false,
      deadline: body.deadline || Math.floor(Date.now() / 1000) + 604800,
      createdAt: body.createdAt || Math.floor(Date.now() / 1000),
      milestonePercentages: body.milestonePercentages || null,
      currentMilestoneIndex: body.currentMilestoneIndex || 0,
      releasedAmount: body.releasedAmount || "0",
      rawReleasedAmount: (body.rawReleasedAmount || 0).toString(),
      isMilestone: body.isMilestone ?? false,
    };

    escrows.unshift(newEscrow);
    await writeJson("escrows.json", escrows);

    return NextResponse.json({ success: true, escrow: newEscrow, escrowId: newEscrow.escrowId });
  } catch (error) {
    console.error("POST /api/escrows error:", error);
    return NextResponse.json({ error: "Failed to save escrow" }, { status: 500 });
  }
}
