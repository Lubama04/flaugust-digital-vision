DROP POLICY IF EXISTS "Public read media" ON storage.objects;

CREATE POLICY "Admin list media"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'media' AND is_admin());