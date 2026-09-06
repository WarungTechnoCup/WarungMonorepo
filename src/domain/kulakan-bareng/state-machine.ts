import type { OpportunityStatus } from "@/types/harga-wajar";

/**
 * Spec section 7 defines the lifecycle as
 * DRAFT -> OPEN -> TARGET_REACHED -> QUOTE_REQUESTED -> QUOTE_RECEIVED ->
 * ACCEPTED -> FULFILLED, with CANCELLED reachable from any live state.
 *
 * Transitions are declared as data so the rule is testable without a
 * database and cannot drift from the routes that enforce it.
 */
export const OPPORTUNITY_TRANSITIONS: Record<
  OpportunityStatus,
  readonly OpportunityStatus[]
> = {
  DRAFT: ["OPEN", "CANCELLED"],
  OPEN: ["TARGET_REACHED", "QUOTE_REQUESTED", "CANCELLED"],
  TARGET_REACHED: ["QUOTE_REQUESTED", "CANCELLED"],
  QUOTE_REQUESTED: ["QUOTE_RECEIVED", "CANCELLED"],
  QUOTE_RECEIVED: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["FULFILLED", "CANCELLED"],
  FULFILLED: [],
  CANCELLED: [],
};

/** States that still accept commitments from contributors. */
export const COMMITTABLE_STATUSES: readonly OpportunityStatus[] = [
  "OPEN",
  "TARGET_REACHED",
  "QUOTE_RECEIVED",
];

export function canTransition(from: OpportunityStatus, to: OpportunityStatus) {
  return OPPORTUNITY_TRANSITIONS[from].includes(to);
}

export function acceptsCommitments(status: OpportunityStatus) {
  return COMMITTABLE_STATUSES.includes(status);
}

export function isTerminal(status: OpportunityStatus) {
  return OPPORTUNITY_TRANSITIONS[status].length === 0;
}
