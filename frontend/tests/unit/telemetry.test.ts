import { describe, it, expect } from "vitest";
import { telemetry } from "@/app/services/telemetry";

describe("TelemetryService Unit Tests", () => {
  it("should record and retrieve custom telemetry events", () => {
    const event = telemetry.trackEvent({
      category: "contract",
      name: "fund_escrow_initiated",
      status: "info",
      details: { escrowId: "escrow-99" },
    });

    expect(event.id).toBeDefined();
    expect(event.name).toBe("fund_escrow_initiated");

    const events = telemetry.getEvents();
    expect(events.some((e) => e.name === "fund_escrow_initiated")).toBe(true);
  });

  it("should measure execution latency and track success", async () => {
    const mockAsyncFunc = async () => {
      await new Promise((res) => setTimeout(res, 20));
      return "done";
    };

    const result = await telemetry.trackExecution(
      "contract",
      "test_operation",
      mockAsyncFunc
    );

    expect(result).toBe("done");

    const events = telemetry.getEvents();
    const tracked = events.find((e) => e.name === "test_operation");
    expect(tracked).toBeDefined();
    expect(tracked?.status).toBe("success");
    expect(tracked?.latencyMs).toBeGreaterThanOrEqual(10);
  });

  it("should record error status when operation fails", async () => {
    const failingFunc = async () => {
      throw new Error("RPC execution timeout");
    };

    await expect(
      telemetry.trackExecution("contract", "failing_operation", failingFunc)
    ).rejects.toThrow("RPC execution timeout");

    const events = telemetry.getEvents();
    const failedEvent = events.find((e) => e.name === "failing_operation_failed");
    expect(failedEvent).toBeDefined();
    expect(failedEvent?.status).toBe("error");
  });

  it("should check and report RPC health status", async () => {
    const health = await telemetry.checkRpcHealth();
    expect(health.endpoint).toBeDefined();
    expect(health.status).toBeDefined();
    expect(health.latencyMs).toBeGreaterThan(0);
  });
});
