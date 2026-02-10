import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Youtube from '@tiptap/extension-youtube';
import Image from '@tiptap/extension-image';
import {
    Plus,
    GripVertical,
    Trash2,
    Pencil,
    Save,
    X,
    Video,
    FileText,
    HelpCircle,
    CheckCircle,
    Layout,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Clock,
    Lock,
    Unlock,
    BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { QuizBuilder } from './QuizBuilder';

// ──────── Types for NEW schema (modules + lessons) ────────

interface Lesson {
    id: string;
    module_id: string;
    title: string;
    description: string;
    video_url?: string;
    video_provider?: string;
    duration_minutes?: number;
    order_index: number;
    resources?: any;
}

interface CourseModule {
    id: string;
    course_id: string;
    title: string;
    description: string;
    order_index: number;
    is_locked: boolean;
    lessons: Lesson[];
}

interface ModuleBuilderProps {
    courseId: string;
    onClose: () => void;
}

// ──────── Sortable Lesson Item ────────

const SortableLessonItem = ({
    lesson,
    onEdit,
    onDelete
}: {
    lesson: Lesson;
    onEdit: () => void;
    onDelete: () => void;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: lesson.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center p-3 bg-white/5 border border-white/5 rounded-lg mb-2 hover:border-purple-500/30 transition-colors group">
            <div {...attributes} {...listeners} className="cursor-grab hover:text-purple-400 text-gray-600 mr-3">
                <GripVertical size={14} />
            </div>
            <BookOpen size={14} className="text-purple-400 mr-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{lesson.title}</p>
                {lesson.duration_minutes && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {lesson.duration_minutes} min
                    </p>
                )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-1.5 hover:bg-white/10 rounded text-blue-400"><Pencil size={14} /></button>
                <button onClick={onDelete} className="p-1.5 hover:bg-white/10 rounded text-red-400"><Trash2 size={14} /></button>
            </div>
        </div>
    );
};

// ──────── Sortable Module (World) Item ────────

const SortableModuleItem = ({
    module,
    onEdit,
    onDelete,
    onToggleLock,
    expanded,
    onToggleExpand,
    onEditLesson,
    onDeleteLesson,
    onAddLesson,
    onManageQuiz,
    lessonSensors
}: {
    module: CourseModule;
    onEdit: () => void;
    onDelete: () => void;
    onToggleLock: () => void;
    expanded: boolean;
    onToggleExpand: () => void;
    onEditLesson: (lesson: Lesson) => void;
    onDeleteLesson: (lessonId: string) => void;
    onAddLesson: () => void;
    onManageQuiz: () => void;
    lessonSensors: ReturnType<typeof useSensors>;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: module.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-4">
            <div className={`bg-white/5 border ${expanded ? 'border-purple-500/50 bg-white/10' : 'border-white/10'} rounded-xl transition-all duration-300`}>
                <div className="flex items-center p-4">
                    {/* Drag Handle */}
                    <div {...attributes} {...listeners} className="cursor-grab hover:text-purple-400 text-gray-500 mr-4">
                        <GripVertical size={20} />
                    </div>

                    {/* Module Info */}
                    <div className="flex-1 cursor-pointer" onClick={onToggleExpand}>
                        <div className="flex items-center gap-3">
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-bold">
                                #{module.order_index + 1}
                            </span>
                            <h4 className="font-bold text-white text-lg">{module.title}</h4>
                            <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-blue-500/20">
                                {module.lessons?.length || 0} lezioni
                            </span>
                        </div>
                        {module.description && (
                            <p className="text-xs text-gray-500 mt-1 ml-11 truncate">{module.description}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button onClick={onManageQuiz} className="p-2 hover:bg-white/10 rounded-lg text-purple-400" title="Gestisci Quiz">
                            <BrainCircuit size={18} />
                        </button>
                        <button onClick={onToggleLock} className={`p-2 hover:bg-white/10 rounded-lg ${module.is_locked ? 'text-red-400' : 'text-green-400'}`} title={module.is_locked ? 'Bloccato' : 'Sbloccato'}>
                            {module.is_locked ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>
                        <button onClick={onToggleExpand} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <button onClick={onEdit} className="p-2 hover:bg-white/10 rounded-lg text-blue-400">
                            <Pencil size={18} />
                        </button>
                        <button onClick={onDelete} className="p-2 hover:bg-white/10 rounded-lg text-red-400">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Expanded: show lessons list */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-white/5 bg-black/20"
                        >
                            <div className="p-4">
                                {module.lessons && module.lessons.length > 0 ? (
                                    <DndContext
                                        sensors={lessonSensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={() => {/* handled in parent */ }}
                                    >
                                        <SortableContext
                                            items={module.lessons.map(l => l.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {module.lessons
                                                .sort((a, b) => a.order_index - b.order_index)
                                                .map(lesson => (
                                                    <SortableLessonItem
                                                        key={lesson.id}
                                                        lesson={lesson}
                                                        onEdit={() => onEditLesson(lesson)}
                                                        onDelete={() => onDeleteLesson(lesson.id)}
                                                    />
                                                ))}
                                        </SortableContext>
                                    </DndContext>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Nessuna lezione ancora</p>
                                )}

                                <button
                                    onClick={onAddLesson}
                                    className="w-full mt-3 py-2 border border-dashed border-white/10 rounded-lg text-gray-400 hover:border-purple-500/50 hover:text-purple-400 transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <Plus size={14} /> Aggiungi Lezione
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ──────── Main ModuleBuilder ────────

export const ModuleBuilder: React.FC<ModuleBuilderProps> = ({ courseId, onClose }) => {
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [activeModuleIdForLesson, setActiveModuleIdForLesson] = useState<string | null>(null);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [activeModuleIdForQuiz, setActiveModuleIdForQuiz] = useState<{ id: string, title: string } | null>(null);
    const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchModules();
    }, [courseId]);

    // ─── Fetch modules + lessons from NEW schema ───
    const fetchModules = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('modules')
                .select(`*, lessons(*)`)
                .eq('course_id', courseId)
                .order('order_index', { ascending: true });

            if (error) throw error;

            // Sort lessons within each module
            const sorted = (data || []).map(m => ({
                ...m,
                lessons: (m.lessons || []).sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)
            }));

            setModules(sorted);
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
        }
    };

    // ─── Module CRUD ───
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setModules((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    order_index: index
                }));
                updateModuleOrders(updates);
                return newItems;
            });
        }
    };

    const updateModuleOrders = async (updates: { id: string; order_index: number }[]) => {
        try {
            for (const update of updates) {
                await supabase
                    .from('modules')
                    .update({ order_index: update.order_index })
                    .eq('id', update.id);
            }
        } catch (error) {
            console.error('Error updating module order:', error);
            fetchModules();
        }
    };

    const handleDeleteModule = async (id: string) => {
        if (!confirm('Eliminare questo mondo e tutte le sue lezioni? Azione irreversibile.')) return;
        try {
            // Delete lessons first (cascade may handle this, but be explicit)
            await supabase.from('lessons').delete().eq('module_id', id);
            const { error } = await supabase.from('modules').delete().eq('id', id);
            if (error) throw error;
            setModules(items => items.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting module:', error);
        }
    };

    const handleToggleLock = async (id: string, currentLocked: boolean) => {
        try {
            await supabase.from('modules').update({ is_locked: !currentLocked }).eq('id', id);
            setModules(items => items.map(m => m.id === id ? { ...m, is_locked: !currentLocked } : m));
        } catch (error) {
            console.error('Error toggling lock:', error);
        }
    };

    const handleSaveModule = async (data: { title: string; description: string }) => {
        try {
            if (editingModule) {
                const { error } = await supabase
                    .from('modules')
                    .update({ title: data.title, description: data.description })
                    .eq('id', editingModule.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('modules')
                    .insert([{
                        course_id: courseId,
                        title: data.title,
                        description: data.description,
                        order_index: modules.length,
                        is_locked: false
                    }]);
                if (error) throw error;
            }
            setShowModuleModal(false);
            setEditingModule(null);
            fetchModules();
        } catch (error) {
            console.error('Error saving module:', error);
            alert('Errore nel salvataggio del mondo');
        }
    };

    // ─── Lesson CRUD ───
    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('Eliminare questa lezione?')) return;
        try {
            const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
            if (error) throw error;
            fetchModules();
        } catch (error) {
            console.error('Error deleting lesson:', error);
        }
    };

    const handleSaveLesson = async (data: { title: string; description: string; video_url: string; video_provider: string; duration_minutes: number; resources: string }) => {
        try {
            let parsedResources: any = '[]';
            try { parsedResources = JSON.parse(data.resources || '[]'); } catch { parsedResources = []; }

            if (editingLesson) {
                const { error } = await supabase
                    .from('lessons')
                    .update({
                        title: data.title,
                        description: data.description,
                        video_url: data.video_url || null,
                        video_provider: data.video_provider || 'custom',
                        duration_minutes: data.duration_minutes || null,
                        resources: parsedResources
                    })
                    .eq('id', editingLesson.id);
                if (error) throw error;
            } else if (activeModuleIdForLesson) {
                // Count existing lessons in this module
                const mod = modules.find(m => m.id === activeModuleIdForLesson);
                const nextOrder = mod?.lessons?.length || 0;

                const { error } = await supabase
                    .from('lessons')
                    .insert([{
                        module_id: activeModuleIdForLesson,
                        title: data.title,
                        description: data.description,
                        video_url: data.video_url || null,
                        video_provider: data.video_provider || 'custom',
                        duration_minutes: data.duration_minutes || null,
                        order_index: nextOrder,
                        resources: parsedResources
                    }]);
                if (error) throw error;
            }
            setShowLessonModal(false);
            setEditingLesson(null);
            setActiveModuleIdForLesson(null);
            fetchModules();
        } catch (error) {
            console.error('Error saving lesson:', error);
            alert('Errore nel salvataggio della lezione');
        }
    };

    // Count total lessons
    const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex overflow-hidden">
            {/* Sidebar / Module List */}
            <div className="w-1/3 border-r border-white/10 flex flex-col bg-gray-900/50">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">🌍 Mondi del Corso</h2>
                        <p className="text-sm text-gray-400">{modules.length} mondi · {totalLessons} lezioni totali</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-purple-500/30">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        <>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={modules.map(m => m.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {modules.map((module) => (
                                        <SortableModuleItem
                                            key={module.id}
                                            module={module}
                                            onEdit={() => { setEditingModule(module); setShowModuleModal(true); }}
                                            onDelete={() => handleDeleteModule(module.id)}
                                            onToggleLock={() => handleToggleLock(module.id, module.is_locked)}
                                            expanded={expandedModuleId === module.id}
                                            onToggleExpand={() => setExpandedModuleId(expandedModuleId === module.id ? null : module.id)}
                                            onEditLesson={(lesson) => { setEditingLesson(lesson); setActiveModuleIdForLesson(module.id); setShowLessonModal(true); }}
                                            onDeleteLesson={(lessonId) => handleDeleteLesson(lessonId)}
                                            onAddLesson={() => { setEditingLesson(null); setActiveModuleIdForLesson(module.id); setShowLessonModal(true); }}
                                            onManageQuiz={() => { setActiveModuleIdForQuiz({ id: module.id, title: module.title }); setShowQuizModal(true); }}
                                            lessonSensors={sensors}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>

                            <button
                                onClick={() => { setEditingModule(null); setShowModuleModal(true); }}
                                className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Plus size={20} />
                                Aggiungi Mondo
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Right Panel — Editor */}
            <div className="flex-1 bg-black p-10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                {showModuleModal ? (
                    <ModuleEditor
                        module={editingModule}
                        onSave={handleSaveModule}
                        onCancel={() => { setShowModuleModal(false); setEditingModule(null); }}
                    />
                ) : showLessonModal ? (
                    <LessonEditor
                        lesson={editingLesson}
                        onSave={handleSaveLesson}
                        onCancel={() => { setShowLessonModal(false); setEditingLesson(null); setActiveModuleIdForLesson(null); }}
                    />
                ) : showQuizModal && activeModuleIdForQuiz ? (
                    <QuizBuilder
                        moduleId={activeModuleIdForQuiz.id}
                        moduleTitle={activeModuleIdForQuiz.title}
                        onClose={() => { setShowQuizModal(false); setActiveModuleIdForQuiz(null); }}
                    />
                ) : (
                    <div className="text-center text-gray-500">
                        <Layout size={64} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold mb-2">Seleziona o Crea un Mondo</h3>
                        <p>Espandi un mondo per gestire le sue lezioni.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ──────── Module (World) Editor ────────

const ModuleEditor = ({
    module,
    onSave,
    onCancel
}: {
    module: CourseModule | null;
    onSave: (data: { title: string; description: string }) => void;
    onCancel: () => void;
}) => {
    const [title, setTitle] = useState(module?.title || '');
    const [description, setDescription] = useState(module?.description || '');

    return (
        <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                    {module ? '✏️ Modifica Mondo' : '🌍 Nuovo Mondo'}
                </h2>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Annulla</button>
                    <button
                        onClick={() => onSave({ title, description })}
                        disabled={!title.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-600/20"
                    >
                        <Save size={18} /> Salva
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Nome del Mondo</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-lg focus:border-purple-500/50 focus:outline-none"
                        placeholder="Es: Mastermind 1: ORIGINE"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Sottotitolo / Descrizione</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none h-28 resize-none"
                        placeholder="Dove la storia respira per la prima volta..."
                    />
                </div>
            </div>
        </div>
    );
};

// ──────── Lesson Editor ────────

const LessonEditor = ({
    lesson,
    onSave,
    onCancel
}: {
    lesson: Lesson | null;
    onSave: (data: { title: string; description: string; video_url: string; video_provider: string; duration_minutes: number; resources: string }) => void;
    onCancel: () => void;
}) => {
    const [form, setForm] = useState({
        title: lesson?.title || '',
        description: lesson?.description || '',
        video_url: lesson?.video_url || '',
        video_provider: lesson?.video_provider || 'custom',
        duration_minutes: lesson?.duration_minutes || 15,
        resources: JSON.stringify(lesson?.resources || [], null, 2),
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Youtube.configure({ controls: false }),
            Image,
        ],
        content: lesson?.description || '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px]',
            },
        },
    });

    const handleSave = () => {
        onSave({
            ...form,
            description: editor?.getText() || form.description,
        });
    };

    return (
        <div className="w-full max-w-4xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                    {lesson ? '✏️ Modifica Lezione' : '📖 Nuova Lezione'}
                </h2>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Annulla</button>
                    <button
                        onClick={handleSave}
                        disabled={!form.title.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-600/20"
                    >
                        <Save size={18} /> Salva Lezione
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Titolo Lezione</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none"
                            placeholder="Es: Il Chiamare la Storia"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Video URL (opzionale)</label>
                        <input
                            type="text"
                            value={form.video_url}
                            onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none"
                            placeholder="https://youtube.com/... o https://vimeo.com/..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Provider Video</label>
                        <select
                            value={form.video_provider}
                            onChange={e => setForm(f => ({ ...f, video_provider: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none"
                        >
                            <option value="custom">Custom / Upload</option>
                            <option value="youtube">YouTube</option>
                            <option value="vimeo">Vimeo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Durata (minuti)</label>
                        <input
                            type="number"
                            value={form.duration_minutes}
                            onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* RICH TEXT EDITOR for description */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-white/5 border-b border-white/10 p-2 flex gap-2">
                    <MenuButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')}>B</MenuButton>
                    <MenuButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')}>I</MenuButton>
                    <MenuButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })}>H2</MenuButton>
                    <MenuButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')}>List</MenuButton>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};

// ──────── Toolbar Button ────────

const MenuButton = ({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active?: boolean }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded font-bold text-sm transition-colors ${active ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
    >
        {children}
    </button>
);
