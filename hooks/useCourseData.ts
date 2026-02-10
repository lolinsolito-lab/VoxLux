import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Course, Mastermind } from '../services/courses';
import { COURSES as HARDCODED_COURSES } from '../services/courses';

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

                // 2. Fetch Modules — Priority: New Schema
                // Using NEW schema (modules + lessons)
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
                    .eq('course_id', dbCourse.id)
                    .order('order_index', { ascending: true });

                if (newModulesError) {
                    console.error('Error fetching modules:', newModulesError);
                    throw newModulesError;
                }

                const masterminds: Mastermind[] = (newModules || []).map(m => ({
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

                // If DB result is empty, it might be an issue, but we'll return empty course
                // or throw to fallback if that's preferred. For now we assume correct migration.
                if (masterminds.length === 0) {
                    // Optionally throw here if you want to fallback to hardcoded when DB is empty
                    // throw new Error('DB Empty');
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
