import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { User, CourseProgress } from '../types';

interface AuthContextType {
    user: User | null;
    supabaseUser: SupabaseUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; userId?: string }>;
    signup: (email: string, password: string, fullName: string, phoneNumber?: string) => Promise<{ success: boolean; error?: string; userId?: string }>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
    hasCourse: (courseId: string) => boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const loadingRef = useRef(false);
    const loadedUserIdRef = useRef<string | null>(null);

    // Initialize auth state from Supabase
    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!isMounted) return;

            if (session?.user) {
                setSupabaseUser(session.user);
                await loadUserProfile(session.user.id);
            } else {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes (login/logout only, not token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;

            // Only react to actual auth changes, not token refreshes
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                if (session?.user) {
                    // Only reload if user changed
                    if (loadedUserIdRef.current !== session.user.id) {
                        setSupabaseUser(session.user);
                        loadUserProfile(session.user.id);
                    }
                } else {
                    loadedUserIdRef.current = null;
                    setSupabaseUser(null);
                    setUser(null);
                    setLoading(false);
                }
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const loadUserProfile = async (userId: string) => {
        // Guard against duplicate/concurrent loads
        if (loadingRef.current || loadedUserIdRef.current === userId) {
            return;
        }

        loadingRef.current = true;

        try {
            // Fetch user profile from Supabase
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) {
                console.error('Error loading profile:', profileError);
                setLoading(false);
                loadingRef.current = false;
                return;
            }

            // Fetch user purchases
            const { data: purchases } = await supabase
                .from('purchases')
                .select('course_id')
                .eq('user_id', userId)
                .eq('status', 'active');

            // Fetch user stats
            const { data: stats } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', userId)
                .single();

            const mappedUser: User = {
                id: profile.id,
                name: profile.full_name || profile.email,
                email: profile.email,
                enrolledCourses: purchases?.map(p => p.course_id) || [],
                level: stats?.level_name || 'Novizio',
                xp: stats?.total_xp || 0,
                role: profile.role || 'user',
                createdAt: profile.created_at
            };

            loadedUserIdRef.current = userId;
            setUser(mappedUser);
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; userId?: string }> => {
        try {
            // Reset loaded user to force reload on new login
            loadedUserIdRef.current = null;
            loadingRef.current = false;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                await loadUserProfile(data.user.id);
                return { success: true, userId: data.user.id };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const signup = async (
        email: string,
        password: string,
        fullName: string,
        phoneNumber?: string
    ): Promise<{ success: boolean; error?: string; userId?: string }> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/onboarding`,
                    data: {
                        full_name: fullName,
                        phone_number: phoneNumber
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                await loadUserProfile(data.user.id);
                return { success: true, userId: data.user.id };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const logout = async (): Promise<void> => {
        loadedUserIdRef.current = null;
        loadingRef.current = false;
        await supabase.auth.signOut();
        setUser(null);
        setSupabaseUser(null);
    };

    const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const hasCourse = (courseId: string): boolean => {
        return user?.enrolledCourses.includes(courseId) || false;
    };

    const refreshUser = async (): Promise<void> => {
        if (supabaseUser) {
            // Force refresh by clearing the loaded user
            loadedUserIdRef.current = null;
            loadingRef.current = false;
            await loadUserProfile(supabaseUser.id);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                supabaseUser,
                loading,
                login,
                signup,
                logout,
                resetPassword,
                hasCourse,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
