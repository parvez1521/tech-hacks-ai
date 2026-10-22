-- =============================================================================
-- Tech Hacks AI — Production PostgreSQL Schema for Supabase
-- =============================================================================
-- This file contains the complete database schema for durable persistence of
-- community tool & guide submissions, editorial moderation, and published items.
--
-- How to apply:
-- 1. Create a project at https://supabase.com
-- 2. Open your project dashboard -> SQL Editor -> New Query
-- 3. Paste this entire file and click "Run" (CMD/CTRL + Enter)
-- 4. Copy your Project URL & Service Role Key into your Vercel Environment Variables:
--    - SUPABASE_URL=https://<your-project-ref>.supabase.co
--    - SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key>
-- =============================================================================

-- 1. Submissions Queue Table
CREATE TABLE IF NOT EXISTS public.techhacks_submissions (
    id VARCHAR(120) PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('tool', 'guide')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tool_data JSONB,
    guide_data JSONB,
    potential_duplicate BOOLEAN DEFAULT FALSE,
    duplicate_reason TEXT,
    duplicate_matches JSONB DEFAULT '[]'::jsonb,
    moderator_notes TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    published_slug VARCHAR(120),
    published_at TIMESTAMPTZ
);

-- Performance Indexes for Moderation Queue & Filtering
CREATE INDEX IF NOT EXISTS idx_techhacks_sub_status ON public.techhacks_submissions(status);
CREATE INDEX IF NOT EXISTS idx_techhacks_sub_type ON public.techhacks_submissions(type);
CREATE INDEX IF NOT EXISTS idx_techhacks_sub_created_at ON public.techhacks_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_techhacks_sub_pub_slug ON public.techhacks_submissions(published_slug);

-- 2. Published Additions Table (Catalog Overlays)
CREATE TABLE IF NOT EXISTS public.techhacks_published_additions (
    key VARCHAR(50) PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{"tools":[],"guides":[],"lastUpdated":""}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Initial Root Entry for Published Additions
INSERT INTO public.techhacks_published_additions (key, data, updated_at)
VALUES (
    'root',
    '{"tools":[],"guides":[],"lastUpdated":"2026-10-18T10:00:00.000Z"}'::jsonb,
    NOW()
)
ON CONFLICT (key) DO NOTHING;

-- 3. Daily Discoveries & Featured Tools Table
CREATE TABLE IF NOT EXISTS public.techhacks_discoveries (
    id VARCHAR(120) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    website_url VARCHAR(500) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(80),
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes for Discoveries
CREATE INDEX IF NOT EXISTS idx_techhacks_disc_status ON public.techhacks_discoveries(status);
CREATE INDEX IF NOT EXISTS idx_techhacks_disc_created_at ON public.techhacks_discoveries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_techhacks_disc_featured ON public.techhacks_discoveries(is_featured);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.techhacks_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.techhacks_published_additions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.techhacks_discoveries ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies

-- techhacks_submissions: Only service_role can access (protected backend API)
DROP POLICY IF EXISTS "Service role full access on submissions" ON public.techhacks_submissions;
CREATE POLICY "Service role full access on submissions"
ON public.techhacks_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- techhacks_published_additions: Public can read, only service_role can write
DROP POLICY IF EXISTS "Public can view published additions" ON public.techhacks_published_additions;
CREATE POLICY "Public can view published additions"
ON public.techhacks_published_additions
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Service role full access on published additions" ON public.techhacks_published_additions;
CREATE POLICY "Service role full access on published additions"
ON public.techhacks_published_additions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- techhacks_discoveries: Public can read published items; service_role has full access
DROP POLICY IF EXISTS "Public can view published discoveries" ON public.techhacks_discoveries;
CREATE POLICY "Public can view published discoveries"
ON public.techhacks_discoveries
FOR SELECT
TO public
USING (status = 'published');

DROP POLICY IF EXISTS "Service role full access on discoveries" ON public.techhacks_discoveries;
CREATE POLICY "Service role full access on discoveries"
ON public.techhacks_discoveries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Prompt Library overlay. Public visitors may only read published recipes;
-- every create/edit/delete operation goes through the ADMIN_SECRET-protected API.
CREATE TABLE IF NOT EXISTS public.techhacks_prompts (
    id VARCHAR(160) PRIMARY KEY,
    slug VARCHAR(180) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_techhacks_prompts_status ON public.techhacks_prompts(status);
CREATE INDEX IF NOT EXISTS idx_techhacks_prompts_updated_at ON public.techhacks_prompts(updated_at DESC);
ALTER TABLE public.techhacks_prompts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.techhacks_prompts FROM anon, authenticated;
GRANT SELECT ON public.techhacks_prompts TO anon, authenticated;
GRANT ALL ON public.techhacks_prompts TO service_role;

CREATE OR REPLACE FUNCTION public.techhacks_set_prompt_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS techhacks_prompts_updated_at ON public.techhacks_prompts;
CREATE TRIGGER techhacks_prompts_updated_at
BEFORE UPDATE ON public.techhacks_prompts
FOR EACH ROW EXECUTE FUNCTION public.techhacks_set_prompt_updated_at();

DROP POLICY IF EXISTS "Public can view published prompts" ON public.techhacks_prompts;
CREATE POLICY "Public can view published prompts"
ON public.techhacks_prompts
FOR SELECT
TO anon, authenticated
USING (status = 'published');

DROP POLICY IF EXISTS "Service role full access on prompts" ON public.techhacks_prompts;
CREATE POLICY "Service role full access on prompts"
ON public.techhacks_prompts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.techhacks_prompt_categories (
    slug VARCHAR(120) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(500) NOT NULL DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 100 CHECK (display_order BETWEEN 0 AND 10000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.techhacks_prompt_categories ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.techhacks_prompt_categories FROM anon, authenticated;
GRANT SELECT ON public.techhacks_prompt_categories TO anon, authenticated;
GRANT ALL ON public.techhacks_prompt_categories TO service_role;
DROP POLICY IF EXISTS "Public can view prompt categories" ON public.techhacks_prompt_categories;
CREATE POLICY "Public can view prompt categories"
ON public.techhacks_prompt_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Service role full access on prompt categories" ON public.techhacks_prompt_categories;
CREATE POLICY "Service role full access on prompt categories"
ON public.techhacks_prompt_categories FOR ALL TO service_role USING (true) WITH CHECK (true);

