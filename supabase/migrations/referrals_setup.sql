-- ==============================================================================
-- 1. CREATE REFERRALS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    service_interest TEXT NOT NULL CHECK (service_interest IN ('1-on-1 Coaching Track', 'Course Subscription', 'Enterprise Support')),
    urgency_level TEXT NOT NULL CHECK (urgency_level IN ('Low', 'Medium', 'High')),
    referral_reason TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Review', 'Accepted', 'Rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index frequently queried columns for performance
CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON public.referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON public.referrals(created_at DESC);

-- ==============================================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS) & APPLY POLICIES
-- ==============================================================================
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- 1. USER SELECT (Read): Users see their own; Admins see all
CREATE POLICY "Users can read own referrals, Admins can read all"
ON public.referrals
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 2. USER INSERT (Create): Authenticated users can insert their own referrals
CREATE POLICY "Users can insert own referrals"
ON public.referrals
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

-- 3. ADMIN UPDATE: Only admins can update status & admin_notes
CREATE POLICY "Admins can update referrals"
ON public.referrals
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 4. ADMIN DELETE: Only admins can delete referral records
CREATE POLICY "Admins can delete referrals"
ON public.referrals
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- ==============================================================================
-- 3. POSTGRESQL FUNCTION (RPC): search_and_sort_referrals
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.search_and_sort_referrals(
    search_query TEXT DEFAULT NULL,
    status_filter TEXT DEFAULT NULL,
    sort_by TEXT DEFAULT 'created_at',
    sort_order TEXT DEFAULT 'DESC'
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    client_name TEXT,
    client_email TEXT,
    client_phone TEXT,
    service_interest TEXT,
    urgency_level TEXT,
    referral_reason TEXT,
    status TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ,
    referrer_email TEXT,
    referrer_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Verify caller is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access Denied: Admin role required.';
    END IF;

    RETURN QUERY
    SELECT 
        r.id,
        r.user_id,
        r.client_name,
        r.client_email,
        r.client_phone,
        r.service_interest,
        r.urgency_level,
        r.referral_reason,
        r.status,
        r.admin_notes,
        r.created_at,
        p.email AS referrer_email,
        p.full_name AS referrer_name
    FROM public.referrals r
    LEFT JOIN public.profiles p ON r.user_id = p.id
    WHERE 
        -- Search query filter (matches client name, email, or service interest)
        (
            search_query IS NULL 
            OR search_query = '' 
            OR r.client_name ILIKE '%' || search_query || '%'
            OR r.client_email ILIKE '%' || search_query || '%'
            OR r.service_interest ILIKE '%' || search_query || '%'
        )
        -- Status filter (All, Pending, In Review, Accepted, Rejected)
        AND (
            status_filter IS NULL 
            OR status_filter = 'All' 
            OR status_filter = ''
            OR r.status = status_filter
        )
    ORDER BY
        -- Dynamic Sorting: Client Name
        CASE WHEN sort_by = 'client_name' AND UPPER(sort_order) = 'ASC' THEN r.client_name END ASC,
        CASE WHEN sort_by = 'client_name' AND UPPER(sort_order) = 'DESC' THEN r.client_name END DESC,
        -- Dynamic Sorting: Status
        CASE WHEN sort_by = 'status' AND UPPER(sort_order) = 'ASC' THEN r.status END ASC,
        CASE WHEN sort_by = 'status' AND UPPER(sort_order) = 'DESC' THEN r.status END DESC,
        -- Dynamic Sorting: Urgency Level
        CASE WHEN sort_by = 'urgency_level' AND UPPER(sort_order) = 'ASC' THEN r.urgency_level END ASC,
        CASE WHEN sort_by = 'urgency_level' AND UPPER(sort_order) = 'DESC' THEN r.urgency_level END DESC,
        -- Default Dynamic Sorting: Submission Date (created_at)
        CASE WHEN (sort_by = 'created_at' OR sort_by IS NULL) AND UPPER(sort_order) = 'ASC' THEN r.created_at END ASC,
        CASE WHEN (sort_by = 'created_at' OR sort_by IS NULL) AND (sort_order IS NULL OR UPPER(sort_order) = 'DESC') THEN r.created_at END DESC;
END;
$$;
