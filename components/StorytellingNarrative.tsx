import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    EyeOff, Eye, Target, Sparkles, BookOpen, Mic,
    ArrowRight, CheckCircle2, XCircle, Crown, Zap
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SECTION 1 — "IL PROBLEMA"
   Emotional pain points the visitor identifies with
   ───────────────────────────────────────────── */

const painPoints = [
    {
        icon: EyeOff,
        title: "Sei invisibile",
        description: "Pubblichi contenuti, parli in pubblico, scrivi post... ma nessuno ti ascolta davvero. Il problema non sei tu — è come comunichi."
    },
    {
        icon: Target,
        title: "I tuoi competitor vincono",
        description: "Hanno meno competenze di te, ma sanno raccontarsi meglio. I clienti scelgono chi li fa sentire qualcosa, non chi è più preparato."
    },
    {
        icon: Zap,
        title: "La tua voce non comanda",
        description: "Quando parli, le persone scrollano. Quando presenti, annuiscono ma non comprano. Ti manca l'elemento che trasforma parole in autorevolezza."
    }
];

/* ─────────────────────────────────────────────
   SECTION 2 — "LA TRASFORMAZIONE"
   Before → After visual contrast
   ───────────────────────────────────────────── */

const beforeItems = [
    "Post che nessuno legge fino in fondo",
    "Presentazioni che annoiano",
    "Contenuti generici e dimenticabili",
    "Voce piatta e poco convincente",
    "Autorevolezza percepita zero"
];

const afterItems = [
    "Storie che bloccano lo scroll",
    "Pitch che fanno firmare contratti",
    "Messaggi che restano in testa per giorni",
    "Una voce che comanda attenzione",
    "Riconosciuto come punto di riferimento"
];

/* ─────────────────────────────────────────────
   SECTION 3 — "DENTRO IL PERCORSO"
   Preview of what's inside the Masterminds
   ───────────────────────────────────────────── */

