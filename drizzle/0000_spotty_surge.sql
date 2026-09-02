CREATE TYPE "public"."benchmark_status" AS ENUM('insufficient', 'available');--> statement-breakpoint
CREATE TYPE "public"."consent_purpose" AS ENUM('anonymous_aggregation', 'receipt_storage');--> statement-breakpoint
CREATE TYPE "public"."price_report_status" AS ENUM('pending', 'included', 'flagged', 'excluded');--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_auth_user_id" uuid,
	"event_type" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"reason_code" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "benchmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"province" text NOT NULL,
	"city" text NOT NULL,
	"district" text NOT NULL,
	"window_days" integer NOT NULL,
	"status" "benchmark_status" NOT NULL,
	"median_unit_price_idr" integer,
	"p25_unit_price_idr" integer,
	"p75_unit_price_idr" integer,
	"eligible_report_count" integer NOT NULL,
	"independent_warung_count" integer NOT NULL,
	"confidence_score" integer,
	"confidence_label" text,
	"latest_observation_at" timestamp with time zone,
	"calculation_version" text NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_auth_user_id" uuid NOT NULL,
	"purpose" "consent_purpose" NOT NULL,
	"policy_version" text NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"withdrawn_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "normalized_observations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price_report_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"warung_id" uuid NOT NULL,
	"landed_total_idr" integer NOT NULL,
	"base_units_total" integer NOT NULL,
	"unit_price_idr" integer NOT NULL,
	"province" text NOT NULL,
	"city" text NOT NULL,
	"district" text NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"verification_weight" integer DEFAULT 50 NOT NULL,
	"completeness_weight" integer DEFAULT 100 NOT NULL,
	"eligible" boolean DEFAULT false NOT NULL,
	"exclusion_reason" text,
	"calculation_version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packaging_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"label" text NOT NULL,
	"units_per_package" integer NOT NULL,
	"base_unit" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warung_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"packaging_option_id" uuid NOT NULL,
	"receipt_object_id" uuid,
	"observed_date" date NOT NULL,
	"quantity_packages" integer NOT NULL,
	"units_per_package" integer NOT NULL,
	"gross_price_idr" integer NOT NULL,
	"discount_idr" integer DEFAULT 0 NOT NULL,
	"delivery_fee_idr" integer DEFAULT 0 NOT NULL,
	"payment_terms" text NOT NULL,
	"supplier_type" text NOT NULL,
	"aggregation_consent" boolean NOT NULL,
	"status" "price_report_status" DEFAULT 'pending' NOT NULL,
	"status_reason" text,
	"duplicate_fingerprint" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"base_unit" text NOT NULL,
	"description" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipt_objects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_auth_user_id" uuid NOT NULL,
	"storage_path" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"retention_until" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warungs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_auth_user_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"province" text NOT NULL,
	"city" text NOT NULL,
	"district" text NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "benchmarks" ADD CONSTRAINT "benchmarks_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "normalized_observations" ADD CONSTRAINT "normalized_observations_price_report_id_price_reports_id_fk" FOREIGN KEY ("price_report_id") REFERENCES "public"."price_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "normalized_observations" ADD CONSTRAINT "normalized_observations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "normalized_observations" ADD CONSTRAINT "normalized_observations_warung_id_warungs_id_fk" FOREIGN KEY ("warung_id") REFERENCES "public"."warungs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packaging_options" ADD CONSTRAINT "packaging_options_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_reports" ADD CONSTRAINT "price_reports_warung_id_warungs_id_fk" FOREIGN KEY ("warung_id") REFERENCES "public"."warungs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_reports" ADD CONSTRAINT "price_reports_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_reports" ADD CONSTRAINT "price_reports_packaging_option_id_packaging_options_id_fk" FOREIGN KEY ("packaging_option_id") REFERENCES "public"."packaging_options"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_reports" ADD CONSTRAINT "price_reports_receipt_object_id_receipt_objects_id_fk" FOREIGN KEY ("receipt_object_id") REFERENCES "public"."receipt_objects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_events_entity_idx" ON "audit_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "benchmarks_scope_unique" ON "benchmarks" USING btree ("product_id","province","city","district","window_days");--> statement-breakpoint
