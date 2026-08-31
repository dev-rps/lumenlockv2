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

    const buyer = "GBV2LUMENLOCKBUYERDEMOACCOUNT77777777777777777777777777777";
    const escrowRes = await ContractService.openEscrow({
      listingId: listingRes.listingId,
      buyer,
    });

    let escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("Created");

    await ContractService.fundEscrow(escrowRes.escrowId);
    escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("Funded");

    const buyerConf = await ContractService.confirmBuyer(escrowRes.escrowId);
    expect(buyerConf.autoReleased).toBe(false);
    escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.buyerConfirmed).toBe(true);

    const sellerConf = await ContractService.confirmSeller(escrowRes.escrowId);
    expect(sellerConf.autoReleased).toBe(true);
    escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("Released");
  });

  it("handles milestone multi-tranche execution", async () => {
    const listingRes = await ContractService.createListing({
      seller: "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ",
      title: "Milestone Contract Test",
      description: "Two-tranche milestone payout test",
      price: "200",
      asset: STELLAR_CONFIG.xlmTokenAddress,
      assetSymbol: "XLM",
      category: "Development",
      milestoneConfig: {
        percentages: [40, 60],
        labels: ["Milestone 1 (40%)", "Milestone 2 (60%)"],
      },
    });

    const buyer = "GBV2LUMENLOCKBUYERDEMOACCOUNT77777777777777777777777777777";
    const escrowRes = await ContractService.openEscrow({
      listingId: listingRes.listingId,
      buyer,
    });

    await ContractService.fundEscrow(escrowRes.escrowId);

    // Tranche 1 confirmation
    await ContractService.confirmBuyer(escrowRes.escrowId);
    const sellerConf1 = await ContractService.confirmSeller(escrowRes.escrowId);
    expect(sellerConf1.autoReleased).toBe(true);

    let escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("PartiallyReleased");
    expect(escrow?.currentMilestoneIndex).toBe(1);
    expect(parseFloat(escrow?.releasedAmount || "0")).toBe(80);

    // Tranche 2 confirmation
    await ContractService.confirmBuyer(escrowRes.escrowId);
    const sellerConf2 = await ContractService.confirmSeller(escrowRes.escrowId);
    expect(sellerConf2.autoReleased).toBe(true);

    escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("Released");
    expect(parseFloat(escrow?.releasedAmount || "0")).toBe(200);
  });

  it("handles refund claims and arbiter dispute resolution", async () => {
    const listingRes = await ContractService.createListing({
      seller: "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ",
      title: "Dispute Test Service",
      description: "Testing dispute escalation and arbiter payout",
      price: "100",
      asset: STELLAR_CONFIG.usdcTokenAddress,
      assetSymbol: "USDC",
      category: "Consulting",
    });

    const buyer = "GBV2LUMENLOCKBUYERDEMOACCOUNT77777777777777777777777777777";
    const escrowRes = await ContractService.openEscrow({
      listingId: listingRes.listingId,
      buyer,
    });
    await ContractService.fundEscrow(escrowRes.escrowId);

    // Raise dispute
    await ContractService.raiseDispute(escrowRes.escrowId, buyer);
    let escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("Disputed");

    // Resolve dispute in favor of buyer
    await ContractService.resolveDispute(escrowRes.escrowId, buyer);
    escrow = await ContractService.getEscrowById(escrowRes.escrowId);
    expect(escrow?.state).toBe("Resolved");
  });
});
