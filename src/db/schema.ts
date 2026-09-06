import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const reportStatusEnum = pgEnum("price_report_status", [
  "pending",
  "included",
  "flagged",
  "excluded",
]);
export const benchmarkStatusEnum = pgEnum("benchmark_status", [
  "insufficient",
  "available",
]);
export const consentPurposeEnum = pgEnum("consent_purpose", [
  "anonymous_aggregation",
  "receipt_storage",
]);
export const opportunityStatusEnum = pgEnum("opportunity_status", [
  "DRAFT",
  "OPEN",
  "TARGET_REACHED",
  "QUOTE_REQUESTED",
  "QUOTE_RECEIVED",
  "ACCEPTED",
  "FULFILLED",
  "CANCELLED",
]);

export const warungs = pgTable(
  "warungs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerAuthUserId: uuid("owner_auth_user_id").notNull(),
    displayName: text("display_name").notNull(),
    province: text("province").notNull(),
    city: text("city").notNull(),
    district: text("district").notNull(),
    isDemo: boolean("is_demo").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("warungs_owner_auth_user_id_unique").on(table.ownerAuthUserId),
    index("warungs_benchmark_area_idx").on(
      table.province,
      table.city,
      table.district,
    ),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    baseUnit: text("base_unit").notNull(),
    description: text("description").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isDemo: boolean("is_demo").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("products_slug_unique").on(table.slug),
    index("products_name_idx").on(table.name),
  ],
);

export const packagingOptions = pgTable(
  "packaging_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    unitsPerPackage: integer("units_per_package").notNull(),
    baseUnit: text("base_unit").notNull(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    uniqueIndex("packaging_product_label_unique").on(
      table.productId,
      table.label,
    ),
  ],
);

