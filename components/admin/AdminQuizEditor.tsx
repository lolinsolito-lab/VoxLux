import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Loader, Save, Plus, Trash2, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';

interface AdminModule {
    id: string; // UUID
    slug: string;
    title: string;
    course_id: string;
}

interface AdminQuiz {
    id: string;
    module_id: string;
    title: string;
    description: string;
    passing_score: number;
    questions: any[]; // JSON
}

export const AdminQuizEditor: React.FC = () => {
    const [modules, setModules] = useState<AdminModule[]>([]);
    const [quizzes, setQuizzes] = useState<Record<string, AdminQuiz>>({}); // Key: module_id
    const [loading, setLoading] = useState(true);
    const [selectedModule, setSelectedModule] = useState<AdminModule | null>(null);

    // Editor State
    const [editData, setEditData] = useState<Partial<AdminQuiz>>({
        title: 'Nuovo Quiz',
        description: 'Descrizione del quiz...',
        passing_score: 80,
        questions: []
    });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initial Load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Modules (Storytelling & Podcast)
            const { data: mods, error: modErr } = await supabase
                .from('modules')
                .select('id, slug, title, course_id')
                .order('slug', { ascending: true });

            if (modErr) throw modErr;
            setModules(mods || []);

            // 2. Fetch Existing Quizzes
            const { data: qz, error: qzErr } = await supabase
                .from('quizzes')
                .select('*');

            if (qzErr) throw qzErr;

            // Map quizzes by module_id for easy lookup
            const quizMap: Record<string, AdminQuiz> = {};
            qz?.forEach(q => {
                quizMap[q.module_id] = q;
            });
            setQuizzes(quizMap);

        } catch (err) {
            console.error('Error loading admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectModule = (mod: AdminModule) => {
        setSelectedModule(mod);
        const existing = quizzes[mod.id];
        if (existing) {
            setEditData({ ...existing });
        } else {
            // Default template
            setEditData({
                module_id: mod.id,
                title: `Quiz: ${mod.title}`,
                description: 'Verifica la tua comprensione del modulo.',
                passing_score: 80,
                questions: [
                    {
                        id: "q1",
                        text: "Domanda di esempio?",
                        options: [
                            { "text": "Risposta Sbagliata", "isCorrect": false },
                            { "text": "Risposta Corretta", "isCorrect": true }
                        ]
                    }
                ]
            });
        }
        setMsg(null);
    };

    const handleSave = async () => {
        if (!selectedModule) return;
        setSaving(true);
        setMsg(null);

        try {
            // Upsert based on module_id (since 1 quiz per module usually)
            // But we need to handle ID.
            const payload = {
                module_id: selectedModule.id,
                title: editData.title,
                description: editData.description,
                passing_score: editData.passing_score,
                questions: editData.questions
            };

            const existingId = quizzes[selectedModule.id]?.id;

            let error;
            if (existingId) {
                const { error: e } = await supabase
                    .from('quizzes')
                    .update(payload)
                    .eq('id', existingId);
                error = e;
            } else {
                const { error: e } = await supabase
                    .from('quizzes')
                    .insert(payload);
                error = e;
            }

            if (error) throw error;
            setMsg({ type: 'success', text: 'Quiz salvato con successo!' });
            fetchData(); // Refresh list

        } catch (err: any) {
            console.error('Save error:', err);
            setMsg({ type: 'error', text: err.message || 'Errore durante il salvataggio' });
        } finally {
            setSaving(false);
        }
    };

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            const parsed = JSON.parse(e.target.value);
            setEditData(prev => ({ ...prev, questions: parsed }));
            setMsg(null);
        } catch (err) {
            // Invalid JSON, just don't update state yet or show warning (optional)
        }
    };

    if (loading) return <div className="p-8"><Loader className="animate-spin text-amber-500" /></div>;

    return (
        <div className="flex h-full bg-black text-gray-200 font-sans">
            {/* Sidebar: Module List */}
            <div className="w-1/3 border-r border-white/10 overflow-y-auto p-4">
                <h2 className="text-xl font-display font-bold text-white mb-6">Moduli</h2>
                <div className="space-y-2">
                    {modules.map(mod => {
                        const hasQuiz = !!quizzes[mod.id];
                        return (
                            <div
                                key={mod.id}
                                onClick={() => handleSelectModule(mod)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${selectedModule?.id === mod.id
                                        ? 'bg-amber-500/20 border-amber-500 text-white'
                                        : 'bg-white/5 border-transparent hover:bg-white/10'
                                    }`}
                            >
                                <div>
                                    <div className="text-xs uppercase tracking-widest text-gray-500">{mod.slug}</div>
                                    <div className="font-medium truncate max-w-[200px]">{mod.title}</div>
                                </div>
                                {hasQuiz && <CheckCircle size={16} className="text-emerald-500" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Area: Editor */}
            <div className="flex-1 p-8 overflow-y-auto">
                {selectedModule ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-white">Editor Quiz</h1>
                                <p className="text-amber-500">{selectedModule.title} ({selectedModule.slug})</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-bold transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                Salva Quiz
                            </button>
                        </div>

                        {msg && (
                            <div className={`p-4 rounded border ${msg.type === 'success' ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300' : 'bg-red-900/30 border-red-500 text-red-300'}`}>
                                {msg.text}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-500 mb-2">Titolo Quiz</label>
                                <input
                                    type="text"
                                    value={editData.title || ''}
                                    onChange={e => setEditData({ ...editData, title: e.target.value })}
                                    className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-500 mb-2">Punteggio Minimo (%)</label>
                                <input
                                    type="number"
                                    value={editData.passing_score || 80}
                                    onChange={e => setEditData({ ...editData, passing_score: parseInt(e.target.value) })}
                                    className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-gray-500 mb-2">Descrizione</label>
                            <textarea
                                value={editData.description || ''}
                                onChange={e => setEditData({ ...editData, description: e.target.value })}
                                rows={3}
                                className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-xs uppercase text-gray-500">Domande (JSON)</label>
                                <span className="text-xs text-gray-600">Modifica direttamente il JSON per aggiungere domande</span>
                            </div>
                            <textarea
                                defaultValue={JSON.stringify(editData.questions, null, 4)}
                                onChange={handleJsonChange}
                                rows={20}
                                className="w-full bg-black/50 border border-white/20 rounded p-3 text-emerald-400 font-mono text-sm focus:border-amber-500 outline-none"
                            />
                        </div>

                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600">
                        <ChevronRight size={48} className="mb-4" />
                        <p>Seleziona un modulo per creare o modificare il quiz.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
