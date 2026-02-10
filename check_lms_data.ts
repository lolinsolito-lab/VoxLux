
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env vars from .env or .env.local
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env/.env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('--- CHECKING COURSES ---');
    const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('id, slug, title');

    if (courseError) {
        console.error('Error fetching courses:', courseError);
        return;
    }

    console.log('Found courses:', JSON.stringify(courses, null, 2));

    for (const course of courses) {
        if (['matrice-1', 'matrice-2'].includes(course.slug)) {
            console.log(`\n--- CHECKING MODULES FOR ${course.slug} (${course.id}) ---`);
            const { data: modules, error: moduleError } = await supabase
                .from('modules')
                .select('id, title, order_index, lessons(count)')
                .eq('course_id', course.id)
                .order('order_index');

            if (moduleError) {
                console.error('Error fetching modules:', moduleError);
            } else {
                console.log(`Found ${modules.length} modules.`);
                modules.forEach(m => {
                    console.log(`- [${m.order_index}] ${m.title} (Lessons: ${m.lessons[0]?.count || 0})`);
                });
            }
        }
    }
}

checkData();
