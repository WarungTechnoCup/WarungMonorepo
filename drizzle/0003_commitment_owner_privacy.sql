DROP POLICY "commitments_public_read" ON "buying_commitments";
--> statement-breakpoint
REVOKE SELECT ON TABLE "buying_commitments" FROM anon;
--> statement-breakpoint
GRANT SELECT ("id", "owner_auth_user_id") ON TABLE "warungs" TO authenticated;
--> statement-breakpoint
CREATE POLICY "commitments_owner_read" ON "buying_commitments" FOR SELECT TO authenticated USING (
	EXISTS (
		SELECT 1 FROM "warungs"
		WHERE "warungs"."id" = "buying_commitments"."warung_id"
		AND "warungs"."owner_auth_user_id" = auth.uid()
	)
);
