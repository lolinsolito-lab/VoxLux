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
    ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';

interface CourseModule {
    id: string;
    course_id: string;
    title: string;
    description: string;
    module_order: number;
    content_type: 'lesson' | 'quiz' | 'video' | 'assignment';
    content_data: any;
    xp_reward: number;
    is_locked: boolean;
}

interface ModuleBuilderProps {
    courseId: string;
    onClose: () => void;
}

// Sortable Module Item Component
const SortableModuleItem = ({
    module,
    onEdit,
    onDelete,
    expanded,
    onToggleExpand
}: {
    module: CourseModule;
    onEdit: () => void;
    onDelete: () => void;
    expanded: boolean;
    onToggleExpand: () => void;
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
                                #{module.module_order + 1}
                            </span>
                            <h4 className="font-bold text-white text-lg">{module.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${module.content_type === 'video' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    module.content_type === 'quiz' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                        'bg-green-500/20 text-green-400 border-green-500/30'
                                }`}>
                                {module.content_type}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20 mr-2">
                            <span>+{module.xp_reward} XP</span>
                        </div>
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

                {/* Expanded Content Preview (Simplistic) */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-white/5 bg-black/20"
                        >
                            <div className="p-4 text-sm text-gray-400">
                                <p className="mb-2"><strong className="text-gray-300">Descrizione:</strong> {module.description || 'Nessuna descrizione'}</p>
                                {/* Add more preview details here */}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const ModuleBuilder: React.FC<ModuleBuilderProps> = ({ courseId, onClose }) => {
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
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

    const fetchModules = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('course_modules')
                .select('*')
                .eq('course_id', courseId)
                .order('module_order', { ascending: true });

            if (error) throw error;
            setModules(data || []);
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setModules((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update orders in DB
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    module_order: index
                }));

                updateModuleOrders(updates);

                return newItems; // Optimistic update
            });
        }
    };

    const updateModuleOrders = async (updates: { id: string; module_order: number }[]) => {
        try {
            for (const update of updates) {
                await supabase
                    .from('course_modules')
                    .update({ module_order: update.module_order })
                    .eq('id', update.id);
            }
        } catch (error) {
            console.error('Error updating module order:', error);
            fetchModules(); // Revert on error
        }
    };

    const handleDeleteModule = async (id: string) => {
        if (!confirm('Sei sicuro di voler eliminare questo modulo?')) return;

        try {
            const { error } = await supabase
                .from('course_modules')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setModules(items => items.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting module:', error);
        }
    };

    const handleSaveModule = async (moduleData: Partial<CourseModule>) => {
        try {
            if (editingModule) {
                // Update
                const { error } = await supabase
                    .from('course_modules')
                    .update(moduleData)
                    .eq('id', editingModule.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('course_modules')
                    .insert([{
                        ...moduleData,
                        course_id: courseId,
                        module_order: modules.length // Append to end
                    }]);
                if (error) throw error;
            }
            setShowEditModal(false);
            setEditingModule(null);
            fetchModules();
        } catch (error) {
            console.error('Error saving module:', error);
            alert('Errore nel salvataggio del modulo');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex overflow-hidden">
            {/* Sidebar / List */}
            <div className="w-1/3 border-r border-white/10 flex flex-col bg-gray-900/50">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Moduli Corso</h2>
                        <p className="text-sm text-gray-400">{modules.length} lezioni totali</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-purple-500/30">
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
                                    onEdit={() => { setEditingModule(module); setShowEditModal(true); }}
                                    onDelete={() => handleDeleteModule(module.id)}
                                    expanded={expandedModuleId === module.id}
                                    onToggleExpand={() => setExpandedModuleId(expandedModuleId === module.id ? null : module.id)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <button
                        onClick={() => { setEditingModule(null); setShowEditModal(true); }}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                        <Plus size={20} />
                        Aggiungi Modulo
                    </button>
                </div>
            </div>

            {/* Preview / Edit Area (Placeholder for now, or immediate edit modal) */}
            <div className="flex-1 bg-black p-10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                {showEditModal ? (
                    <ModuleEditor
                        module={editingModule}
                        onSave={handleSaveModule}
                        onCancel={() => setShowEditModal(false)}
                    />
                ) : (
                    <div className="text-center text-gray-500">
                        <Layout size={64} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold mb-2">Seleziona o Crea un Modulo</h3>
                        <p>Gestisci i contenuti, video e quiz del tuo corso.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Sub-component: Module Editor (TipTap Integration) ---

const ModuleEditor = ({
    module,
    onSave,
    onCancel
}: {
    module: CourseModule | null,
    onSave: (data: any) => void,
    onCancel: () => void
}) => {
    const [form, setForm] = useState({
        title: module?.title || '',
        description: module?.description || '',
        content_type: module?.content_type || 'lesson',
        xp_reward: module?.xp_reward || 100,
        content_data: module?.content_data || {} // TipTap JSON content
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Youtube.configure({ controls: false }),
            Image,
        ],
        content: form.content_data,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px]',
            },
        },
    });

    const handleSave = () => {
        onSave({
            ...form,
            content_data: editor?.getJSON() // Save rich text content
        });
    };

    return (
        <div className="w-full max-w-4xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                    {module ? 'Modifica Modulo' : 'Nuovo Modulo'}
                </h2>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                        Annulla
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-600/20"
                    >
                        <Save size={18} />
                        Salva Modulo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Titolo Modulo</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none"
                            placeholder="Titolo della lezione..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Descrizione Breve</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none h-20 resize-none"
                            placeholder="Cosa imparerà lo studente..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Tipo Contenuto</label>
                        <select
                            value={form.content_type}
                            onChange={e => setForm(f => ({ ...f, content_type: e.target.value as any }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none"
                        >
                            <option value="lesson">Lezione (Testo/Video)</option>
                            <option value="video">Solo Video</option>
                            <option value="quiz">Quiz</option>
                            <option value="assignment">Assignment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">XP Reward</label>
                        <input
                            type="number"
                            value={form.xp_reward}
                            onChange={e => setForm(f => ({ ...f, xp_reward: parseInt(e.target.value) }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* RICH TEXT EDITOR */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-white/5 border-b border-white/10 p-2 flex gap-2">
                    {/* Toolbar (Simplified) */}
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

const MenuButton = ({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active?: boolean }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded font-bold text-sm transition-colors ${active ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
    >
        {children}
    </button>
);
