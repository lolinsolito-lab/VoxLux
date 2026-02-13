import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Book, Users, CheckCircle, Layout, Eye, Lock, Unlock, TrendingUp, PlayCircle, RefreshCw, Award, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { ModuleBuilder } from '../../components/admin/ModuleBuilder';
import { UniversalDiplomaCard } from '../../components/UniversalDiplomaCard'; // Import added

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    tier_required: string[];
    status: 'draft' | 'published' | 'archived';
    thumbnail_url: string | null;
    duration_hours: number;
    color_theme: {
        primary: string;
        secondary: string;
    };
    display_order: number;
    created_at: string;
    updated_at: string;
    module_count?: number;
    diploma_requirements?: {
        min_score_percent: number;
        required_quizzes: 'all' | string[];
        required_lessons: 'all' | string[];
        diploma_template_id: string;
    };
}

interface CourseModule {
    id: string;
    course_id: string;
    title: string;
    description: string;
    module_order: number;
    content_type: 'lesson' | 'quiz' | 'video' | 'assignment';
    xp_reward: number;
    is_locked: boolean;
}

// Diploma Preview Modal - Moved here to fix hoisting
const DiplomaPreviewModal = ({
    course,
    onClose
}: {
    course: Course;
    onClose: () => void;
}) => {
    // Determine course ID for theme (matrice-1 or matrice-2)
    // Fallback based on slug if ID doesn't match expected pattern
    const courseId = course.slug.includes('podcast') ? 'matrice-2' : 'matrice-1';
    const [variant, setVariant] = useState<'standard' | 'luxury'>('standard');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-auto"
            onClick={onClose}
        >
            <div className="relative w-full max-w-[1200px] flex flex-col items-center" onClick={e => e.stopPropagation()}>

                <div className="w-full flex justify-between items-center mb-4 px-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Eye className="text-amber-500" />
                        Anteprima Diploma: {course.title}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setVariant(v => v === 'standard' ? 'luxury' : 'standard')}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${variant === 'luxury' ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-transparent text-gray-400 border-gray-600 hover:border-white hover:text-white'}`}
                        >
                            {variant === 'luxury' ? '✨ Luxury Mode' : 'Standard Mode'}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="transform scale-[0.6] md:scale-75 origin-top transition-transform">
                    <UniversalDiplomaCard
                        userName="Mario Rossi (Preview)"
                        courseId={courseId}
                        date={new Date().toLocaleDateString('it-IT')}
                        variant={variant}
                    />
                </div>

                <div className="mt-[-150px] md:mt-[-100px] text-center text-gray-500 text-sm">
                    *Questa è una simulazione. I dati reali verranno iniettati al momento del conseguimento.
                </div>
            </div>
        </motion.div>
    );
};

