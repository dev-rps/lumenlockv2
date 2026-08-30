"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractService } from "@/app/services/contract";
import { EventService } from "@/app/services/events";
import { useToastStore } from "@/app/state/toastStore";
import { useTxStore } from "@/app/state/txStore";
import { STELLAR_CONFIG } from "@/app/services/stellar";

export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: () => ContractService.getActiveListings(),
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => ContractService.getListingById(id),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { addTx, updateTxStatus } = useTxStore();

  return useMutation({
    mutationFn: async (params: {
      seller: string;
      title: string;
      description: string;
      price: string;
      asset: string;
      assetSymbol: "XLM" | "USDC";
      category: any;
      milestoneConfig?: any;
    }) => {
      const toastId = addToast({
        type: "loading",
        title: "Publishing Listing",
        description: "Simulating Soroban transaction & invoking create_listing...",
      });

      try {
        const { listingId, txHash } = await ContractService.createListing(params);

        addTx({
          hash: txHash,
          type: "create_listing",
          description: `Created listing #${listingId}: "${params.title}"`,
          status: "success",
        });

        EventService.pushEvent({
          contractId: STELLAR_CONFIG.marketplaceContractId,
          type: "listing_created",
          data: {
            listingId,
            seller: params.seller,
            price: `${params.price} ${params.assetSymbol}`,
          },
          txHash,
        });

        addToast({
          type: "success",
          title: "Listing Created Successfully!",
          description: `Listing #${listingId} is now active on the marketplace.`,
          txHash,
        });

        return { listingId, txHash };
      } catch (err: any) {
        addToast({
          type: "error",
          title: "Failed to Create Listing",
          description: err.message || "Soroban RPC call failed",
        });
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
