
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Mic } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    result: string;
    before_url: string; // URL to audio file (or mock)
    after_url: string; // URL to audio file (or mock)
    avatar_initials: string;
    product_tag: 'storytelling' | 'podcasting';
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: '1',
        name: 'Marco V.',
        role: 'Consulente Finanziario',
        result: 'Ha chiuso un deal da €15k in 20 minuti',
        avatar_initials: 'MV',
        before_url: '/audio/testimonials/marco_before.mp3',
        after_url: '/audio/testimonials/marco_after.mp3',
        product_tag: 'storytelling'
    },
    {
        id: '2',
        name: 'Giulia R.',
        role: 'Life Coach',
        result: 'Podcast passato da 200 a 3.000 ascolti',
        avatar_initials: 'GR',
        before_url: '/audio/testimonials/giulia_before.mp3',
        after_url: '/audio/testimonials/giulia_after.mp3',
        product_tag: 'podcasting'
    },
    {
        id: '3',
        name: 'Alessandro B.',
        role: 'CEO Startup',
        result: 'Investitori convinti al primo pitch',
        avatar_initials: 'AB',
        before_url: '/audio/testimonials/alex_before.mp3',
        after_url: '/audio/testimonials/alex_after.mp3',
        product_tag: 'storytelling'
    },
    {
        id: '4',
        name: 'Davide C.',
        role: 'Speaker Radiofonico',
        result: 'Voce profonda e controllata in 30 giorni',
        avatar_initials: 'DC',
        before_url: '/audio/testimonials/davide_before.mp3',
        after_url: '/audio/testimonials/davide_after.mp3',
        product_tag: 'podcasting'
    }
];

export const VoiceTestimonials: React.FC = () => {
    const [activeId, setActiveId] = useState<string>(TESTIMONIALS[0].id);
    const [isPlaying, setIsPlaying] = useState(false);
    const [mode, setMode] = useState<'before' | 'after'>('after'); // Default to showing result first? No, let's explore.
    const [filter, setFilter] = useState<'all' | 'storytelling' | 'podcasting'>('all');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const filteredTestimonials = filter === 'all'
        ? TESTIMONIALS
        : TESTIMONIALS.filter(t => t.product_tag === filter);

    // Reset active ID when filter changes if current active is not in list
    useEffect(() => {
        if (!filteredTestimonials.find(t => t.id === activeId)) {
            if (filteredTestimonials.length > 0) {
                setActiveId(filteredTestimonials[0].id);
            }
        }
    }, [filter, activeId, filteredTestimonials]);

    const activeTestimonial = TESTIMONIALS.find(t => t.id === activeId);

    const handlePlayToggle = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // In a real app, play the specific file.
            // For now we might not have files, so let's simulate or just handle UI state
            // If we had files: audioRef.current.src = mode === 'before' ? activeTestimonial?.before_url : activeTestimonial?.after_url;
            audioRef.current.play().catch(e => console.log("Audio play error (expected if no file)", e));
        }
        setIsPlaying(!isPlaying);
    };

    // Auto-pause when switching
    useEffect(() => {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [activeId, mode]);

    return (
        <section className="w-full py-24 bg-lux-black relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-lux-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lux-gold/10 border border-lux-gold/20 text-lux-gold text-xs uppercase tracking-widest mb-4">
                        <Mic size={14} />
                        <span>Voice of the Sovereign</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6">
                        Non Crederci. <span className="text-lux-gold font-serif italic">Ascolta.</span>
                    </h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
                        La differenza tra una voce che chiede permesso e una che comanda attenzione.
                        Il risultato del Protocollo Vox Aurea.
                    </p>

                    {/* Filters */}
                    <div className="inline-flex bg-zinc-900 p-1 rounded-lg border border-white/10">
                        {(['all', 'storytelling', 'podcasting'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filter === f
                                    ? 'bg-zinc-800 text-white shadow-lg border border-white/10'
                                    : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                {f === 'all' ? 'Tutti' : f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* List */}
                    <div className="lg:col-span-4 space-y-4">
                        {filteredTestimonials.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveId(t.id)}
                                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${activeId === t.id
                                    ? 'bg-zinc-900 border-lux-gold/50 shadow-[0_0_20px_rgba(228,197,114,0.1)]'
                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lux-black shrink-0 ${activeId === t.id ? 'bg-lux-gold' : 'bg-zinc-700 text-zinc-400'
                                    }`}>
                                    {t.avatar_initials}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <div className={`font-bold truncate ${activeId === t.id ? 'text-white' : 'text-zinc-400'}`}>
                                        {t.name}
                                    </div>
                                    <div className="text-xs text-lux-gold/80 uppercase tracking-wider truncate">
                                        {t.role}
                                    </div>
                                    <div className="text-[10px] text-zinc-600 mt-1 flex items-center gap-1">
                                        <span className={`w-2 h-2 rounded-full ${t.product_tag === 'storytelling' ? 'bg-amber-500' : 'bg-purple-500'}`}></span>
                                        {t.product_tag === 'storytelling' ? 'Storytelling' : 'Podcasting'}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Player Card */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeId}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="relative bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden"
                            >
                                {/* Glow Effect */}
                                <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full transition-colors duration-500 ${mode === 'after' ? 'bg-lux-gold/10' : 'bg-gray-500/10'
                                    }`}></div>

                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{activeTestimonial?.result}</h3>
                                        <p className="text-zinc-500">Risultato verificato • Protocollo Matrice</p>
                                    </div>

                                    {/* Toggle Switch */}
                                    <div className="flex bg-black/50 p-1 rounded-full border border-white/10">
                                        <button
                                            onClick={() => setMode('before')}
                                            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mode === 'before'
                                                ? 'bg-zinc-700 text-white shadow-lg'
                                                : 'text-zinc-500 hover:text-white'
                                                }`}
                                        >
                                            Prima
                                        </button>
                                        <button
                                            onClick={() => setMode('after')}
                                            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mode === 'after'
                                                ? 'bg-gradient-to-r from-lux-gold to-amber-500 text-black shadow-[0_0_15px_rgba(228,197,114,0.4)]'
                                                : 'text-zinc-500 hover:text-white'
                                                }`}
                                        >
                                            Dopo
                                        </button>
                                    </div>
                                </div>

                                {/* Visualizer / Play Area */}
                                <div className="flex flex-col items-center justify-center py-8">
                                    {/* Fake Waveform Visualization */}
                                    <div className="flex items-center justify-center gap-1 h-24 w-full max-w-md mb-8">
                                        {[...Array(20)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    height: isPlaying
                                                        ? [20, Math.random() * 80 + 20, 20]
                                                        : 20,
                                                    opacity: isPlaying ? 1 : 0.5
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    repeat: Infinity,
                                                    delay: i * 0.05
                                                }}
                                                className={`w-2 rounded-full ${mode === 'after' ? 'bg-lux-gold' : 'bg-zinc-600'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={handlePlayToggle}
                                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${mode === 'after'
                                            ? 'bg-lux-gold text-black shadow-[0_0_30px_rgba(228,197,114,0.4)] hover:shadow-[0_0_50px_rgba(228,197,114,0.6)]'
                                            : 'bg-zinc-700 text-white hover:bg-zinc-600'
                                            }`}
                                    >
                                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                    </button>

                                    <div className="mt-6 text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
                                        {isPlaying ? (mode === 'after' ? 'Frequenza Sovrana' : 'Frequenza Fantasma') : 'Premi Play per Ascoltare'}
                                    </div>
                                </div>

                                {/* Hidden Audio Element for Logic needed later */}
                                <audio ref={audioRef} />

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};
