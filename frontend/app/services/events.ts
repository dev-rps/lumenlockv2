/**
 * Soroban Real-Time Event Parser & Streamer
 */

import { ContractEvent } from "@/app/types";
import { STELLAR_CONFIG } from "./stellar";

let mockEvents: ContractEvent[] = [
  {
    id: "evt-1",
    ledger: 1048201,
    timestamp: Math.floor(Date.now() / 1000) - 120,
    contractId: STELLAR_CONFIG.escrowVaultContractId,
    type: "escrow_funded",
    data: {
      escrowId: "1",
      amount: "150 XLM",
      buyer: "GBV2...7777",
    },
    txHash: "f1a23456789abcdef0123456789abcdef0123456789abcdef0123456789abcde",
  },
  {
    id: "evt-2",
    ledger: 1048195,
    timestamp: Math.floor(Date.now() / 1000) - 300,
    contractId: STELLAR_CONFIG.escrowVaultContractId,
    type: "escrow_opened",
    data: {
      escrowId: "1",
      listingId: "1",
      buyer: "GBV2...7777",
      seller: "GA7Q...VSGZ",
      amount: "150 XLM",
    },
    txHash: "b2c3456789abcdef0123456789abcdef0123456789abcdef0123456789abcde",
  },
  {
    id: "evt-3",
    ledger: 1048150,
    timestamp: Math.floor(Date.now() / 1000) - 720,
    contractId: STELLAR_CONFIG.marketplaceContractId,
    type: "listing_created",
    data: {
      listingId: "1",
      seller: "GA7Q...VSGZ",
      price: "150 XLM",
    },
    txHash: "c3d456789abcdef0123456789abcdef0123456789abcdef0123456789abcde",
  },
  {
    id: "evt-4",
    ledger: 1048110,
    timestamp: Math.floor(Date.now() / 1000) - 1500,
    contractId: STELLAR_CONFIG.escrowVaultContractId,
    type: "funds_released",
    data: {
      escrowId: "0",
      seller: "GB62...FYH",
      amount: "85 USDC",
      isFinal: true,
    },
    txHash: "d4e56789abcdef0123456789abcdef0123456789abcdef0123456789abcde",
  },
];

export const EventService = {
  /**
   * Fetch recent on-chain events.
   */
  async getRecentEvents(limit: number = 30): Promise<ContractEvent[]> {
    return mockEvents.slice(0, limit);
  },

  /**
   * Add new event to activity store when an action occurs.
   */
  pushEvent(event: Omit<ContractEvent, "id" | "timestamp" | "ledger">) {
    const newEvent: ContractEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ledger: 1048200 + Math.floor(Math.random() * 50),
      timestamp: Math.floor(Date.now() / 1000),
      ...event,
    };
    mockEvents.unshift(newEvent);
    return newEvent;
  },
};
