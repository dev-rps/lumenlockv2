"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractService } from "@/app/services/contract";
import { EventService } from "@/app/services/events";
import { useToastStore } from "@/app/state/toastStore";
import { useTxStore } from "@/app/state/txStore";
import { STELLAR_CONFIG } from "@/app/services/stellar";
import { Listing, MilestoneConfig } from "@/app/types";

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
  const { addToast, removeToast } = useToastStore();
  const { addTx } = useTxStore();

  return useMutation({
    mutationFn: async (params: {
      seller: string;
      title: string;
      description: string;
      price: string;
      asset: string;
      assetSymbol: "XLM" | "USDC";
      category?: Listing["category"];
      milestoneConfig?: MilestoneConfig | null;
    }) => {
      const toastId = addToast({
        type: "loading",
        title: "Publishing Listing",
        description: "Simulating Soroban transaction & invoking create_listing...",
      });

      try {
        const { listingId, txHash } = await ContractService.createListing(params);

        removeToast(toastId);

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
          description: `Listing #${listingId} is active on the marketplace.`,
          txHash,
        });

        return { listingId, txHash };
      } catch (err: unknown) {
        removeToast(toastId);
        const errorMsg = err instanceof Error ? err.message : "Soroban RPC call failed";
        addToast({
          type: "error",
          title: "Failed to Create Listing",
          description: errorMsg,
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
