import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CourseView } from './CourseView';
import { useAuth } from '../contexts/AuthContext';

export const CourseViewWrapper: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { hasCourse, loading, user } = useAuth();

    const targetCourseId = courseId || 'matrice-1';

    useEffect(() => {
        if (!loading && user) {
            if (!hasCourse(targetCourseId)) {
                console.warn(`Unauthorized access attempt to ${targetCourseId} by user ${user.id}`);
                navigate('/dashboard');
            }
        }
    }, [loading, user, targetCourseId, hasCourse, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!hasCourse(targetCourseId)) {
        return null; // Will redirect in useEffect
    }

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleNavigateToCourse = (newCourseId: string) => {
        navigate(`/course/${newCourseId}`);
    };

    return (
        <CourseView
            courseId={targetCourseId}
            onBack={handleBack}
            onNavigateToCourse={handleNavigateToCourse}
        />
    );
};
