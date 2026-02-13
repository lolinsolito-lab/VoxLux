-- 004_add_diploma_background.sql

-- 1. Add column to courses table
ALTER TABLE "courses" 
ADD COLUMN IF NOT EXISTS "diploma_background_url" TEXT;

-- 2. Create Storage Bucket for Diplomas if it doesn't exist
-- Note: Storage buckets are usually created via the API/Dashboard, but we can try to insert into storage.buckets if we have permissions.
-- Safe approach: We will assume the bucket needs to be created or is created manually, but we can try to script it for completeness if the extension allows.
-- However, standard Supabase migrations often focus on public schema. 
-- Let's add a comment for manual creation if strictly SQL-based creation isn't supported in this environment, 
-- but we can try inserting into storage.buckets.

INSERT INTO storage.buckets (id, name, public)
VALUES ('diplomas', 'diplomas', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS for Storage
-- Allow public access to read
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'diplomas' );

-- Allow authenticated users (Admins) to upload
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'diplomas' AND
  auth.role() = 'authenticated'
);

-- Allow admins to update/delete
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'diplomas' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'diplomas' AND auth.role() = 'authenticated' );
