-- FIX: Convert course_id to UUID and add Foreign Key relationship
-- This resolves the "incompatible types: text and uuid" error

BEGIN;

-- 1. Convert the column type from TEXT to UUID
-- This assumes all values in course_id are valid UUID strings (which they should be from our seeds)
ALTER TABLE "public"."modules"
ALTER COLUMN "course_id" TYPE uuid USING "course_id"::uuid;

-- 2. Add the Foreign Key Constraint
-- Now that both columns are UUID, this will work
ALTER TABLE "public"."modules"
ADD CONSTRAINT "modules_course_id_fkey"
FOREIGN KEY ("course_id")
REFERENCES "public"."courses" ("id")
ON DELETE CASCADE;

COMMIT;

-- Reload schema cache
NOTIFY pgrst, 'reload config';
