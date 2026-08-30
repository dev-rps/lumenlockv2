import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Button } from "@/app/components/ui/Button";
import { Badge, StatusBadge } from "@/app/components/ui/Badge";
import { MilestoneProgressBar } from "@/app/components/ui/MilestoneProgressBar";
import { EscrowStateVisualizer } from "@/app/components/ui/EscrowStateVisualizer";

describe("UI Components", () => {
  it("renders Button component correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("renders StatusBadge with proper labels", () => {
    render(<StatusBadge status="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();

    render(<StatusBadge status="Funded" />);
    expect(screen.getByText("Funded")).toBeInTheDocument();

    render(<StatusBadge status="Disputed" />);
    expect(screen.getByText("Under Dispute")).toBeInTheDocument();
  });

  it("renders MilestoneProgressBar with percentages", () => {
    render(
      <MilestoneProgressBar
        percentages={[30, 70]}
        labels={["Design", "Code"]}
        currentIndex={0}
        totalAmount="100"
        assetSymbol="XLM"
      />
    );
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("renders EscrowStateVisualizer with steps", () => {
    render(
      <EscrowStateVisualizer
        state="Funded"
        buyerConfirmed={true}
        sellerConfirmed={false}
      />
    );
    expect(screen.getByText("Escrow Opened")).toBeInTheDocument();
    expect(screen.getByText("Funds Deposited")).toBeInTheDocument();
  });
});
