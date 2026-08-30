import { describe, it, expect } from "vitest";
import {
  formatStroops,
  toStroops,
  truncateAddress,
  getRemainingTime,
  STROOPS_PER_XLM,
} from "@/app/services/formatters";

describe("Formatting & Helper Utilities", () => {
  it("converts stroops to human readable token amount accurately", () => {
    expect(formatStroops(10000000n)).toBe("1");
    expect(formatStroops(1500000000n)).toBe("150");
    expect(formatStroops(12500000n)).toBe("1.25");
    expect(formatStroops(0n)).toBe("0");
  });

  it("converts human readable amount to stroops", () => {
    expect(toStroops("1")).toBe(STROOPS_PER_XLM);
    expect(toStroops("150")).toBe(1500000000n);
    expect(toStroops("1.25")).toBe(12500000n);
  });

  it("truncates Stellar public key address properly", () => {
    const address = "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ";
    expect(truncateAddress(address, 4, 4)).toBe("GA7Q...VSGZ");
    expect(truncateAddress(address, 6, 6)).toBe("GA7QYN...UJVSGZ");
    expect(truncateAddress("")).toBe("");
  });

  it("calculates deadline expiration status", () => {
    const futureTimestamp = Math.floor(Date.now() / 1000) + 3600 * 24; // 1 day in future
    const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour in past

    expect(getRemainingTime(futureTimestamp).isExpired).toBe(false);
    expect(getRemainingTime(pastTimestamp).isExpired).toBe(true);
  });
});
