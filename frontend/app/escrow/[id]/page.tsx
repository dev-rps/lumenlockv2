"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useEscrow,
  useFundEscrow,
  useConfirmBuyer,
  useConfirmSeller,
  useClaimRefund,
  useRaiseDispute,
  useResolveDispute,
} from "@/app/hooks/useEscrow";
import { useListing } from "@/app/hooks/useListings";
import { useWalletStore } from "@/app/state/walletStore";
import { STELLAR_CONFIG } from "@/app/services/stellar";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StatusBadge } from "@/app/components/ui/Badge";
import { MilestoneProgressBar } from "@/app/components/ui/MilestoneProgressBar";
import { EscrowStateVisualizer } from "@/app/components/ui/EscrowStateVisualizer";
import { Modal } from "@/app/components/ui/Modal";
import {
  truncateAddress,
  formatDateTime,
  getRemainingTime,
  getExplorerUrl,
} from "@/app/services/formatters";
import {
  Clock,
  ExternalLink,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Scale,
  Info,
} from "@/app/components/ui/Icons";

export default function EscrowRoomPage() {
  const params = useParams();
  const escrowId = params.id as string;

  const { data: escrow, isLoading: isEscrowLoading } = useEscrow(escrowId);
  const { data: listing } = useListing(escrow?.listingId || "");
  const { isConnected, address, setModalOpen } = useWalletStore();

  const fundMutation = useFundEscrow();
  const confirmBuyerMutation = useConfirmBuyer();
  const confirmSellerMutation = useConfirmSeller();
  const claimRefundMutation = useClaimRefund();
  const raiseDisputeMutation = useRaiseDispute();
  const resolveDisputeMutation = useResolveDispute();

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  if (isEscrowLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-slate-500 mt-4">Querying EscrowVault smart contract state...</p>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Escrow Record Not Found</h2>
        <p className="text-sm text-slate-500">
          Escrow #{escrowId} does not exist on the EscrowVault contract.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isBuyer = isConnected && address === escrow.buyer;
  const isSeller = isConnected && address === escrow.seller;
  const isArbiter = isConnected && address === STELLAR_CONFIG.arbiterAddress;

  const timeStatus = getRemainingTime(escrow.deadline);
  const isExpired = timeStatus.isExpired;

  const handleFund = async () => {
    if (!isConnected) {
      setModalOpen(true);
      return;
    }
    await fundMutation.mutateAsync(escrow.escrowId);
  };

  const handleConfirmBuyer = async () => {
    if (!isConnected) {
      setModalOpen(true);
      return;
    }
    await confirmBuyerMutation.mutateAsync(escrow.escrowId);
  };

  const handleConfirmSeller = async () => {
    if (!isConnected) {
      setModalOpen(true);
      return;
    }
    await confirmSellerMutation.mutateAsync(escrow.escrowId);
  };

  const handleClaimRefund = async () => {
    if (!isConnected) {
      setModalOpen(true);
      return;
    }
    await claimRefundMutation.mutateAsync(escrow.escrowId);
  };

  const handleRaiseDispute = async () => {
    if (!isConnected || !address) {
      setModalOpen(true);
      return;
    }
    await raiseDisputeMutation.mutateAsync({
      escrowId: escrow.escrowId,
      raiser: address,
    });
    setIsDisputeModalOpen(false);
  };

  const handleArbiterResolve = async (winner: string) => {
    if (!isConnected) {
      setModalOpen(true);
      return;
    }
    await resolveDisputeMutation.mutateAsync({
      escrowId: escrow.escrowId,
      winner,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500">
            Escrow #{escrow.escrowId}
          </span>
          <StatusBadge status={escrow.state} />
        </div>
      </div>

      {/* Main Escrow Status Card */}
      <Card className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Escrow Settlement Room
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              {listing?.title || `Escrow Contract #${escrow.escrowId}`}
            </h1>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs text-slate-400 font-medium block">Total Locked Value</span>
            <div className="flex items-baseline md:justify-end gap-1.5 mt-0.5">
              <span className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900">
                {escrow.amount}
              </span>
              <span className="text-sm font-bold text-blue-600 font-mono">
                {escrow.assetSymbol}
              </span>
            </div>
          </div>
        </div>

        {/* State Visualizer Stepper */}
        <EscrowStateVisualizer
          state={escrow.state}
          buyerConfirmed={escrow.buyerConfirmed}
          sellerConfirmed={escrow.sellerConfirmed}
          isMilestone={escrow.isMilestone}
          currentMilestoneIndex={escrow.currentMilestoneIndex}
          totalMilestones={escrow.milestonePercentages?.length || 1}
        />

        {/* Milestone Progress (if configured) */}
        {escrow.isMilestone && escrow.milestonePercentages && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Milestone Progress:</span>
              <span className="font-mono text-slate-600">
                Released: {escrow.releasedAmount} / {escrow.amount} {escrow.assetSymbol}
              </span>
            </div>
            <MilestoneProgressBar
              percentages={escrow.milestonePercentages}
              labels={listing?.milestoneConfig?.labels}
              currentIndex={escrow.currentMilestoneIndex}
              isCompleted={escrow.state === "Released"}
              totalAmount={escrow.amount}
              assetSymbol={escrow.assetSymbol}
            />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parties & Escrow Metadata (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bilateral Party Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Buyer Card */}
            <Card className="p-5 space-y-3 bg-slate-50/70 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Buyer Account
                </span>
                {escrow.buyerConfirmed ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Confirmed</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                )}
              </div>
              <a
                href={getExplorerUrl(escrow.buyer, "account")}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-1.5"
              >
                <span>{truncateAddress(escrow.buyer, 8, 8)}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <p className="text-[11px] text-slate-500">
                {isBuyer ? "You are the Buyer for this escrow." : "Buyer commits and releases payment."}
              </p>
            </Card>

            {/* Seller Card */}
            <Card className="p-5 space-y-3 bg-slate-50/70 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Seller Account
                </span>
                {escrow.sellerConfirmed ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Confirmed</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                )}
              </div>
              <a
                href={getExplorerUrl(escrow.seller, "account")}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-1.5"
              >
                <span>{truncateAddress(escrow.seller, 8, 8)}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <p className="text-[11px] text-slate-500">
                {isSeller ? "You are the Seller for this escrow." : "Seller delivers product/service."}
              </p>
            </Card>
          </div>

          {/* Timeline & Metadata */}
          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Escrow Timeline & Ledger Parameters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 space-y-1">
                <span className="text-slate-400 block text-[11px]">Opened At</span>
                <span className="font-medium text-slate-800">{formatDateTime(escrow.createdAt)}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 space-y-1">
                <span className="text-slate-400 block text-[11px]">Deadline</span>
                <span className="font-medium text-slate-800">{formatDateTime(escrow.deadline)}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 space-y-1">
                <span className="text-slate-400 block text-[11px]">Timeout Status</span>
                <span className={`font-bold font-mono ${isExpired ? "text-rose-600" : "text-emerald-700"}`}>
                  {timeStatus.formatted}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 space-y-1">
                <span className="text-slate-400 block text-[11px]">Custody Vault Contract</span>
                <a
                  href={getExplorerUrl(STELLAR_CONFIG.escrowVaultContractId, "contract")}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>{truncateAddress(STELLAR_CONFIG.escrowVaultContractId, 6, 6)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Context-Aware Action Card (Right col) */}
        <div className="space-y-6">
          <Card className="p-6 space-y-5 border-slate-300 shadow-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Available Actions</span>
            </h3>

            {/* State: Created (Needs Funding) */}
            {escrow.state === "Created" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  The escrow has been opened. The buyer must deposit the tokens into the vault to begin work.
                </p>
                <Button
                  size="lg"
                  onClick={handleFund}
                  isLoading={fundMutation.isPending}
                  disabled={!isBuyer && isConnected}
                  className="w-full"
                  leftIcon={<Coins className="w-4 h-4" />}
                >
                  Fund {escrow.amount} {escrow.assetSymbol}
                </Button>
              </div>
            )}

            {/* State: Funded / PartiallyReleased (Active Work) */}
            {["Funded", "PartiallyReleased"].includes(escrow.state) && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Funds are safely locked in the smart contract. Once delivery is complete, both parties confirm to execute payout.
                </p>

                {/* Buyer Confirm Button */}
                <Button
                  size="md"
                  variant={escrow.buyerConfirmed ? "secondary" : "primary"}
                  onClick={handleConfirmBuyer}
                  isLoading={confirmBuyerMutation.isPending}
                  disabled={escrow.buyerConfirmed || (!isBuyer && isConnected)}
                  className="w-full justify-between"
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  <span>{escrow.buyerConfirmed ? "Buyer Confirmed ✓" : "Confirm as Buyer"}</span>
                </Button>

                {/* Seller Confirm Button */}
                <Button
                  size="md"
                  variant={escrow.sellerConfirmed ? "secondary" : "emerald"}
                  onClick={handleConfirmSeller}
                  isLoading={confirmSellerMutation.isPending}
                  disabled={escrow.sellerConfirmed || (!isSeller && isConnected)}
                  className="w-full justify-between"
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  <span>{escrow.sellerConfirmed ? "Seller Confirmed ✓" : "Confirm as Seller"}</span>
                </Button>

                {/* Timeout Refund Button (if expired) */}
                {isExpired && escrow.state === "Funded" && (
                  <Button
                    size="md"
                    variant="amber"
                    onClick={handleClaimRefund}
                    isLoading={claimRefundMutation.isPending}
                    disabled={!isBuyer && isConnected}
                    className="w-full"
                    leftIcon={<Clock className="w-4 h-4" />}
                  >
                    Claim Timeout Refund
                  </Button>
                )}

                {/* Dispute Trigger */}
                <button
                  onClick={() => setIsDisputeModalOpen(true)}
                  className="w-full pt-2 text-center text-xs font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Raise Dispute to Arbiter</span>
                </button>
              </div>
            )}

            {/* State: Disputed (Arbiter Resolution) */}
            {escrow.state === "Disputed" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-rose-600" />
                    <span>Under Arbiter Review</span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    All direct refunds and releases are frozen. The designated arbiter will review transaction details and award funds.
                  </p>
                </div>

                {isArbiter && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-800 block">Arbiter Adjudication:</span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleArbiterResolve(escrow.buyer)}
                      isLoading={resolveDisputeMutation.isPending}
                      className="w-full text-xs"
                    >
                      Resolve & Refund to Buyer
                    </Button>
                    <Button
                      size="sm"
                      variant="emerald"
                      onClick={() => handleArbiterResolve(escrow.seller)}
                      isLoading={resolveDisputeMutation.isPending}
                      className="w-full text-xs"
                    >
                      Resolve & Release to Seller
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* State: Completed / Released */}
            {escrow.state === "Released" && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-950">Escrow Settled & Released</h4>
                <p className="text-[11px] text-emerald-800">
                  Full amount of {escrow.amount} {escrow.assetSymbol} has been transferred to the seller.
                </p>
              </div>
            )}

            {/* State: Refunded */}
            {escrow.state === "Refunded" && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-900">Escrow Refunded</h4>
                <p className="text-[11px] text-slate-500">
                  Funds have been safely returned to the buyer account.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Dispute Modal */}
      <Modal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        title="Raise Dispute to Arbiter"
        description="Freezes contract funds and flags the escrow for arbiter resolution."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Reason for Dispute
            </label>
            <textarea
              rows={4}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Describe the issue (non-delivery, specification mismatch, unresponsiveness)..."
              className="w-full px-3.5 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900"
            />
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Disputes cannot be cancelled once raised. The designated arbiter (<code className="font-mono font-bold">{truncateAddress(STELLAR_CONFIG.arbiterAddress)}</code>) will review the on-chain evidence and award funds.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsDisputeModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleRaiseDispute}
              isLoading={raiseDisputeMutation.isPending}
              disabled={disputeReason.trim().length < 5}
            >
              Freeze Funds & Raise Dispute
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
