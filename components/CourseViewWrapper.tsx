import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CourseView } from './CourseView';

export const CourseViewWrapper: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleNavigateToCourse = (newCourseId: string) => {
        navigate(`/course/${newCourseId}`);
    };

    return (
        <CourseView
            courseId={courseId || 'matrice-1'}
            onBack={handleBack}
            onNavigateToCourse={handleNavigateToCourse}
        />
    );
};
