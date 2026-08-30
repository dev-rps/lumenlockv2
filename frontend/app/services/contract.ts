/**
 * Typed Soroban Contract Client for LumenLock MarketplaceRegistry & EscrowVault
 */

import { Listing, EscrowRecord, MilestoneConfig } from "@/app/types";
import { STELLAR_CONFIG } from "./stellar";

// In-memory mock store for instant high-fidelity local interactive testing & sandbox resilience
const mockListings: Listing[] = [
  {
    id: "1",
    seller: "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ",
    title: "Full-Stack Soroban Smart Contract & DApp Architecture",
    description: "Production-ready smart contract audit, custom token economics, Next.js frontend integration, and zero-knowledge privacy modules for decentralized Stellar applications.",
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
    description: "Complete design kit including Figma tokens, SVG icons, 3D animated glTF tokens, and light/dark theme design systems tailored for fintech protocols.",
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
    description: "Automated Ansible & Docker container scripts to deploy resilient Soroban RPC nodes on AWS and Bare Metal with live Prometheus & Grafana alerting.",
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
    description: "Thorough vulnerability assessment, CEI pattern validation, storage TTL expiration mitigation, and comprehensive security report.",
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

const mockEscrows: EscrowRecord[] = [
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
    deadline: Math.floor(Date.now() / 1000) + 604800, // 7 days from now
    createdAt: Math.floor(Date.now() / 1000) - 3600 * 4,
    milestonePercentages: [30, 70],
    currentMilestoneIndex: 0,
    releasedAmount: "0",
    rawReleasedAmount: 0n,
    isMilestone: true,
  },
];

export const ContractService = {
  /**
   * Fetch all active marketplace listings.
   */
  async getActiveListings(): Promise<Listing[]> {
    // In production, queries Soroban RPC via get_listing / list_active_listings
    return [...mockListings];
  },

  /**
   * Fetch a single listing by ID.
   */
  async getListingById(id: string): Promise<Listing | null> {
    const found = mockListings.find((l) => l.id === id);
    return found ? { ...found } : null;
  },

  /**
   * Create a new listing.
   */
  async createListing(params: {
    seller: string;
    title: string;
    description: string;
    price: string;
    asset: string;
    assetSymbol: "XLM" | "USDC";
    category?: Listing["category"];
    milestoneConfig?: MilestoneConfig | null;
  }): Promise<{ listingId: string; txHash: string }> {
    const rawPrice = BigInt(Math.round(parseFloat(params.price) * 10000000));
    const newId = (mockListings.length + 1).toString();

    const newListing: Listing = {
      id: newId,
      seller: params.seller,
      title: params.title,
      description: params.description,
      price: params.price,
      rawPrice,
      asset: params.asset,
      assetSymbol: params.assetSymbol,
      category: params.category || "Development",
      milestoneConfig: params.milestoneConfig || null,
      status: "Active",
      createdAt: Math.floor(Date.now() / 1000),
      rating: 5.0,
      completedEscrows: 0,
    };

    mockListings.unshift(newListing);

    const txHash = "f9a2" + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return { listingId: newId, txHash };
  },

  /**
   * Open an escrow for a listing.
   */
  async openEscrow(params: {
    listingId: string;
    buyer: string;
  }): Promise<{ escrowId: string; txHash: string }> {
    const listing = mockListings.find((l) => l.id === params.listingId);
    if (!listing) throw new Error("Listing not found");

    const escrowId = (mockEscrows.length + 1).toString();
    const newEscrow: EscrowRecord = {
      escrowId,
      listingId: params.listingId,
      buyer: params.buyer,
      seller: listing.seller,
      asset: listing.asset,
      assetSymbol: listing.assetSymbol,
      amount: listing.price,
      rawAmount: listing.rawPrice,
      state: "Created",
      buyerConfirmed: false,
      sellerConfirmed: false,
      deadline: Math.floor(Date.now() / 1000) + 604800,
      createdAt: Math.floor(Date.now() / 1000),
      milestonePercentages: listing.milestoneConfig?.percentages || null,
      currentMilestoneIndex: 0,
      releasedAmount: "0",
      rawReleasedAmount: 0n,
      isMilestone: !!listing.milestoneConfig,
    };

    listing.status = "Locked";
    mockEscrows.unshift(newEscrow);

    const txHash = "a1b2" + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return { escrowId, txHash };
  },

  /**
   * Fund an escrow.
   */
  async fundEscrow(escrowId: string): Promise<{ txHash: string }> {
    const escrow = mockEscrows.find((e) => e.escrowId === escrowId);
    if (!escrow) throw new Error("Escrow not found");

    escrow.state = "Funded";
    const txHash = "c3d4" + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return { txHash };
  },

  /**
   * Confirm delivery as Buyer.
   */
  async confirmBuyer(escrowId: string): Promise<{ txHash: string; autoReleased: boolean }> {
    const escrow = mockEscrows.find((e) => e.escrowId === escrowId);
    if (!escrow) throw new Error("Escrow not found");

    escrow.buyerConfirmed = true;
    let autoReleased = false;

    if (escrow.sellerConfirmed) {
      autoReleased = true;
      this.executeReleaseInternal(escrow);
    }

    const txHash = "e5f6" + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return { txHash, autoReleased };
  },

  /**
   * Confirm delivery as Seller.
   */
  async confirmSeller(escrowId: string): Promise<{ txHash: string; autoReleased: boolean }> {
    const escrow = mockEscrows.find((e) => e.escrowId === escrowId);
    if (!escrow) throw new Error("Escrow not found");

    escrow.sellerConfirmed = true;
    let autoReleased = false;

    if (escrow.buyerConfirmed) {
      autoReleased = true;
      this.executeReleaseInternal(escrow);
    }

    const txHash = "7890" + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return { txHash, autoReleased };
  },

  /**
   * Internal milestone or direct release logic matching Soroban contract.
   */
  executeReleaseInternal(escrow: EscrowRecord) {
    if (escrow.milestonePercentages && escrow.milestonePercentages.length > 0) {
      const isFinal = escrow.currentMilestoneIndex === escrow.milestonePercentages.length - 1;
      const pct = escrow.milestonePercentages[escrow.currentMilestoneIndex];
      const tranche = (parseFloat(escrow.amount) * pct) / 100;
      escrow.releasedAmount = (parseFloat(escrow.releasedAmount) + tranche).toString();

      if (isFinal) {
        escrow.state = "Released";
        const listing = mockListings.find((l) => l.id === escrow.listingId);
        if (listing) listing.status = "Completed";
      } else {
        escrow.currentMilestoneIndex += 1;
        escrow.buyerConfirmed = false;
        escrow.sellerConfirmed = false;
        escrow.state = "PartiallyReleased";
      }
    } else {
      escrow.state = "Released";
      escrow.releasedAmount = escrow.amount;
      const listing = mockListings.find((l) => l.id === escrow.listingId);
      if (listing) listing.status = "Completed";
    }
  },

  /**
   * Claim timeout refund as Buyer.
   */
  async claimRefund(escrowId: string): Promise<{ txHash: string }> {
    const escrow = mockEscrows.find((e) => e.escrowId === escrowId);
    if (!escrow) throw new Error("Escrow not found");

    escrow.state = "Refunded";
    const listing = mockListings.find((l) => l.id === escrow.listingId);
    if (listing) listing.status = "Refunded";

    const txHash = "12ab" + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return { txHash };
  },

  /**
   * Raise dispute to freeze funds.
   */
  async raiseDispute(escrowId: string, _raiser?: string): Promise<{ txHash: string }> {
    void _raiser;
    const escrow = mockEscrows.find((e) => e.escrowId === escrowId);
    if (!escrow) throw new Error("Escrow not found");

    escrow.state = "Disputed";
    const listing = mockListings.find((l) => l.id === escrow.listingId);
    if (listing) listing.status = "Disputed";

    const txHash = "99ff" + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return { txHash };
  },

  /**
   * Arbiter resolves dispute in favor of buyer or seller.
   */
  async resolveDispute(escrowId: string, winnerAddress: string): Promise<{ txHash: string }> {
    const escrow = mockEscrows.find((e) => e.escrowId === escrowId);
    if (!escrow) throw new Error("Escrow not found");

    escrow.state = "Resolved";
    const isSeller = winnerAddress === escrow.seller;
    const listing = mockListings.find((l) => l.id === escrow.listingId);
    if (listing) listing.status = isSeller ? "Completed" : "Refunded";

    const txHash = "77dd" + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return { txHash };
  },

  /**
   * Get an escrow record by ID.
   */
  async getEscrowById(escrowId: string): Promise<EscrowRecord | null> {
    const found = mockEscrows.find((e) => e.escrowId === escrowId);
    return found ? { ...found } : null;
  },

  /**
   * Get all escrows associated with an account (as buyer or seller).
   */
  async getUserEscrows(address: string): Promise<{
    buyerEscrows: EscrowRecord[];
    sellerEscrows: EscrowRecord[];
    disputedEscrows: EscrowRecord[];
  }> {
    const buyerEscrows = mockEscrows.filter((e) => e.buyer === address);
    const sellerEscrows = mockEscrows.filter((e) => e.seller === address);
    const disputedEscrows = mockEscrows.filter((e) => e.state === "Disputed");

    return {
      buyerEscrows: buyerEscrows.length > 0 ? buyerEscrows : mockEscrows,
      sellerEscrows,
      disputedEscrows,
    };
  },
};
