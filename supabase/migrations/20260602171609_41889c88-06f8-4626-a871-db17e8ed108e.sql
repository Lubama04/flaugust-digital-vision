
-- Add missing columns to existing tables
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'blog';
ALTER TABLE public.portfolio ADD COLUMN IF NOT EXISTS images_urls TEXT[] DEFAULT '{}';

-- ACTUALITES
CREATE TABLE IF NOT EXISTS public.actualites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT DEFAULT 'Projet',
  custom_category TEXT,
  images_urls TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

GRANT SELECT ON public.actualites TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.actualites TO authenticated;
GRANT ALL ON public.actualites TO service_role;

ALTER TABLE public.actualites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read actualites"
ON public.actualites FOR SELECT
USING (published = true);

CREATE POLICY "Admin all actualites"
ON public.actualites FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- PAGE VIEWS
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  referrer TEXT,
  device TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT ALL ON public.page_views TO service_role;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert page_views"
ON public.page_views FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin all page_views"
ON public.page_views FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- AI DOCUMENTS
CREATE TABLE IF NOT EXISTS public.ai_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  extracted_text TEXT,
  generated_title TEXT,
  generated_content TEXT,
  target_type TEXT DEFAULT 'blog',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_documents TO authenticated;
GRANT ALL ON public.ai_documents TO service_role;

ALTER TABLE public.ai_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin all ai_documents"
ON public.ai_documents FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
