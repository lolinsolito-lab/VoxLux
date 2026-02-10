-- FIX: Add explicit foreign key relationship between modules and courses
-- This is required for the Supabase API to recognize the relationship in joins
-- e.g. .select('*, modules(count)')

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'modules_course_id_fkey'
    ) THEN
        ALTER TABLE "public"."modules"
        ADD CONSTRAINT "modules_course_id_fkey"
        FOREIGN KEY ("course_id")
        REFERENCES "public"."courses" ("id")
        ON DELETE CASCADE;
    END IF;
END
$$;

-- Reload schema cache (notify PostgREST)
NOTIFY pgrst, 'reload config';