CREATE INDEX "consents_owner_purpose_idx" ON "consents" USING btree ("owner_auth_user_id","purpose");--> statement-breakpoint
CREATE UNIQUE INDEX "normalized_observations_report_unique" ON "normalized_observations" USING btree ("price_report_id");--> statement-breakpoint
CREATE INDEX "normalized_observations_benchmark_idx" ON "normalized_observations" USING btree ("product_id","province","city","district","observed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "packaging_product_label_unique" ON "packaging_options" USING btree ("product_id","label");--> statement-breakpoint
CREATE UNIQUE INDEX "price_reports_warung_idempotency_unique" ON "price_reports" USING btree ("warung_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "price_reports_product_date_idx" ON "price_reports" USING btree ("product_id","observed_date");--> statement-breakpoint
CREATE INDEX "price_reports_fingerprint_idx" ON "price_reports" USING btree ("duplicate_fingerprint");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_unique" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "receipt_objects_storage_path_unique" ON "receipt_objects" USING btree ("storage_path");--> statement-breakpoint
CREATE INDEX "receipt_objects_owner_idx" ON "receipt_objects" USING btree ("owner_auth_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "warungs_owner_auth_user_id_unique" ON "warungs" USING btree ("owner_auth_user_id");--> statement-breakpoint
CREATE INDEX "warungs_benchmark_area_idx" ON "warungs" USING btree ("province","city","district");
--> statement-breakpoint
ALTER TABLE "packaging_options" ADD CONSTRAINT "packaging_units_positive" CHECK ("units_per_package" > 0);
--> statement-breakpoint
ALTER TABLE "price_reports" ADD CONSTRAINT "price_reports_values_valid" CHECK (
	"quantity_packages" > 0
	AND "units_per_package" > 0
	AND "gross_price_idr" > 0
	AND "discount_idr" >= 0
	AND "delivery_fee_idr" >= 0
	AND ("gross_price_idr" - "discount_idr" + "delivery_fee_idr") > 0
);
--> statement-breakpoint
ALTER TABLE "normalized_observations" ADD CONSTRAINT "normalized_values_positive" CHECK (
	"landed_total_idr" > 0 AND "base_units_total" > 0 AND "unit_price_idr" > 0
);
--> statement-breakpoint
ALTER TABLE "benchmarks" ADD CONSTRAINT "benchmark_publication_threshold" CHECK (
	(
		"status" = 'insufficient'
		AND "independent_warung_count" < 5
		AND "median_unit_price_idr" IS NULL
		AND "p25_unit_price_idr" IS NULL
		AND "p75_unit_price_idr" IS NULL
	)
	OR (
		"status" = 'available'
		AND "independent_warung_count" >= 5
		AND "median_unit_price_idr" IS NOT NULL
		AND "p25_unit_price_idr" IS NOT NULL
		AND "p75_unit_price_idr" IS NOT NULL
	)
);
--> statement-breakpoint
ALTER TABLE "warungs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "packaging_options" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "receipt_objects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "price_reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "normalized_observations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "benchmarks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_events" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "warungs" FORCE ROW LEVEL SECURITY;
ALTER TABLE "receipt_objects" FORCE ROW LEVEL SECURITY;
ALTER TABLE "price_reports" FORCE ROW LEVEL SECURITY;
ALTER TABLE "normalized_observations" FORCE ROW LEVEL SECURITY;
ALTER TABLE "consents" FORCE ROW LEVEL SECURITY;
ALTER TABLE "audit_events" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "products_public_read" ON "products" FOR SELECT TO anon, authenticated USING ("is_active" = true);
CREATE POLICY "packaging_public_read" ON "packaging_options" FOR SELECT TO anon, authenticated USING ("is_active" = true);
CREATE POLICY "benchmarks_public_read" ON "benchmarks" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "warungs_owner_read" ON "warungs" FOR SELECT TO authenticated USING ("owner_auth_user_id" = auth.uid());
CREATE POLICY "receipts_owner_read" ON "receipt_objects" FOR SELECT TO authenticated USING ("owner_auth_user_id" = auth.uid());
CREATE POLICY "reports_owner_read" ON "price_reports" FOR SELECT TO authenticated USING (
	EXISTS (
		SELECT 1 FROM "warungs"
		WHERE "warungs"."id" = "price_reports"."warung_id"
		AND "warungs"."owner_auth_user_id" = auth.uid()
	)
);
CREATE POLICY "consents_owner_read" ON "consents" FOR SELECT TO authenticated USING ("owner_auth_user_id" = auth.uid());
--> statement-breakpoint
REVOKE ALL ON TABLE "warungs", "receipt_objects", "price_reports", "normalized_observations", "consents", "audit_events" FROM anon, authenticated;
GRANT SELECT ON TABLE "products", "packaging_options", "benchmarks" TO anon, authenticated;
