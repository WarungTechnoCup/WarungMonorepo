CREATE TYPE "public"."opportunity_status" AS ENUM('DRAFT', 'OPEN', 'TARGET_REACHED', 'QUOTE_REQUESTED', 'QUOTE_RECEIVED', 'ACCEPTED', 'FULFILLED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "buying_commitments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"warung_id" uuid NOT NULL,
	"quantity_packages" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "buying_opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"packaging_option_id" uuid NOT NULL,
	"province" text NOT NULL,
	"city" text NOT NULL,
	"district" text NOT NULL,
	"target_quantity_packages" integer NOT NULL,
	"target_price_idr" integer NOT NULL,
	"deadline" timestamp with time zone NOT NULL,
	"status" "opportunity_status" DEFAULT 'OPEN' NOT NULL,
	"organizer_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"supplier_name" text NOT NULL,
	"unit_price_idr" integer NOT NULL,
	"delivery_fee_idr" integer DEFAULT 0 NOT NULL,
	"minimum_quantity_packages" integer NOT NULL,
	"valid_until" timestamp with time zone NOT NULL,
	"terms" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "buying_commitments" ADD CONSTRAINT "buying_commitments_opportunity_id_buying_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."buying_opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buying_commitments" ADD CONSTRAINT "buying_commitments_warung_id_warungs_id_fk" FOREIGN KEY ("warung_id") REFERENCES "public"."warungs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buying_opportunities" ADD CONSTRAINT "buying_opportunities_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buying_opportunities" ADD CONSTRAINT "buying_opportunities_packaging_option_id_packaging_options_id_fk" FOREIGN KEY ("packaging_option_id") REFERENCES "public"."packaging_options"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD CONSTRAINT "supplier_quotes_opportunity_id_buying_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."buying_opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "buying_commitments_opportunity_warung_idx" ON "buying_commitments" USING btree ("opportunity_id","warung_id");--> statement-breakpoint
CREATE INDEX "opportunities_area_idx" ON "buying_opportunities" USING btree ("province","city","district","status");--> statement-breakpoint
CREATE INDEX "supplier_quotes_opportunity_idx" ON "supplier_quotes" USING btree ("opportunity_id");
--> statement-breakpoint
ALTER TABLE "buying_commitments" ADD CONSTRAINT "buying_commitments_positive_quantity" CHECK ("quantity_packages" > 0);
--> statement-breakpoint
ALTER TABLE "buying_opportunities" ADD CONSTRAINT "buying_opportunities_positive_targets" CHECK ("target_quantity_packages" > 0 AND "target_price_idr" > 0);
--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD CONSTRAINT "supplier_quotes_positive_values" CHECK ("unit_price_idr" > 0 AND "minimum_quantity_packages" > 0 AND "delivery_fee_idr" >= 0);
--> statement-breakpoint
ALTER TABLE "buying_opportunities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "buying_commitments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "supplier_quotes" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "buying_opportunities" FORCE ROW LEVEL SECURITY;
ALTER TABLE "buying_commitments" FORCE ROW LEVEL SECURITY;
ALTER TABLE "supplier_quotes" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "opportunities_public_read" ON "buying_opportunities" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "commitments_public_read" ON "buying_commitments" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "quotes_public_read" ON "supplier_quotes" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "commitments_owner_insert" ON "buying_commitments" FOR INSERT TO authenticated WITH CHECK (
	EXISTS (
		SELECT 1 FROM "warungs"
		WHERE "warungs"."id" = "buying_commitments"."warung_id"
		AND "warungs"."owner_auth_user_id" = auth.uid()
	)
);
--> statement-breakpoint
REVOKE ALL ON TABLE "buying_opportunities", "buying_commitments", "supplier_quotes" FROM anon, authenticated;
GRANT SELECT ON TABLE "buying_opportunities", "buying_commitments", "supplier_quotes" TO anon, authenticated;
GRANT INSERT ON TABLE "buying_commitments" TO authenticated;