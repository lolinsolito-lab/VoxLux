import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Course } from '../services/courses/types';

interface DiplomaStatus {
    isEligible: boolean;
    requirementsMet: {
        lessons: boolean;
        quiz: boolean;
    };
    progressPercent: number;
    quizScore?: number;
}

export const useDiplomaLogic = (courseId: string, requirements?: Course['diploma_requirements']) => {
    const [status, setStatus] = useState<DiplomaStatus>({
        isEligible: false,
        requirementsMet: { lessons: false, quiz: false },
        progressPercent: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId || !requirements) {
            setLoading(false);
            return;
        }

        const checkEligibility = async () => {
            try {
                // 1. Check Lesson Progress
                // (Assumes a function or query to get % complete)
                const { data: progress } = await supabase
                    .rpc('get_user_course_progress', { course_uuid: courseId });

                // 2. Check Quiz Scores
                // Get all quizzes for this course's modules
                const { data: quizzes } = await supabase
                    .from('quizzes')
                    .select('id, module_id, passing_score, modules!inner(course_id)')
                    .eq('modules.course_id', courseId);

                let allQuizzesPassed = true;
                if (quizzes && quizzes.length > 0) {
                    // Get user results
                    const { data: results } = await supabase
                        .from('quiz_results')
                        .select('score, quiz_id')
                        .in('quiz_id', quizzes.map(q => q.id));

                    // Verify each required quiz has a passing score
                    allQuizzesPassed = quizzes.every(q => {
                        const result = results?.find(r => r.quiz_id === q.id);
                        return result && result.score >= (requirements.min_score_percent || q.passing_score);
                    });
                }

                const lessonsCompleted = (progress || 0) >= 100; // Requirement says 'all' which implies 100%

                setStatus({
                    isEligible: lessonsCompleted && allQuizzesPassed,
                    requirementsMet: {
                        lessons: lessonsCompleted,
                        quiz: allQuizzesPassed
                    },
                    progressPercent: progress || 0
                });

            } catch (error) {
                console.error("Error checking diploma eligibility:", error);
            } finally {
                setLoading(false);
            }
        };

        checkEligibility();
    }, [courseId, requirements]);

    return { status, loading };
};
