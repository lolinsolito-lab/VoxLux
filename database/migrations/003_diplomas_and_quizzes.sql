-- 003_diplomas_and_quizzes.sql

-- 1. Align Schema with Codebase (Modules & Lessons)
-- If course_modules exists (from 002), we might need to drop it or rename it.
-- Assuming we want to start fresh with the correct structure:

DROP TABLE IF EXISTS "course_modules" CASCADE;

-- Create 'modules' table
CREATE TABLE IF NOT EXISTS "modules" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "course_id" UUID REFERENCES "courses"("id") ON DELETE CASCADE,
    "slug" TEXT UNIQUE, -- Frontend ID link (e.g. 'm1-1')  <-- This line is ignored if table exists
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "is_locked" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Force add slug column if table already existed without it
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;

-- Create 'lessons' table
CREATE TABLE IF NOT EXISTS "lessons" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "module_id" UUID REFERENCES "modules"("id") ON DELETE CASCADE,
    "slug" TEXT UNIQUE, -- Frontend ID link
    "title" TEXT NOT NULL,
    "description" TEXT,
    "video_url" TEXT,
    "video_provider" TEXT DEFAULT 'custom',
    "duration_minutes" INTEGER DEFAULT 0,
    "order_index" INTEGER DEFAULT 0,
    "resources" JSONB DEFAULT '[]'::jsonb,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Force add slug column if table already existed without it
ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;

-- 2. Create 'quizzes' table
CREATE TABLE IF NOT EXISTS "quizzes" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "module_id" UUID REFERENCES "modules"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "passing_score" INTEGER DEFAULT 80,
    "questions" JSONB DEFAULT '[]'::jsonb,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("module_id") -- One quiz per module
);

-- 3. Create 'quiz_results' table (TRACK USER ATTEMPTS)
CREATE TABLE IF NOT EXISTS "quiz_results" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "user_id" UUID REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    "quiz_id" UUID REFERENCES "quizzes"("id") ON DELETE CASCADE,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN DEFAULT false,
    "answers" JSONB DEFAULT '[]'::jsonb, -- Store user's selected options for review
    "completed_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create 'user_diplomas' table
CREATE TABLE IF NOT EXISTS "user_diplomas" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "user_id" UUID REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    "course_id" UUID REFERENCES "courses"("id") ON DELETE CASCADE,
    "diploma_template_id" TEXT NOT NULL,
    "awarded_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "score" INTEGER,
    "metadata" JSONB DEFAULT '{}'::jsonb,
    UNIQUE("user_id", "course_id")
);

-- 5. Update 'courses' table for Diploma settings
ALTER TABLE "courses" 
ADD COLUMN IF NOT EXISTS "diploma_requirements" JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS "module_count" INTEGER DEFAULT 0; -- Optional cache, or we use count() query


-- 6. Add RLS Policies (Basic examples)
ALTER TABLE "modules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lessons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quizzes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quiz_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_diplomas" ENABLE ROW LEVEL SECURITY;

-- Policies for Modules/Lessons/Quizzes: Public Read, Admin Write
DROP POLICY IF EXISTS "Public Read Modules" ON "modules";
CREATE POLICY "Public Read Modules" ON "modules" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Write Modules" ON "modules";
CREATE POLICY "Admin Write Modules" ON "modules" FOR ALL USING (
  auth.role() = 'service_role' OR 
  (auth.jwt() ->> 'email') IN ('jaramichael@hotmail.com', 'admin@voxlux.com')
);

DROP POLICY IF EXISTS "Public Read Lessons" ON "lessons";
CREATE POLICY "Public Read Lessons" ON "lessons" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Write Lessons" ON "lessons";
CREATE POLICY "Admin Write Lessons" ON "lessons" FOR ALL USING (
  auth.role() = 'service_role' OR 
  (auth.jwt() ->> 'email') IN ('jaramichael@hotmail.com', 'admin@voxlux.com')
);

DROP POLICY IF EXISTS "Public Read Quizzes" ON "quizzes";
CREATE POLICY "Public Read Quizzes" ON "quizzes" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Write Quizzes" ON "quizzes";
CREATE POLICY "Admin Write Quizzes" ON "quizzes" FOR ALL USING (
  auth.role() = 'service_role' OR 
  (auth.jwt() ->> 'email') IN ('jaramichael@hotmail.com', 'admin@voxlux.com')
);

-- Policies for Quiz Results
DROP POLICY IF EXISTS "User Read Own Results" ON "quiz_results";
CREATE POLICY "User Read Own Results" ON "quiz_results" FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User Insert Own Results" ON "quiz_results";
CREATE POLICY "User Insert Own Results" ON "quiz_results" FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin View All Results" ON "quiz_results";
CREATE POLICY "Admin View All Results" ON "quiz_results" FOR SELECT USING (
  auth.role() = 'service_role' OR 
  (auth.jwt() ->> 'email') IN ('jaramichael@hotmail.com', 'admin@voxlux.com')
);

-- Policies for User Diplomas
DROP POLICY IF EXISTS "User Read Diplomas" ON "user_diplomas";
CREATE POLICY "User Read Diplomas" ON "user_diplomas" FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System Write Diplomas" ON "user_diplomas";
CREATE POLICY "System Write Diplomas" ON "user_diplomas" FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "User Insert Own Diplomas" ON "user_diplomas";
CREATE POLICY "User Insert Own Diplomas" ON "user_diplomas" FOR INSERT WITH CHECK (auth.uid() = user_id);
