"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractService } from "@/app/services/contract";
import { EventService } from "@/app/services/events";
import { useToastStore } from "@/app/state/toastStore";
import { useTxStore } from "@/app/state/txStore";
import { STELLAR_CONFIG } from "@/app/services/stellar";

export function useEscrow(escrowId: string) {
  return useQuery({
    queryKey: ["escrow", escrowId],
    queryFn: () => ContractService.getEscrowById(escrowId),
    enabled: !!escrowId,
  });
}

export function useUserEscrows(address: string | null) {
  return useQuery({
    queryKey: ["userEscrows", address],
    queryFn: () => ContractService.getUserEscrows(address || ""),
    enabled: !!address,
  });
}

export function useOpenEscrow() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { addTx } = useTxStore();

  return useMutation({
    mutationFn: async (params: { listingId: string; buyer: string }) => {
      addToast({
        type: "loading",
        title: "Opening Escrow",
        description: "Invoking open_escrow() and locking listing...",
      });

      const { escrowId, txHash } = await ContractService.openEscrow(params);

      addTx({
        hash: txHash,
        type: "open_escrow",
        description: `Opened Escrow #${escrowId} for Listing #${params.listingId}`,
        status: "success",
      });

      EventService.pushEvent({
        contractId: STELLAR_CONFIG.escrowVaultContractId,
        type: "escrow_opened",
        data: { escrowId, listingId: params.listingId, buyer: params.buyer },
        txHash,
      });

      addToast({
        type: "success",
        title: "Escrow Opened!",
        description: `Escrow #${escrowId} is ready to be funded.`,
        txHash,
      });

      return { escrowId, txHash };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["userEscrows"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useFundEscrow() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { addTx } = useTxStore();

  return useMutation({
    mutationFn: async (escrowId: string) => {
      addToast({
        type: "loading",
        title: "Funding Escrow",
        description: "Transferring tokens into EscrowVault smart contract custody...",
      });

      const { txHash } = await ContractService.fundEscrow(escrowId);

      addTx({
        hash: txHash,
        type: "fund",
        description: `Funded Escrow #${escrowId}`,
        status: "success",
      });

      EventService.pushEvent({
        contractId: STELLAR_CONFIG.escrowVaultContractId,
        type: "escrow_funded",
        data: { escrowId },
        txHash,
      });

      addToast({
        type: "success",
        title: "Escrow Funded!",
        description: `Funds safely locked in vault contract. Dual confirmation enabled.`,
        txHash,
      });

      return { txHash };
    },
    onSuccess: (_, escrowId) => {
      queryClient.invalidateQueries({ queryKey: ["escrow", escrowId] });
      queryClient.invalidateQueries({ queryKey: ["userEscrows"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useConfirmBuyer() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { addTx } = useTxStore();

  return useMutation({
    mutationFn: async (escrowId: string) => {
      const { txHash, autoReleased } = await ContractService.confirmBuyer(escrowId);

      addTx({
        hash: txHash,
        type: "confirm_buyer",
        description: `Buyer confirmed delivery on Escrow #${escrowId}`,
        status: "success",
      });

      EventService.pushEvent({
        contractId: STELLAR_CONFIG.escrowVaultContractId,
        type: "buyer_confirmed",
        data: { escrowId },
        txHash,
      });

      addToast({
        type: "success",
        title: autoReleased ? "Funds Released to Seller!" : "Buyer Confirmation Recorded",
        description: autoReleased
          ? "Both parties confirmed. Vault transferred funds automatically."
          : "Awaiting seller confirmation.",
        txHash,
      });

      return { txHash, autoReleased };
    },
    onSuccess: (_, escrowId) => {
      queryClient.invalidateQueries({ queryKey: ["escrow", escrowId] });
      queryClient.invalidateQueries({ queryKey: ["userEscrows"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useConfirmSeller() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { addTx } = useTxStore();

  return useMutation({
    mutationFn: async (escrowId: string) => {
      const { txHash, autoReleased } = await ContractService.confirmSeller(escrowId);

      addTx({
        hash: txHash,
        type: "confirm_seller",
        description: `Seller confirmed delivery on Escrow #${escrowId}`,
        status: "success",
      });

      EventService.pushEvent({
        contractId: STELLAR_CONFIG.escrowVaultContractId,
        type: "seller_confirmed",
        data: { escrowId },
        txHash,
      });

      addToast({
        type: "success",
        title: autoReleased ? "Funds Released to Seller!" : "Seller Confirmation Recorded",
        description: autoReleased
          ? "Both parties confirmed. Vault transferred funds automatically."
          : "Awaiting buyer confirmation.",
        txHash,
      });

      return { txHash, autoReleased };
    },
    onSuccess: (_, escrowId) => {
      queryClient.invalidateQueries({ queryKey: ["escrow", escrowId] });
      queryClient.invalidateQueries({ queryKey: ["userEscrows"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useClaimRefund() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { addTx } = useTxStore();

  return useMutation({
    mutationFn: async (escrowId: string) => {
      const { txHash } = await ContractService.claimRefund(escrowId);

      addTx({
        hash: txHash,
        type: "claim_refund",
        description: `Claimed refund on Escrow #${escrowId}`,
        status: "success",
      });

      EventService.pushEvent({
        contractId: STELLAR_CONFIG.escrowVaultContractId,
        type: "refund_claimed",
        data: { escrowId },
        txHash,
      });

      addToast({
        type: "success",
        title: "Refund Claimed Successfully",
        description: "Funds returned to your Stellar account.",
        txHash,
      });

      return { txHash };
    },
    onSuccess: (_, escrowId) => {
      queryClient.invalidateQueries({ queryKey: ["escrow", escrowId] });
      queryClient.invalidateQueries({ queryKey: ["userEscrows"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useRaiseDispute() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { addTx } = useTxStore();

  return useMutation({
    mutationFn: async ({ escrowId, raiser }: { escrowId: string; raiser: string }) => {
      const { txHash } = await ContractService.raiseDispute(escrowId, raiser);

      addTx({
        hash: txHash,
        type: "raise_dispute",
        description: `Dispute raised on Escrow #${escrowId}`,
        status: "success",
      });

      EventService.pushEvent({
        contractId: STELLAR_CONFIG.escrowVaultContractId,
        type: "dispute_raised",
        data: { escrowId, raiser },
        txHash,
      });

      addToast({
        type: "warning",
        title: "Dispute Escalated to Arbiter",
        description: "All funds frozen. Arbiter will review and resolve.",
        txHash,
      });

      return { txHash };
    },
    onSuccess: (_, { escrowId }) => {
      queryClient.invalidateQueries({ queryKey: ["escrow", escrowId] });
      queryClient.invalidateQueries({ queryKey: ["userEscrows"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { addTx } = useTxStore();

  return useMutation({
    mutationFn: async ({ escrowId, winner }: { escrowId: string; winner: string }) => {
      const { txHash } = await ContractService.resolveDispute(escrowId, winner);

      addTx({
        hash: txHash,
        type: "resolve_dispute",
        description: `Arbiter resolved Escrow #${escrowId}`,
        status: "success",
      });

      EventService.pushEvent({
        contractId: STELLAR_CONFIG.escrowVaultContractId,
        type: "dispute_resolved",
        data: { escrowId, winner },
        txHash,
      });

      addToast({
        type: "success",
        title: "Dispute Resolved by Arbiter",
        description: `Funds awarded and settled to ${winner.slice(0, 4)}...${winner.slice(-4)}`,
        txHash,
      });

      return { txHash };
    },
    onSuccess: (_, { escrowId }) => {
      queryClient.invalidateQueries({ queryKey: ["escrow", escrowId] });
      queryClient.invalidateQueries({ queryKey: ["userEscrows"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
