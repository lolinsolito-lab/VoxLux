import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CourseProgress } from '../types';

interface AuthContextType {
    user: User | null;
    progress: CourseProgress[];
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, courseId: string) => Promise<boolean>;
    logout: () => void;
    updateProgress: (courseId: string, moduleId: string) => void;
    getCourseProgress: (courseId: string) => CourseProgress | undefined;
    isModuleCompleted: (moduleId: string) => boolean;
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
    const [progress, setProgress] = useState<CourseProgress[]>([]);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('voxlux_user');
        const storedProgress = localStorage.getItem('voxlux_progress');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simple local auth - look up user in localStorage
        const usersData = localStorage.getItem('voxlux_users');
        if (!usersData) return false;

        const users: (User & { password: string })[] = JSON.parse(usersData);
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('voxlux_user', JSON.stringify(userWithoutPassword));

            // Load user's progress
            const userProgress = localStorage.getItem(`voxlux_progress_${foundUser.id}`);
            if (userProgress) {
                const loadedProgress = JSON.parse(userProgress);
                setProgress(loadedProgress);
                localStorage.setItem('voxlux_progress', JSON.stringify(loadedProgress));
            }

            return true;
        }
        return false;
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        courseId: string
    ): Promise<boolean> => {
        // Check if user already exists
        const usersData = localStorage.getItem('voxlux_users');
        const users: (User & { password: string })[] = usersData ? JSON.parse(usersData) : [];

        if (users.find(u => u.email === email)) {
            return false; // Email already exists
        }

        // Create new user
        const newUser: User & { password: string } = {
            id: `user_${Date.now()}`,
            name,
            email,
            password,
            enrolledCourses: [courseId],
            level: 'Acolyte',
            xp: 0,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('voxlux_users', JSON.stringify(users));

        // Auto-login after registration
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('voxlux_user', JSON.stringify(userWithoutPassword));

        // Initialize progress for enrolled course
        const initialProgress: CourseProgress = {
            courseId,
            modules: [],
            startedAt: new Date().toISOString()
        };
        setProgress([initialProgress]);
        localStorage.setItem('voxlux_progress', JSON.stringify([initialProgress]));
        localStorage.setItem(`voxlux_progress_${newUser.id}`, JSON.stringify([initialProgress]));

        return true;
    };

    const logout = () => {
        setUser(null);
        setProgress([]);
        localStorage.removeItem('voxlux_user');
        localStorage.removeItem('voxlux_progress');
    };

    const updateProgress = (courseId: string, moduleId: string) => {
        if (!user) return;

        setProgress(prev => {
            const updatedProgress = [...prev];
            let courseProgress = updatedProgress.find(cp => cp.courseId === courseId);

            if (!courseProgress) {
                courseProgress = {
                    courseId,
                    modules: [],
                    startedAt: new Date().toISOString()
                };
                updatedProgress.push(courseProgress);
            }

            // Check if module already completed
            const existingModule = courseProgress.modules.find(m => m.moduleId === moduleId);
            if (existingModule && existingModule.completed) {
                return prev; // Already completed, no change
            }

            if (existingModule) {
                existingModule.completed = true;
                existingModule.completedAt = new Date().toISOString();
            } else {
                courseProgress.modules.push({
                    moduleId,
                    completed: true,
                    completedAt: new Date().toISOString()
                });
            }

            // Save to localStorage
            localStorage.setItem('voxlux_progress', JSON.stringify(updatedProgress));
            localStorage.setItem(`voxlux_progress_${user.id}`, JSON.stringify(updatedProgress));

            // Update XP
            const updatedUser = { ...user, xp: user.xp + 100 };
            setUser(updatedUser);
            localStorage.setItem('voxlux_user', JSON.stringify(updatedUser));

            return updatedProgress;
        });
    };

    const getCourseProgress = (courseId: string): CourseProgress | undefined => {
        return progress.find(cp => cp.courseId === courseId);
    };

    const isModuleCompleted = (moduleId: string): boolean => {
        for (const courseProgress of progress) {
            const module = courseProgress.modules.find(m => m.moduleId === moduleId);
            if (module?.completed) return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                progress,
                login,
                register,
                logout,
                updateProgress,
                getCourseProgress,
                isModuleCompleted
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
