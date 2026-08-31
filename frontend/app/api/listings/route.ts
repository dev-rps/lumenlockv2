import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/app/lib/storage";
import { Listing } from "@/app/types";
import { STELLAR_CONFIG } from "@/app/services/stellar";

const INITIAL_LISTINGS: Listing[] = [
  {
    id: "1",
    seller: "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ",
    title: "Full-Stack Soroban Smart Contract & DApp Architecture",
    description:
      "Production-ready smart contract audit, custom token economics, Next.js frontend integration, and zero-knowledge privacy modules for decentralized Stellar applications.",
    price: "150",
    rawPrice: 1500000000n,
    asset: STELLAR_CONFIG.xlmTokenAddress,
    assetSymbol: "XLM",
    category: "Development",
    milestoneConfig: {
      percentages: [30, 70],
      labels: ["Contract Architecture & Tests", "Frontend Deployment & Audit"],
    },
    status: "Active",
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 2,
    rating: 4.95,
    completedEscrows: 18,
  },
  {
    id: "2",
    seller: "GB62XNZLHY3Q7KVTU6V7WJLZJ7PVQWY34V7R37M64BYSZ5W42JENFYH",
    title: "Brand Identity, 3D Assets & Design System for Web3",
    description:
      "Complete design kit including Figma tokens, SVG icons, 3D animated glTF tokens, and light/dark theme design systems tailored for fintech protocols.",
    price: "85",
    rawPrice: 850000000n,
    asset: STELLAR_CONFIG.usdcTokenAddress,
    assetSymbol: "USDC",
    category: "Design",
    milestoneConfig: {
      percentages: [50, 50],
      labels: ["Figma Wireframes & Moodboard", "Final 3D Render & Asset Delivery"],
    },
    status: "Active",
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 1,
    rating: 5.0,
    completedEscrows: 9,
  },
  {
    id: "3",
    seller: "GD37NY4GBBJCB7HECZTGPWMTXPQE35RYXI5Q2A42JENFYHGCO6OXKDFH",
    title: "Stellar Consensus & Validator Node Deployment Script",
    description:
      "Automated Ansible & Docker container scripts to deploy resilient Soroban RPC nodes on AWS and Bare Metal with live Prometheus & Grafana alerting.",
    price: "45",
    rawPrice: 450000000n,
    asset: STELLAR_CONFIG.xlmTokenAddress,
    assetSymbol: "XLM",
    category: "Development",
    milestoneConfig: null,
    status: "Active",
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 3,
    rating: 4.8,
    completedEscrows: 12,
  },
  {
    id: "4",
    seller: "GDBKQ2ACDAVI54RUAI2Q6QJQOBIC7NG2P77WWY27YDYFSZMU64BYSZ5W",
    title: "Comprehensive Smart Contract Security Audit & Formal Verification",
    description:
      "Thorough vulnerability assessment, CEI pattern validation, storage TTL expiration mitigation, and comprehensive security report.",
    price: "320",
    rawPrice: 3200000000n,
    asset: STELLAR_CONFIG.usdcTokenAddress,
    assetSymbol: "USDC",
    category: "Consulting",
    milestoneConfig: {
      percentages: [40, 60],
      labels: ["Initial Threat Modeling Report", "Final Signed Audit Certificate"],
    },
    status: "Active",
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 4,
    rating: 5.0,
    completedEscrows: 34,
  },
];

export async function GET() {
  try {
    let listings = await readJson<Listing[]>("listings.json", []);
    if (!listings || listings.length === 0) {
      listings = INITIAL_LISTINGS;
      await writeJson("listings.json", listings);
    }
    return NextResponse.json(listings);
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let listings = await readJson<Listing[]>("listings.json", []);
    if (!listings || listings.length === 0) {
      listings = INITIAL_LISTINGS;
    }

    const nextId = (listings.length + 1).toString();
    const newListing: Listing = {
      id: body.id || nextId,
      seller: body.seller,
      title: body.title,
      description: body.description,
      price: body.price,
      rawPrice: BigInt(Math.round(parseFloat(body.price || "0") * 10000000)),
      asset: body.asset,
      assetSymbol: body.assetSymbol || "XLM",
      category: body.category || "Development",
      milestoneConfig: body.milestoneConfig || null,
      status: body.status || "Active",
      createdAt: body.createdAt || Math.floor(Date.now() / 1000),
      rating: 5.0,
      completedEscrows: 0,
    };

    // Serialize BigInt safely for JSON
    const serializedListing = {
      ...newListing,
      rawPrice: newListing.rawPrice.toString(),
    };

    const updated = [serializedListing, ...listings];
    await writeJson("listings.json", updated);

    return NextResponse.json({
      success: true,
      listing: serializedListing,
      listingId: serializedListing.id,
    });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json({ error: "Failed to save listing" }, { status: 500 });
  }
}
