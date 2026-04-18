
-- Restrict admin access to a single admin email instead of any authenticated user
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND lower(email) = 'contact@flaugustbusiness.com'
  );
$$;

-- contact_messages: drop open insert + restrict admin
DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin all contact_messages" ON public.contact_messages;
CREATE POLICY "Admin all contact_messages" ON public.contact_messages
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- portfolio
DROP POLICY IF EXISTS "Admin all portfolio" ON public.portfolio;
CREATE POLICY "Admin all portfolio" ON public.portfolio
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- posts
DROP POLICY IF EXISTS "Admin all posts" ON public.posts;
CREATE POLICY "Admin all posts" ON public.posts
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- services
DROP POLICY IF EXISTS "Admin all services" ON public.services;
CREATE POLICY "Admin all services" ON public.services
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- site_settings
DROP POLICY IF EXISTS "Admin all site_settings" ON public.site_settings;
CREATE POLICY "Admin all site_settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- stats
DROP POLICY IF EXISTS "Admin all stats" ON public.stats;
CREATE POLICY "Admin all stats" ON public.stats
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- testimonials
DROP POLICY IF EXISTS "Admin all testimonials" ON public.testimonials;
CREATE POLICY "Admin all testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Storage: explicit public SELECT policy on media bucket (kept public for site assets)
DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'media');
