import { describe, expect, it } from "vitest";

import {
  acceptsCommitments,
  canTransition,
  isTerminal,
  OPPORTUNITY_TRANSITIONS,
} from "@/domain/kulakan-bareng/state-machine";

describe("opportunity state machine", () => {
  it("walks the documented happy path", () => {
    const path = [
      "DRAFT",
      "OPEN",
      "TARGET_REACHED",
      "QUOTE_REQUESTED",
      "QUOTE_RECEIVED",
      "ACCEPTED",
      "FULFILLED",
    ] as const;

    for (let index = 0; index < path.length - 1; index += 1) {
      expect(canTransition(path[index], path[index + 1])).toBe(true);
    }
  });

  it("refuses to skip or reverse a step", () => {
    expect(canTransition("OPEN", "ACCEPTED")).toBe(false);
    expect(canTransition("ACCEPTED", "QUOTE_RECEIVED")).toBe(false);
    expect(canTransition("FULFILLED", "ACCEPTED")).toBe(false);
  });

  it("allows cancellation from every live state only", () => {
    for (const targets of Object.values(OPPORTUNITY_TRANSITIONS)) {
      expect(targets.includes("CANCELLED")).toBe(targets.length > 0);
    }
  });

  it("treats fulfilled and cancelled as terminal", () => {
    expect(isTerminal("FULFILLED")).toBe(true);
    expect(isTerminal("CANCELLED")).toBe(true);
    expect(isTerminal("OPEN")).toBe(false);
  });

  it("accepts commitments only while a quote is not yet accepted", () => {
    expect(acceptsCommitments("OPEN")).toBe(true);
    expect(acceptsCommitments("TARGET_REACHED")).toBe(true);
    expect(acceptsCommitments("QUOTE_RECEIVED")).toBe(true);
    expect(acceptsCommitments("QUOTE_REQUESTED")).toBe(false);
    expect(acceptsCommitments("ACCEPTED")).toBe(false);
    expect(acceptsCommitments("CANCELLED")).toBe(false);
  });
});