export const receiptObjects = pgTable(
  "receipt_objects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerAuthUserId: uuid("owner_auth_user_id").notNull(),
    storagePath: text("storage_path").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    retentionUntil: timestamp("retention_until", {
      withTimezone: true,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("receipt_objects_storage_path_unique").on(table.storagePath),
    index("receipt_objects_owner_idx").on(table.ownerAuthUserId),
  ],
);

export const priceReports = pgTable(
  "price_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    warungId: uuid("warung_id")
      .notNull()
      .references(() => warungs.id, { onDelete: "restrict" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    packagingOptionId: uuid("packaging_option_id")
      .notNull()
      .references(() => packagingOptions.id, { onDelete: "restrict" }),
    receiptObjectId: uuid("receipt_object_id").references(
      () => receiptObjects.id,
      { onDelete: "set null" },
    ),
    observedDate: date("observed_date").notNull(),
    quantityPackages: integer("quantity_packages").notNull(),
    unitsPerPackage: integer("units_per_package").notNull(),
    grossPriceIdr: integer("gross_price_idr").notNull(),
    discountIdr: integer("discount_idr").notNull().default(0),
    deliveryFeeIdr: integer("delivery_fee_idr").notNull().default(0),
    paymentTerms: text("payment_terms").notNull(),
    supplierType: text("supplier_type").notNull(),
    aggregationConsent: boolean("aggregation_consent").notNull(),
    status: reportStatusEnum("status").notNull().default("pending"),
    statusReason: text("status_reason"),
    duplicateFingerprint: text("duplicate_fingerprint").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    isDemo: boolean("is_demo").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("price_reports_warung_idempotency_unique").on(
      table.warungId,
      table.idempotencyKey,
    ),
    index("price_reports_product_date_idx").on(
      table.productId,
      table.observedDate,
    ),
    index("price_reports_fingerprint_idx").on(table.duplicateFingerprint),
  ],
);

export const normalizedObservations = pgTable(
  "normalized_observations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    priceReportId: uuid("price_report_id")
      .notNull()
      .references(() => priceReports.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    warungId: uuid("warung_id")
      .notNull()
      .references(() => warungs.id, { onDelete: "restrict" }),
    landedTotalIdr: integer("landed_total_idr").notNull(),
    baseUnitsTotal: integer("base_units_total").notNull(),
    unitPriceIdr: integer("unit_price_idr").notNull(),
    province: text("province").notNull(),
    city: text("city").notNull(),
    district: text("district").notNull(),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    verificationWeight: integer("verification_weight").notNull().default(50),
    completenessWeight: integer("completeness_weight").notNull().default(100),
    eligible: boolean("eligible").notNull().default(false),
    exclusionReason: text("exclusion_reason"),
    calculationVersion: text("calculation_version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("normalized_observations_report_unique").on(
      table.priceReportId,
    ),
    index("normalized_observations_benchmark_idx").on(
      table.productId,
      table.province,
      table.city,
      table.district,
      table.observedAt,
    ),
  ],
);

export const benchmarks = pgTable(
  "benchmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    province: text("province").notNull(),
    city: text("city").notNull(),
    district: text("district").notNull(),
    windowDays: integer("window_days").notNull(),
    status: benchmarkStatusEnum("status").notNull(),
    medianUnitPriceIdr: integer("median_unit_price_idr"),
    p25UnitPriceIdr: integer("p25_unit_price_idr"),
    p75UnitPriceIdr: integer("p75_unit_price_idr"),
    eligibleReportCount: integer("eligible_report_count").notNull(),
    independentWarungCount: integer("independent_warung_count").notNull(),
    confidenceScore: integer("confidence_score"),
    confidenceLabel: text("confidence_label"),
    latestObservationAt: timestamp("latest_observation_at", {
      withTimezone: true,
    }),
    calculationVersion: text("calculation_version").notNull(),
    computedAt: timestamp("computed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("benchmarks_scope_unique").on(
      table.productId,
      table.province,
      table.city,
      table.district,
      table.windowDays,
    ),
  ],
);

export const consents = pgTable(
  "consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerAuthUserId: uuid("owner_auth_user_id").notNull(),
    purpose: consentPurposeEnum("purpose").notNull(),
    policyVersion: text("policy_version").notNull(),
    grantedAt: timestamp("granted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    withdrawnAt: timestamp("withdrawn_at", { withTimezone: true }),
  },
  (table) => [
    index("consents_owner_purpose_idx").on(
      table.ownerAuthUserId,
      table.purpose,
    ),
  ],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorAuthUserId: uuid("actor_auth_user_id"),
    eventType: text("event_type").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    reasonCode: text("reason_code"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_events_entity_idx").on(table.entityType, table.entityId),
  ],
);

export const buyingOpportunities = pgTable(
  "buying_opportunities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    packagingOptionId: uuid("packaging_option_id")
      .notNull()
      .references(() => packagingOptions.id, { onDelete: "restrict" }),
    province: text("province").notNull(),
    city: text("city").notNull(),
    district: text("district").notNull(),
    targetQuantityPackages: integer("target_quantity_packages").notNull(),
    targetPriceIdr: integer("target_price_idr").notNull(),
    deadline: timestamp("deadline", { withTimezone: true }).notNull(),
    status: opportunityStatusEnum("status").notNull().default("OPEN"),
    organizerName: text("organizer_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("opportunities_area_idx").on(
      table.province,
      table.city,
      table.district,
      table.status,
    ),
  ],
);

export const buyingCommitments = pgTable(
  "buying_commitments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => buyingOpportunities.id, { onDelete: "cascade" }),
    warungId: uuid("warung_id")
      .notNull()
      .references(() => warungs.id, { onDelete: "restrict" }),
    quantityPackages: integer("quantity_packages").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("buying_commitments_opportunity_warung_idx").on(
      table.opportunityId,
      table.warungId,
    ),
  ],
);

export const supplierQuotes = pgTable(
  "supplier_quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => buyingOpportunities.id, { onDelete: "cascade" }),
    supplierName: text("supplier_name").notNull(),
    unitPriceIdr: integer("unit_price_idr").notNull(),
    deliveryFeeIdr: integer("delivery_fee_idr").notNull().default(0),
    minimumQuantityPackages: integer("minimum_quantity_packages").notNull(),
    validUntil: timestamp("valid_until", { withTimezone: true }).notNull(),
    terms: text("terms").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("supplier_quotes_opportunity_idx").on(table.opportunityId)],
);
