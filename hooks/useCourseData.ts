import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Course, Mastermind } from '../services/courses';
import { COURSES as HARDCODED_COURSES } from '../services/courses';

// Extend the Course type to match DB schema if needed, 
// but for now we try to map DB response to the existing frontend type.

export const useCourseData = (courseId: string) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLegacy, setIsLegacy] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchCourseData = async () => {
            try {
                setLoading(true);

                // 1. Try to fetch from Supabase
                const { data: dbCourse, error: dbError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('slug', courseId)
                    .single();

                if (dbError || !dbCourse) {
                    console.warn(`Course ${courseId} not found in DB, falling back to legacy.`);
                    throw new Error('Fallback to legacy');
                }

                // 2. Fetch Modules
                const { data: dbModules, error: modulesError } = await supabase
                    .from('course_modules')
                    .select('*')
                    .eq('course_id', courseId)
                    .order('module_order', { ascending: true });

                if (modulesError) {
                    console.error('Error fetching modules:', modulesError);
                }

                // 3. Construct the Course Object compatible with Frontend
                // We need to group modules into "Masterminds" (Worlds) based on logic.
                // Since the DB is flat (modules list), and the Frontend expects tiered Masterminds,
                // we need a strategy.

                // STRATEGY: 
                // If the course is "Matrice 1" or "Matrice 2", we might rely on the DB 'group_title' or similar 
                // if we added it, OR we just map them by 3s (10 worlds * 3 modules = 30 modules).

                // Let's assume the DB has data. For now, if the DB structure is too different, 
                // we might fallback to hardcoded for the *Structure* but fill details from DB?
                // Or we try to build the Masterminds dynamically.

                const masterminds: Mastermind[] = [];
                const modules = dbModules || [];

                // Grouping Logic (Assuming 3 modules per world/mastermind for Matrice courses)
                // This is a heuristic. Ideally, we should have a 'mastermind_id' in the modules table or a separate table.
                // Looking at seed_lms_courses.sql, we have 'module_type' but maybe no explicit mastermind container.
                // Wait, seed data didn't have explicit masterminds table, just a list of modules.

                // Let's verify if we can reconstruct the 10 worlds.
                // If we have 30 modules, we can chunk them.

                const modulesPerWorld = 3;
                const totalWorlds = 10;

                for (let i = 0; i < totalWorlds; i++) {
                    const worldModules = modules.slice(i * modulesPerWorld, (i + 1) * modulesPerWorld);
                    if (worldModules.length > 0) {
                        masterminds.push({
                            id: `world-${i + 1}`,
                            title: `Mondo ${i + 1}`, // We might lack the customized titles "ORIGINE", "CONFINE" if not in DB
                            subtitle: 'Modulo',
                            modules: worldModules.map(m => ({
                                id: m.id,
                                title: m.title,
                                description: m.description,
                                type: m.content_type as 'video' | 'audio' | 'text',
                                duration: m.duration ? String(m.duration) : '15:00',
                                output: '' // Added to satisfy Module interface
                            }))
                        });
                    }
                }

                // If DB result is too empty (e.g. no modules yet), fallback
                if (masterminds.length === 0) {
                    throw new Error('DB Empty');
                }

                const mappedCourse: Course = {
                    id: dbCourse.id,
                    title: dbCourse.title,
                    description: dbCourse.description,
                    masterminds: masterminds
                };

                if (isMounted) {
                    setCourse(mappedCourse);
                    setIsLegacy(false);
                }

            } catch (err) {
                // FALLBACK TO HARDCODED
                if (isMounted) {
                    console.log('Using Legacy Data for', courseId);
                    const legacyCourse = HARDCODED_COURSES[courseId];
                    if (legacyCourse) {
                        setCourse(legacyCourse);
                        setIsLegacy(true);
                    } else {
                        setError('Course not found');
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchCourseData();

        return () => {
            isMounted = false;
        };
    }, [courseId]);

    return { course, loading, error, isLegacy };
};