const worldsPreview = [
    {
        world: "01",
        title: "L'Identità Narrativa",
        desc: "Scopri la storia che solo tu puoi raccontare.",
        type: "storytelling" as const
    },
    {
        world: "02",
        title: "Il Framework Persuasivo",
        desc: "La struttura usata da TED Talk e brand da miliardi.",
        type: "storytelling" as const
    },
    {
        world: "03",
        title: "Emozione Calibrata",
        desc: "Come far provare esattamente quello che vuoi.",
        type: "storytelling" as const
    },
    {
        world: "01",
        title: "La Voce che Comanda",
        desc: "Setup vocale professionale da zero.",
        type: "podcast" as const
    },
    {
        world: "02",
        title: "Architettura Audio",
        desc: "Qualità broadcast con qualsiasi budget.",
        type: "podcast" as const
    },
    {
        world: "03",
        title: "Magnetismo Vocale",
        desc: "Ritmo, pause e tono che ipnotizzano.",
        type: "podcast" as const
    }
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export const StorytellingNarrative: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'storytelling' | 'podcast'>('storytelling');

    return (
        <div className="w-full relative">

            {/* ━━━ SECTION 1: IL PROBLEMA ━━━ */}
            <section className="py-20 md:py-32 px-6">
                <div className="max-w-5xl mx-auto">

                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-xs uppercase tracking-[0.4em] text-red-400/80 mb-4 font-bold">
                            Il vero problema
                        </p>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                            Hai le competenze.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                                Ti manca la voce.
                            </span>
                        </h2>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent mx-auto"></div>
                    </motion.div>

                    {/* Pain Point Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {painPoints.map((point, i) => (
                            <motion.div
                                key={i}
                                className="group relative p-8 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-red-400/20 transition-all duration-500"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-30px" }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                            >
                                {/* Subtle glow on hover */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-red-900/0 to-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                                        <point.icon className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-display font-bold text-white mb-3">
                                        {point.title}
                                    </h3>
                                    <p className="text-stone-400 text-sm lg:text-base leading-relaxed">
                                        {point.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="w-full max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* ━━━ SECTION 2: LA TRASFORMAZIONE ━━━ */}
            <section className="py-20 md:py-32 px-6">
                <div className="max-w-5xl mx-auto">

                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-xs uppercase tracking-[0.4em] text-lux-gold/80 mb-4 font-bold">
                            La trasformazione
                        </p>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                            Da ignorato a<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lux-gold to-amber-300">
                                punto di riferimento.
                            </span>
                        </h2>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-lux-gold/50 to-transparent mx-auto"></div>
                    </motion.div>

                    {/* Before / After Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                        {/* BEFORE */}
                        <motion.div
                            className="relative rounded-xl p-8 bg-white/[0.02] border border-white/[0.06]"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <EyeOff className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-red-400/80 font-bold">PRIMA</p>
                                    <p className="text-stone-500 text-xs">Come comunichi oggi</p>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                {beforeItems.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        className="flex items-start gap-3 text-stone-400 text-sm"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                    >
                                        <XCircle className="w-4 h-4 text-red-400/60 mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* AFTER */}
                        <motion.div
                            className="relative rounded-xl p-8 bg-gradient-to-b from-lux-gold/[0.04] to-transparent border border-lux-gold/10"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Gold glow effect */}
                            <div className="absolute -top-1 -left-1 -right-1 h-px bg-gradient-to-r from-transparent via-lux-gold/40 to-transparent"></div>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center">
                                    <Eye className="w-5 h-5 text-lux-gold" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-lux-gold/80 font-bold">DOPO VOX AUREA</p>
                                    <p className="text-stone-500 text-xs">Come comunicherai</p>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                {afterItems.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        className="flex items-start gap-3 text-stone-300 text-sm"
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-lux-gold mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="w-full max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* ━━━ SECTION 3: DENTRO IL PERCORSO ━━━ */}
            <section className="py-20 md:py-32 px-6">
                <div className="max-w-5xl mx-auto">

                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-xs uppercase tracking-[0.4em] text-lux-cyan/80 mb-4 font-bold">
                            Uno sguardo dentro
                        </p>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                            20 Mondi da esplorare.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lux-cyan to-blue-400">
                                Eccone un assaggio.
                            </span>
                        </h2>
                        <p className="text-stone-400 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
                            Ogni Mastermind è composto da 10 Mondi — moduli immersivi che trasformano la teoria in abilità reali, passo dopo passo.
                        </p>
                    </motion.div>

                    {/* Tab Switcher */}
                    <div className="flex justify-center gap-2 mb-12">
                        <button
                            onClick={() => setActiveTab('storytelling')}
                            className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 ${activeTab === 'storytelling'
                                ? 'bg-lux-gold/20 text-lux-gold border border-lux-gold/30 shadow-[0_0_15px_rgba(228,197,114,0.15)]'
                                : 'bg-white/5 text-stone-500 border border-white/10 hover:text-stone-300'
                                }`}
                        >
                            <BookOpen className="w-3.5 h-3.5 inline mr-2 -mt-0.5" />
                            Storytelling
                        </button>
                        <button
                            onClick={() => setActiveTab('podcast')}
                            className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 ${activeTab === 'podcast'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-[0_0_15px_rgba(96,165,250,0.15)]'
                                : 'bg-white/5 text-stone-500 border border-white/10 hover:text-stone-300'
                                }`}
                        >
                            <Mic className="w-3.5 h-3.5 inline mr-2 -mt-0.5" />
                            Podcasting
                        </button>
                    </div>

                    {/* World Cards Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            className="grid grid-cols-1 md:grid-cols-3 gap-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {worldsPreview
                                .filter(w => w.type === activeTab)
                                .map((world, i) => (
                                    <motion.div
                                        key={`${activeTab}-${i}`}
                                        className={`group relative p-6 rounded-xl border transition-all duration-500 ${activeTab === 'storytelling'
                                            ? 'bg-gradient-to-b from-amber-900/[0.06] to-transparent border-lux-gold/10 hover:border-lux-gold/25'
                                            : 'bg-gradient-to-b from-blue-900/[0.06] to-transparent border-blue-400/10 hover:border-blue-400/25'
                                            }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                    >
                                        {/* World Number */}
                                        <div className={`text-5xl font-display font-black mb-3 ${activeTab === 'storytelling' ? 'text-lux-gold/10' : 'text-blue-400/10'
                                            }`}>
                                            {world.world}
                                        </div>

                                        <h3 className="text-lg font-display font-bold text-white mb-2">
                                            {world.title}
                                        </h3>
                                        <p className="text-stone-400 text-sm leading-relaxed">
                                            {world.desc}
                                        </p>

                                        {/* "More" hint */}
                                        <div className={`mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeTab === 'storytelling' ? 'text-lux-gold/60' : 'text-blue-400/60'
                                            }`}>
                                            è solo l'inizio
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </motion.div>
                                ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Bottom teaser */}
                    <motion.p
                        className="text-center text-stone-500 text-sm mt-10 italic"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        + altri 7 Mondi per ciascun Mastermind. Il percorso completo ti aspetta sotto.
                    </motion.p>
                </div>
            </section>

            {/* Final transition arrow to pricing */}
            <motion.div
                className="text-center pb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <p className="text-xs uppercase tracking-[0.4em] text-lux-gold/60 mb-4 font-bold">
                    Scegli il tuo percorso
                </p>
                <Crown className="w-8 h-8 text-lux-gold/40 mx-auto animate-bounce" />
            </motion.div>

        </div>
    );
};
