import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredCourse?: string; // Optional: require specific course ownership
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredCourse
}) => {
    const { user, loading, hasCourse } = useAuth();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Caricamento...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If specific course required, check ownership
    if (requiredCourse && !hasCourse(requiredCourse)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
