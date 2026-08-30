import { describe, it, expect } from "vitest";
import { ContractService } from "@/app/services/contract";
import { STELLAR_CONFIG } from "@/app/services/stellar";

describe("Contract Service Simulation & State Machine", () => {
  it("creates a new listing and returns valid ID", async () => {
    const res = await ContractService.createListing({
      seller: "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ",
      title: "Test Audit Service",
      description: "Smart contract audit service deliverables",
      price: "100",
      asset: STELLAR_CONFIG.xlmTokenAddress,
      assetSymbol: "XLM",
      category: "Development",
      milestoneConfig: {
        percentages: [50, 50],
        labels: ["Part 1", "Part 2"],
      },
    });

    expect(res.listingId).toBeDefined();
    expect(res.txHash).toBeDefined();

    const listing = await ContractService.getListingById(res.listingId);
    expect(listing).not.toBeNull();
    expect(listing?.title).toBe("Test Audit Service");
    expect(listing?.price).toBe("100");
  });

  it("handles escrow open, funding, and bilateral release sequence", async () => {
    // 1. Create listing
    const listingRes = await ContractService.createListing({
      seller: "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ",
      title: "Direct Escrow Test",
      description: "Direct non-milestone agreement",
      price: "50",
      asset: STELLAR_CONFIG.xlmTokenAddress,
      assetSymbol: "XLM",
      category: "Development",
      milestoneConfig: null,
    });

    // 2. Open escrow
    const buyer = "GBV2LUMENLOCKBUYERDEMOACCOUNT77777777777777777777777777777";
    const escrowRes = await ContractService.openEscrow({
      listingId: listingRes.listingId,
      buyer,
    });

    let escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("Created");

    // 3. Fund escrow
    await ContractService.fundEscrow(escrowRes.escrowId);
    escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("Funded");

    // 4. Buyer confirms
    const buyerConf = await ContractService.confirmBuyer(escrowRes.escrowId);
    expect(buyerConf.autoReleased).toBe(false);
    escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.buyerConfirmed).toBe(true);

    // 5. Seller confirms -> Auto release triggered
    const sellerConf = await ContractService.confirmSeller(escrowRes.escrowId);
    expect(sellerConf.autoReleased).toBe(true);
    escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("Released");
  });
});