export const AdminCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [showModuleBuilder, setShowModuleBuilder] = useState(false);
    const [showDiplomaModal, setShowDiplomaModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false); // New State
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    useEffect(() => {
        fetchCourses();
        setupRealTimeSubscriptions();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            // Fetch courses with module count (NEW SCHEMA)
            const { data: coursesData, error } = await supabase
                .from('courses')
                .select(`
                    *,
                    modules (count)
                `)
                .order('display_order', { ascending: true });

            if (error) {
                console.error('Supabase error fetching courses:', error);
                // Fallback if relation fails: fetch courses without count
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('courses')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (fallbackError) throw fallbackError;
                setCourses(fallbackData || []);
                return;
            }

            // Transform data to include module count
            const coursesWithCount = coursesData?.map(course => ({
                ...course,
                module_count: course.modules?.[0]?.count || 0
            })) || [];

            setCourses(coursesWithCount);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const setupRealTimeSubscriptions = () => {
        const channel = supabase
            .channel('admin-courses')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'courses'
            }, () => {
                fetchCourses();
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    };

    const handleDeleteCourse = async (id: string) => {
        if (!confirm('⚠️ Eliminare questo corso? Verranno eliminati anche tutti i moduli associati.')) return;

        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Errore durante l\'eliminazione del corso');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';

        try {
            const { error } = await supabase
                .from('courses')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchCourses();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Calculate stats
    const stats = {
        total: courses.length,
        published: courses.filter(c => c.status === 'published').length,
        draft: courses.filter(c => c.status === 'draft').length,
        totalModules: courses.reduce((sum, c) => sum + (c.module_count || 0), 0)
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-purple-400" size={48} />
                    <p className="text-xl text-gray-400">Caricamento corsi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                        LMS <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">ADMIN</span>
                    </h1>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchCourses}
                            className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all duration-300 hover:scale-105"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button
                            onClick={() => { setEditingCourse(null); setShowCreateModal(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                        >
                            <Plus size={20} />
                            Nuovo Corso
                        </button>
                    </div>
                </div>
                <p className="text-gray-400 text-lg">Gestione completa corsi Matrice 1, 2 e Ascension Box</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
            >
                <div className="backdrop-blur-sm bg-gradient-to-br from-purple-900/20 to-pink-900/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <Book className="text-purple-400" size={32} />
                        <span className="text-xs text-purple-400 font-semibold">TOTALI</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stats.total}</div>
                    <p className="text-sm text-gray-400">Corsi Creati</p>
                </div>

                <div className="backdrop-blur-sm bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="text-green-400" size={32} />
                        <span className="text-xs text-green-400 font-semibold">PUBBLICATI</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stats.published}</div>
                    <p className="text-sm text-gray-400">Corsi Live</p>
                </div>

                <div className="backdrop-blur-sm bg-gradient-to-br from-amber-900/20 to-yellow-900/10 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <Layout className="text-amber-400" size={32} />
                        <span className="text-xs text-amber-400 font-semibold">BOZZE</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stats.draft}</div>
                    <p className="text-sm text-gray-400">In Lavorazione</p>
                </div>

                <div className="backdrop-blur-sm bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <PlayCircle className="text-blue-400" size={32} />
                        <span className="text-xs text-blue-400 font-semibold">MODULI</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stats.totalModules}</div>
                    <p className="text-sm text-gray-400">Lezioni Totali</p>
                </div>
            </motion.div>

            {/* Courses Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="courses-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                >
                    {courses.length === 0 ? (
                        <div className="text-center py-20">
                            <Book className="mx-auto mb-4 text-gray-600" size={64} />
                            <p className="text-xl text-gray-400">Nessun corso disponibile</p>
                            <p className="text-sm text-gray-500 mt-2">Crea il primo corso LMS!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {courses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 group ${course.status === 'published' ? 'border-white/10' : 'border-amber-500/30 opacity-75'
                                        }`}
                                    style={{
                                        borderLeft: `4px solid ${course.color_theme?.primary || '#8B5CF6'}`
                                    }}
                                >
                                    {/* Course Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-white text-lg line-clamp-1">{course.title}</h3>
                                                {course.status === 'published' ? (
                                                    <Unlock size={16} className="text-green-400" />
                                                ) : (
                                                    <Lock size={16} className="text-amber-400" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{course.description}</p>
                                        </div>
                                    </div>

                                    {/* Tiers */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {course.tier_required.map(tier => (
                                            <span
                                                key={tier}
                                                className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg border border-purple-500/30"
                                            >
                                                {tier.replace('_', ' ').toUpperCase()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 mb-4 text-sm">
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <PlayCircle size={14} />
                                            <span>{course.module_count || 0} moduli</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <TrendingUp size={14} />
                                            <span>{course.duration_hours || 0}h</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mb-4">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${course.status === 'published'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : course.status === 'draft'
                                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                                }`}
                                        >
                                            {course.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => {
                                                setSelectedCourseId(course.id);
                                                setShowModuleBuilder(true);
                                            }}
                                            className="col-span-2 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                                        >
                                            <Layout size={16} className="text-purple-400" />
                                            Gestisci Contenuti
                                        </button>

                                        <button
                                            onClick={() => handleToggleStatus(course.id, course.status)}
                                            className={`py-2 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1 ${course.status === 'published'
                                                ? 'bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30'
                                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {course.status === 'published' ? <Unlock size={14} /> : <Lock size={14} />}
                                            {course.status === 'published' ? 'Pubblicato' : 'Bozza'}
                                        </button>

                                        <button
                                            onClick={() => { setEditingCourse(course); setShowCreateModal(true); }}
                                            className="py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-1 text-xs font-semibold"
                                        >
                                            <Settings size={14} />
                                            Dettagli
                                        </button>

                                        <button
                                            onClick={() => { setEditingCourse(course); setShowDiplomaModal(true); }}
                                            className={`col-span-2 py-2 border rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold ${course.diploma_requirements
                                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                : 'bg-white/5 border-white/10 text-gray-500'
                                                }`}
                                        >
                                            <Award size={14} />
                                            {course.diploma_requirements ? 'Diploma Attivo' : 'Configura Diploma'}
                                        </button>

                                        {/* New Preview Button */}
                                        <button
                                            onClick={() => { setEditingCourse(course); setShowPreviewModal(true); }}
                                            className="col-span-2 py-2 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 hover:text-white"
                                        >
                                            <Eye size={14} />
                                            Anteprima Grafica
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
                {showModuleBuilder && selectedCourseId && (
                    <ModuleBuilder
                        courseId={selectedCourseId}
                        onClose={() => {
                            setShowModuleBuilder(false);
                            setSelectedCourseId(null);
                        }}
                    />
                )}
                {showCreateModal && (
                    <CourseFormModal
                        course={editingCourse}
                        onClose={() => setShowCreateModal(false)}
                        onSave={() => {
                            setShowCreateModal(false);
                            fetchCourses();
                        }}
                    />
                )}
                {showDiplomaModal && editingCourse && (
                    <DiplomaSettingsModal
                        course={editingCourse}
                        onClose={() => setShowDiplomaModal(false)}
                        onSave={() => {
                            setShowDiplomaModal(false);
                            fetchCourses();
                        }}
                    />
                )}
                {/* Preview Modal Integration */}
                {showPreviewModal && editingCourse && (
                    <DiplomaPreviewModal
                        course={editingCourse}
                        onClose={() => setShowPreviewModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Diploma Settings Modal
const DiplomaSettingsModal = ({
    course,
    onClose,
    onSave
}: {
    course: Course;
    onClose: () => void;
    onSave: () => void;
}) => {
    const [form, setForm] = useState({
        min_score_percent: course.diploma_requirements?.min_score_percent || 100,
        required_quizzes: course.diploma_requirements?.required_quizzes || 'all',
        required_lessons: course.diploma_requirements?.required_lessons || 'all',
        diploma_template_id: course.diploma_requirements?.diploma_template_id || 'diploma_matrice_1_v1'
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase
                .from('courses')
                .update({ diploma_requirements: form })
                .eq('id', course.id);

            if (error) throw error;
            onSave();
        } catch (error) {
            console.error('Error saving diploma settings:', error);
            alert('Errore nel salvataggio');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl shadow-amber-900/20 max-h-[100dvh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Award className="text-amber-500" />
                        Configurazione Diploma
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><Settings size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Punteggio Minimo (%)</label>
                        <input
                            type="number"
                            value={form.min_score_percent}
                            onChange={e => setForm(f => ({ ...f, min_score_percent: parseInt(e.target.value) }))}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:border-amber-500 focus:outline-none"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Template Diploma</label>
                        <select
                            value={form.diploma_template_id}
                            onChange={e => setForm(f => ({ ...f, diploma_template_id: e.target.value }))}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                        >
                            <option value="diploma_matrice_1_v1">Matrice 1 (Storytelling)</option>
                            <option value="diploma_matrice_2_v1">Matrice 2 (Podcast)</option>
                            <option value="diploma_ascension_v1">Ascension Box (Gold)</option>
                        </select>
                    </div>

                    <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-4">
                        <p className="text-xs text-amber-400 mb-2 font-bold uppercase">Requisiti</p>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm text-gray-300">
                                <CheckCircle size={16} className="text-green-500" />
                                <span>Tutti i Quiz Completati</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm text-gray-300">
                                <CheckCircle size={16} className="text-green-500" />
                                <span>Tutte le Lezioni Viste</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold rounded-xl transition-all shadow-lg"
                    >
                        {saving ? 'Salvataggio...' : 'Salva Configurazione'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

// Course Form Modal Component
const CourseFormModal = ({
    course,
    onClose,
    onSave
}: {
    course: Course | null;
    onClose: () => void;
    onSave: () => void;
}) => {
    const [form, setForm] = useState({
        title: course?.title || '',
        slug: course?.slug || '',
        description: course?.description || '',
        tier_required: course?.tier_required || [],
        status: course?.status || 'draft',
        duration_hours: course?.duration_hours || 0,
        color_theme: course?.color_theme || { primary: '#8B5CF6', secondary: '#EC4899' }
    });
    const [saving, setSaving] = useState(false);

    // Auto-generate slug from title
    useEffect(() => {
        if (!course && form.title) {
            const slug = form.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setForm(f => ({ ...f, slug }));
        }
    }, [form.title, course]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (course) {
                // Update existing course
                const { error } = await supabase
                    .from('courses')
                    .update(form)
                    .eq('id', course.id);

                if (error) throw error;
            } else {
                // Create new course
                const { error } = await supabase
                    .from('courses')
                    .insert([form]);

                if (error) throw error;
            }

            onSave();
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Errore durante il salvataggio del corso');
        } finally {
            setSaving(false);
        }
    };

    const toggleTier = (tier: string) => {
        setForm(f => ({
            ...f,
            tier_required: f.tier_required.includes(tier)
                ? f.tier_required.filter(t => t !== tier)
                : [...f.tier_required, tier]
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={onClose}
        >
            <motion.form
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[100dvh] md:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">
                        {course ? 'Modifica Corso' : 'Nuovo Corso'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                        <Trash2 size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Titolo Corso *
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                            placeholder="es. Neuro-Narrative Mastery"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Slug (URL-friendly) *
                        </label>
                        <input
                            type="text"
                            value={form.slug}
                            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all font-mono text-sm"
                            placeholder="neuro-narrative-mastery"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Descrizione
                        </label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                            rows={4}
                            placeholder="Descrizione del corso..."
                        />
                    </div>

                    {/* Tier Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            Disponibile per Tier *
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {['matrice_1', 'matrice_2', 'ascension_box'].map(tier => (
                                <button
                                    key={tier}
                                    type="button"
                                    onClick={() => toggleTier(tier)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${form.tier_required.includes(tier)
                                        ? 'bg-purple-600 text-white border-2 border-purple-400'
                                        : 'bg-white/5 text-gray-400 border-2 border-white/10 hover:border-purple-500/30'
                                        }`}
                                >
                                    {tier.replace('_', ' ').toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Durata (ore)
                        </label>
                        <input
                            type="number"
                            value={form.duration_hours}
                            onChange={e => setForm(f => ({ ...f, duration_hours: parseInt(e.target.value) || 0 }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                            min="0"
                            placeholder="40"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            Stato Pubblicazione
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, status: 'draft' }))}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${form.status === 'draft'
                                    ? 'bg-amber-600 text-white border-2 border-amber-400'
                                    : 'bg-white/5 text-gray-400 border-2 border-white/10'
                                    }`}
                            >
                                Bozza
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, status: 'published' }))}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${form.status === 'published'
                                    ? 'bg-green-600 text-white border-2 border-green-400'
                                    : 'bg-white/5 text-gray-400 border-2 border-white/10'
                                    }`}
                            >
                                Pubblicato
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={saving || !form.title || !form.slug || form.tier_required.length === 0}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-lg"
                    >
                        {saving ? 'Salvataggio...' : (course ? 'Aggiorna Corso' : 'Crea Corso')}
                    </button>
                </div>
            </motion.form>
        </motion.div>
    );
};
