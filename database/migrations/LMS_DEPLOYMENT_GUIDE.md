# 🗄️ LMS Database Schema Deployment Guide

## 📋 Pre-Flight Checklist

Before running the migration, verify:

- [ ] You have access to Supabase SQL Editor
- [ ] You have admin permissions on the database
- [ ] You have a backup (Supabase auto-backs up, but good to verify)
- [ ] No users are actively using the platform (or minimal traffic)

---

## 🚀 Step-by-Step Deployment

### **Step 1: Open Supabase SQL Editor**

1. Go to [https://supabase.com](https://supabase.com)
2. Select your Vox Lux project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

---

### **Step 2: Copy & Paste Migration Script**

1. Open `database/migrations/002_lms_schema.sql`
2. Copy the ENTIRE file content
3. Paste into Supabase SQL Editor

---

### **Step 3: Review the Script**

**What it does:**
- ✅ Creates 3 new tables (`courses`, `course_modules`, `user_module_progress`)
- ✅ Adds indexes for performance
- ✅ Sets up Row Level Security (RLS) policies
- ✅ Creates helper functions for progress calculation
- ✅ Auto-update triggers for `updated_at` columns

**What it DOESN'T do:**
- ❌ Delete any existing tables
- ❌ Modify existing data
- ❌ Break current functionality

---

### **Step 4: Run the Migration**

1. Click **RUN** button in Supabase SQL Editor
2. Wait for completion (should take 2-5 seconds)
3. Check for green success message

**Expected Output:**
```
Success. No rows returned.
```

If you see errors, **STOP** and check the error message.

---

### **Step 5: Verify Tables Were Created**

Run this verification query:

```sql
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('courses', 'course_modules', 'user_module_progress')
ORDER BY table_name;
```

**Expected Result:**
```
table_name               | column_count
-------------------------|-------------
courses                  | 12
course_modules           | 13
user_module_progress     | 10
```

---

### **Step 6: Verify RLS Policies**

Run this query to check RLS policies:

```sql
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE tablename IN ('courses', 'course_modules', 'user_module_progress')
ORDER BY tablename, policyname;
```

**Expected Result:**
Should see policies like:
- `Anyone can view published courses`
- `Admins can manage all courses`
- `Users can view their own progress`
- etc.

---

### **Step 7: Test with Sample Data (Optional)**

Uncomment the sample data section in the migration script and run:

```sql
-- Insert test course
INSERT INTO courses (title, slug, description, tier_required, status, duration_hours)
VALUES (
    'Test Course',
    'test-course',
    'This is a test course to verify the schema works',
    ARRAY['matrice_1'],
    'published',
    10
)
RETURNING *;

-- Insert test module
INSERT INTO course_modules (course_id, title, module_order, content_type, xp_reward)
SELECT 
    id,
    'Test Module 1',
    1,
    'lesson',
    100
FROM courses
WHERE slug = 'test-course'
RETURNING *;
```

**Expected Result:**
Should return the inserted row data with generated UUIDs.

---

### **Step 8: Test Progress Tracking**

Insert test progress (replace `YOUR_USER_ID` with a real user ID):

```sql
INSERT INTO user_module_progress (user_id, module_id, course_id, status, progress_percentage)
SELECT 
    'YOUR_USER_ID'::uuid,
    cm.id,
    c.id,
    'in_progress',
    50
FROM courses c
JOIN course_modules cm ON cm.course_id = c.id
WHERE c.slug = 'test-course'
LIMIT 1
RETURNING *;
```

---

### **Step 9: Test Helper Function**

Test the course completion calculation:

```sql
SELECT calculate_course_completion(
    'YOUR_USER_ID'::uuid,
    (SELECT id FROM courses WHERE slug = 'test-course')
) as completion_percentage;
```

**Expected Result:**
Should return a number between 0-100.

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] All 3 tables exist
- [ ] Column counts match expected
- [ ] RLS policies are active
- [ ] Helper functions work
- [ ] Sample data can be inserted
- [ ] Progress tracking works

---

## 🔙 Rollback Instructions

**⚠️ ONLY USE IF SOMETHING WENT WRONG**

If you need to completely remove the LMS schema:

```sql
-- Drop all policies
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view modules of published courses" ON course_modules;
DROP POLICY IF EXISTS "Admins can manage all modules" ON course_modules;
DROP POLICY IF EXISTS "Users can view their own progress" ON user_module_progress;
DROP POLICY IF EXISTS "Users can manage their own progress" ON user_module_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_module_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON user_module_progress;

-- Drop triggers
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_course_modules_updated_at ON course_modules;
DROP TRIGGER IF EXISTS update_user_module_progress_updated_at ON user_module_progress;

-- Drop functions
DROP FUNCTION IF EXISTS calculate_course_completion(UUID, UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (CASCADE will remove foreign key constraints)
DROP TABLE IF EXISTS user_module_progress CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
```

---

## 🎯 Next Steps After Successful Deployment

Once schema is deployed:

1. ✅ Build `AdminCourses.tsx` page
2. ✅ Create course management UI
3. ✅ Build module builder
4. ✅ Integrate with frontend

---

## 💡 Tips

- **Backups**: Supabase auto-backs up daily. Manual backup: Database → Backups
- **SQL Editor History**: Your queries are saved in SQL Editor history
- **RLS Testing**: Use Supabase Auth to test RLS policies work correctly
- **Performance**: Indexes are already added for optimal query performance

---

**Ready to deploy?** Follow the steps above and verify each one! 🚀
