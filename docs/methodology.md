# Harga Wajar methodology

This document describes the implemented Harga Wajar calculation contract. The first implementation is version `1.0.0` and remains subject to review against production data.

## Objective

Harga Wajar should help a warung compare a current offer with recent, comparable community observations. It must communicate uncertainty and must never shame a user for a higher price.

## Observation boundary

A future observation requires a canonical product, package quantity and unit, price in rupiah, coarse area, observation time, contributor identity, consent, and verification state. Receipt evidence remains private and separate from public aggregate data.

## Normalization

Normalization converts compatible package quantities into a documented comparison unit using `(harga kotor - diskon + biaya kirim) / total unit dasar`. The function is pure and deterministic, rejects incompatible units, and never silently infers an unknown package size.

## Independence and threshold

A precise benchmark requires at least five independent contributors after trust and duplication checks. This rule is enforced in both the domain function and a PostgreSQL constraint. Before the threshold, the API and interface show progress without returning a mean, median, or range.

## Confidence

Confidence version `1.0.0` considers contributor independence, freshness, verification state, sample size, dispersion, and completeness using the weights recorded in the developer specification. The result is versioned and explainable. Supplier quotes never enter the community benchmark.

## Public presentation

The public result should allowlist only the normalized product, coarse area, time window, sample count or threshold progress, privacy-safe range, central estimate, and confidence explanation. Exact addresses, contributor identities, raw receipts, and report-to-supplier relationships remain private.
