# Harga Wajar methodology

This document sets guardrails, not implemented calculations.

## Objective

Harga Wajar should help a warung compare a current offer with recent, comparable community observations. It must communicate uncertainty and must never shame a user for a higher price.

## Observation boundary

A future observation requires a canonical product, package quantity and unit, price in rupiah, coarse area, observation time, contributor identity, consent, and verification state. Receipt evidence remains private and separate from public aggregate data.

## Normalization

Normalization will convert compatible package quantities into a documented comparison unit. The function must be pure, deterministic, and tested against incompatible units, bundles, promotions, and missing quantities. No conversion may silently infer an unknown package size.

## Independence and threshold

A precise benchmark requires at least five independent contributors after trust and duplication checks. Before the threshold, the interface shows progress and explains what is missing. It does not publish a mean, median, range, or fabricated example as real data.

## Confidence

Confidence may consider contributor independence, freshness, verification state, sample size, geographic fit, and dispersion. Policy weights must be documented, versioned, and explainable. Supplier quotes never enter the community benchmark.

## Public presentation

The public result should allowlist only the normalized product, coarse area, time window, sample count or threshold progress, privacy-safe range, central estimate, and confidence explanation. Exact addresses, contributor identities, raw receipts, and report-to-supplier relationships remain private.
