import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    DollarSign,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldAlert,
    ArrowLeft,
    Calendar,
    MessageSquare,
    HelpCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BRANDING } from '../config/branding';

export const AdminLayout: React.FC = () => {
    // Default to closed on mobile, open on desktop
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Auto-close sidebar on route change (mobile only)
    useEffect(() => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, [location.pathname]);

    // Handle resize events
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/users', label: 'Utenti (God View)', icon: <Users size={20} /> },
        { path: '/admin/finance', label: 'Finanze', icon: <DollarSign size={20} /> },
        { path: '/admin/courses', label: 'Corsi LMS', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/quizzes', label: 'Quiz & Diplomi', icon: <ShieldAlert size={20} /> }, // Using ShieldAlert temporarily or any icon
        { path: '/admin/calendar', label: 'Calendario', icon: <Calendar size={20} /> },
        { path: '/admin/content', label: 'Contenuti', icon: <Settings size={20} /> },
        { path: '/admin/discounts', label: 'Sconti', icon: <ShieldAlert size={20} /> },
        { path: '/admin/support', label: 'Supporto', icon: <MessageSquare size={20} /> },
        { path: '/admin/faq', label: 'FAQ', icon: <HelpCircle size={20} /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            {/* MOBILE BACKDROP OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* STEALTH SIDEBAR */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-900 transition-transform duration-300 ease-in-out shadow-2xl
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:relative md:translate-x-0 md:shadow-none
                `}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ShieldAlert className="text-red-600" size={24} />
                            <span className="text-lg font-bold tracking-tighter text-zinc-100">
                                GOD MODE
                            </span>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-500 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                                    ${isActive(item.path)
                                        ? 'bg-red-900/10 text-red-500 border border-red-900/20'
                                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}
                                `}
                            >
                                {item.icon}
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Navigation Buttons */}
                    <div className="p-4 border-t border-zinc-900 space-y-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-900/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium text-sm">Torna alla Dashboard</span>
                        </button>
                        <button
                            onClick={() => logout()}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-zinc-500 hover:text-red-500 hover:bg-red-900/5 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col overflow-hidden relative w-full">
                {/* Mobile Toggle Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-900 z-30">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="text-red-600" size={20} />
                        <span className="font-bold text-zinc-100">GOD MODE</span>
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white p-2">
                        <Menu size={24} />
                    </button>
                </header>

                {/* Content Scroller */}
                <div className="flex-1 overflow-y-auto bg-black w-full">
                    <Outlet />
                </div>

                {/* Grid Overlay Effect (Anti-Hacker Vibe) */}
                <div className="absolute inset-0 pointer-events-none bg-[url('/grid.svg')] opacity-[0.02] mix-blend-overlay"></div>
            </main>
        </div>
    );
};
