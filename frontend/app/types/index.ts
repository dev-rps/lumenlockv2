/**
 * LumenLock v2 Shared Types and Interfaces
 * Matches Soroban Smart Contract Types and UI Models
 */

export type ListingStatus = 'Active' | 'Locked' | 'Completed' | 'Refunded' | 'Disputed';

export interface MilestoneConfig {
  percentages: number[]; // e.g. [30, 70]
  labels: string[];      // e.g. ["Initial Design", "Final Delivery"]
}

export interface Listing {
  id: string;
  seller: string;
  title: string;
  description: string;
  price: string; // Formatted price (e.g., "150")
  rawPrice: bigint; // Stroops
  asset: string; // Token address
  assetSymbol: 'XLM' | 'USDC' | 'CUSTOM';
  category?: 'Development' | 'Design' | 'Marketing' | 'Consulting' | 'Digital Asset' | 'Other';
  milestoneConfig?: MilestoneConfig | null;
  status: ListingStatus;
  createdAt: number; // Unix timestamp seconds
  rating?: number;
  completedEscrows?: number;
}

export type EscrowState = 
  | 'Created'
  | 'Funded'
  | 'PartiallyReleased'
  | 'Released'
  | 'Refunded'
  | 'Disputed'
  | 'Resolved';

export interface EscrowRecord {
  escrowId: string;
  listingId: string;
  buyer: string;
  seller: string;
  asset: string;
  assetSymbol: 'XLM' | 'USDC' | 'CUSTOM';
  amount: string; // Human readable formatted
  rawAmount: bigint;
  state: EscrowState;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  deadline: number; // Unix timestamp
  createdAt: number;
  milestonePercentages?: number[] | null;
  currentMilestoneIndex: number;
  releasedAmount: string;
  rawReleasedAmount: bigint;
  isMilestone: boolean;
}

export interface ContractEvent {
  id: string;
  ledger: number;
  timestamp: number;
  contractId: string;
  type: 
    | 'listing_created'
    | 'listing_status_updated'
    | 'escrow_opened'
    | 'escrow_funded'
    | 'buyer_confirmed'
    | 'seller_confirmed'
    | 'funds_released'
    | 'refund_claimed'
    | 'dispute_raised'
    | 'dispute_resolved';
  data: Record<string, any>;
  txHash?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string;
  xlmBalance: string;
  usdcBalance: string;
  isConnecting: boolean;
  error: string | null;
}

export interface TransactionToast {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'loading';
  txHash?: string;
  duration?: number;
}
