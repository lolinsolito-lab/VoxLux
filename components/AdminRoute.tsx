import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AdminRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    // Strict Role Check: Only 'admin' or 'god' allowed
    if (!user || (user.role !== 'admin' && user.role !== 'god')) {
        // Log unauthorized access attempt could go here
        console.warn(`Unauthorized Admin Access Attempt by: ${user?.email || 'Guest'}`);
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
