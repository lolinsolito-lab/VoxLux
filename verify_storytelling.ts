
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load env
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function verify() {
    console.log("Checking for 'matrice-1' course...");
    const { data: course, error } = await supabase.from('courses').select('id, title').eq('slug', 'matrice-1').single();

    if (error || !course) {
        console.error("Course 'matrice-1' NOT FOUND in DB!");
        // Try 'storytelling' slug?
        const { data: course2 } = await supabase.from('courses').select('id, title').eq('id', 'matrice-1').single();
        if (course2) console.log("Found by ID 'matrice-1':", course2);
        else return;
    } else {
        console.log("Found course:", course);
    }

    const courseId = course?.id || 'matrice-1';

    const { count, error: countError } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);

    console.log(`Modules count for ${courseId}: ${count}`);

    if (count === 0) {
        console.log("⚠️ STORYTELLING DATA MISSING!");
    } else {
        console.log("✅ STORYTELLING DATA PRESENT!");
    }
}

verify();
