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

                // 2. Fetch Modules — Priority: New Schema → Legacy Fallback

                // Try NEW schema first (modules + lessons)
                const { data: newModules, error: newModulesError } = await supabase
                    .from('modules')
                    .select(`
                        id,
                        title,
                        description,
                        order_index,
                        lessons (
                            id,
                            title,
                            description,
                            duration_minutes,
                            video_provider,
                            order_index,
                            resources
                        )
                    `)
                    .eq('course_id', courseId)
                    .order('order_index', { ascending: true });

                let masterminds: Mastermind[] = [];

                if (!newModulesError && newModules && newModules.length > 0) {
                    // ✅ NEW SCHEMA — Used by Podcast (matrice-2) and all future courses
                    masterminds = newModules.map(m => ({
                        id: m.id,
                        title: m.title,
                        subtitle: 'Modulo',
                        description: m.description,
                        modules: (m.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index).map((l: any) => ({
                            id: l.id,
                            title: l.title,
                            description: l.description,
                            type: l.video_provider === 'audio' ? 'audio' : 'video',
                            duration: l.duration_minutes ? `${l.duration_minutes}:00` : '15:00',
                            output: '',
                            resources: l.resources
                        }))
                    }));
                } else {
                    // ⚠️ LEGACY FALLBACK — Only for Storytelling (matrice-1) until migrated
                    const { data: dbModules, error: modulesError } = await supabase
                        .from('course_modules')
                        .select('*')
                        .eq('course_id', dbCourse.id)
                        .order('module_order', { ascending: true });

                    if (modulesError) {
                        console.error('Error fetching legacy modules:', modulesError);
                    }

                    const modules = dbModules || [];
                    const modulesPerWorld = 3;
                    const totalWorlds = Math.ceil(modules.length / modulesPerWorld);

                    for (let i = 0; i < totalWorlds; i++) {
                        const worldModules = modules.slice(i * modulesPerWorld, (i + 1) * modulesPerWorld);
                        if (worldModules.length > 0) {
                            masterminds.push({
                                id: `world-${i + 1}`,
                                title: `Mondo ${i + 1}`,
                                subtitle: 'Modulo',
                                modules: worldModules.map(m => ({
                                    id: m.id,
                                    title: m.title,
                                    description: m.description,
                                    type: m.content_type as 'video' | 'audio' | 'text',
                                    duration: m.duration ? String(m.duration) : '15:00',
                                    output: ''
                                }))
                            });
                        }
                    }
                }

                // If DB result is too empty (e.g. no modules anywhere), fallback
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
