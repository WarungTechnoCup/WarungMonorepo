INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
CREATE POLICY "receipts_owner_insert"
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'receipts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
--> statement-breakpoint
CREATE POLICY "receipts_owner_select"
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'receipts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
--> statement-breakpoint
CREATE POLICY "receipts_owner_update"
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'receipts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
--> statement-breakpoint
CREATE POLICY "receipts_owner_delete"
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'receipts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
