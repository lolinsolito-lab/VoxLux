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
        num: "01",
        title: "Sei invisibile",
        subtitle: "Il silenzio che uccide le carriere.",
        description: "Pubblichi, parli, scrivi — ma è come gridare in una stanza vuota. Il tuo feed è un cimitero di contenuti ignorati. Non è colpa del tuo talento. È che nessuno ti ha insegnato a trasformare competenza in magnetismo."
    },
    {
        icon: Target,
        num: "02",
        title: "I tuoi competitor vincono",
        subtitle: "E hanno la metà delle tue competenze.",
        description: "Li guardi online e pensi: 'Ma io ne so dieci volte di più.' Eppure sono loro che firmano contratti, chiudono deal, riempiono le aule. Il segreto? Non sanno di più — sanno raccontarsi meglio."
    },
    {
        icon: Zap,
        num: "03",
        title: "La tua voce non comanda",
        subtitle: "Le persone ascoltano ma non agiscono.",
        description: "Annuiscono, dicono 'interessante', poi scrollano via. Il tuo messaggio arriva alla testa ma non al cuore. Ti manca l'elemento che trasforma parole in decisioni — e decisioni in fatturato."
    }
];

/* ─────────────────────────────────────────────
   SECTION 2 — "LA TRASFORMAZIONE"
   Before → After visual contrast — storytelling mode
   ───────────────────────────────────────────── */

const beforeItems = [
    "Scrivi un post, lo pubblichi con cura — 3 like. Uno è tua madre.",
    "Presenti il tuo progetto e vedi gli occhi scivolare verso gli smartphone.",
    "I tuoi contenuti si perdono nel feed come lacrime nella pioggia.",
    "Parli e le persone aspettano che finisci. Non che dici qualcosa di importante.",
    "L'autorevolezza? Un concetto astratto. La gente ti vede come 'uno dei tanti'."
];

const afterItems = [
    "Pubblichi una storia e ti scrivono 'non riesco a smettere di leggerti'.",
    "Presenti e la stanza è in silenzio — quello buono, quello ipnotico.",
    "I tuoi messaggi restano in testa per giorni. Le persone ti citano.",
    "La tua voce entra nelle ossa. Quando parli, la gente chiude le altre tab.",
    "Non sei più 'uno dei tanti'. Sei il punto di riferimento del settore."
];

/* ─────────────────────────────────────────────
   SECTION 3 — "DENTRO IL PERCORSO"
   All 10 real modules per Mastermind
   ───────────────────────────────────────────── */

const modulesData = [
    { num: "01", title: "L'Identità Narrativa", desc: "Scopri la storia che solo tu puoi raccontare.", type: "storytelling" as const },
    { num: "02", title: "Presenza", desc: "Il tronco solido della tua comunicazione.", type: "storytelling" as const },
    { num: "03", title: "Visione", desc: "Crea immagini mentali impossibili da ignorare.", type: "storytelling" as const },
    { num: "04", title: "Frequenza", desc: "Ritmo, respiro e l'onda narrativa perfetta.", type: "storytelling" as const },
    { num: "05", title: "Archetipi", desc: "Le maschere universali che muovono le emozioni.", type: "storytelling" as const },
    { num: "06", title: "Tattica", desc: "Ganci, open loops e plot twist strategici.", type: "storytelling" as const },
    { num: "07", title: "Empatia", desc: "Tono, subtesto e intimità narrativa.", type: "storytelling" as const },
    { num: "08", title: "Ascensione", desc: "Il climax, la svolta e la risoluzione.", type: "storytelling" as const },
    { num: "09", title: "Rivelazione", desc: "De-cliché, improvvisazione e la tua verità.", type: "storytelling" as const },
    { num: "10", title: "Maestria", desc: "Autorità, eredità e il tuo capolavoro.", type: "storytelling" as const },

    { num: "01", title: "Fondazione Acustica", desc: "Setup vocale professionale da zero.", type: "podcast" as const },
    { num: "02", title: "Psicologia Vocale", desc: "Come la tua voce influenza chi ascolta.", type: "podcast" as const },
    { num: "03", title: "Architettura Sonora", desc: "Qualità broadcast con qualsiasi budget.", type: "podcast" as const },
    { num: "04", title: "Editing Strategico", desc: "Taglia, ricomponi e rendi magnetico.", type: "podcast" as const },
    { num: "05", title: "Produzione & Mix", desc: "Mix professionale per ogni piattaforma.", type: "podcast" as const },
    { num: "06", title: "Sound Design Emozionale", desc: "Suoni che creano atmosfera e immersione.", type: "podcast" as const },
    { num: "07", title: "Interviste & Storytelling", desc: "Conduci conversazioni che lasciano il segno.", type: "podcast" as const },
    { num: "08", title: "Distribuzione Globale", desc: "Pubblica ovunque e costruisci audience.", type: "podcast" as const },
    { num: "09", title: "Monetizzazione Audio", desc: "Trasforma ascolti in ricavi concreti.", type: "podcast" as const },
    { num: "10", title: "AI Voice & Legacy", desc: "Il futuro della voce e la tua eredità sonora.", type: "podcast" as const },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export const StorytellingNarrative: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'storytelling' | 'podcast'>('storytelling');
    const [showAll, setShowAll] = useState(false);

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
                            Hai le competenze<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                                Ti manca la voce
                            </span>
                        </h2>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent mx-auto"></div>
                    </motion.div>

                    {/* Pain Point Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {painPoints.map((point, i) => (
                            <motion.div
                                key={i}
                                className="group relative p-8 md:p-10 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.08] hover:border-red-400/25 transition-all duration-700 overflow-hidden"
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-30px" }}
                                transition={{ duration: 0.7, delay: i * 0.15 }}
                            >
                                {/* Top glow line */}
                                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                {/* Background glow */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-red-950/0 to-red-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative z-10">
                                    {/* Number + Icon row */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center group-hover:bg-red-500/15 group-hover:border-red-500/25 transition-all duration-500 shadow-[0_0_20px_rgba(239,68,68,0.08)]">
                                            <point.icon className="w-7 h-7 text-red-400" />
                                        </div>
                                        <span className="text-5xl font-display font-black text-red-500/[0.07] group-hover:text-red-500/[0.12] transition-colors duration-700">{point.num}</span>
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-display font-bold text-white mb-2">
                                        {point.title}
                                    </h3>
                                    <p className="text-red-300/50 text-sm italic mb-4 font-medium">
                                        {point.subtitle}
                                    </p>
                                    <p className="text-stone-400 text-sm lg:text-base leading-[1.8]">
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
                            Da rumore di fondo a<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lux-gold to-amber-300">
                                frequenza dominante
                            </span>
                        </h2>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-lux-gold/50 to-transparent mx-auto"></div>
                    </motion.div>

                    {/* Before / After Columns */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">

                        {/* VS Divider - Visible on both Mobile & Desktop */}
                        <div className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center gap-3">
                            <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                            <div className="w-12 h-12 rounded-full bg-black border-2 border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                <span className="text-xs font-bold text-white/60 tracking-wider">VS</span>
                            </div>
                            <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                        </div>

                        {/* BEFORE */}
                        <motion.div
                            className="relative rounded-2xl p-8 md:p-10 md:mr-6 bg-gradient-to-br from-red-950/20 via-black/40 to-black/20 border border-red-500/10 backdrop-blur-sm overflow-hidden group"
                            initial={{ opacity: 0, x: -40, scale: 0.95 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Subtle red glow */}
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                            <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500/5 rounded-full blur-3xl" />

                            <div className="relative z-10 flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                                    <EyeOff className="w-7 h-7 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-widest text-red-400 font-bold">PRIMA</p>
                                    <p className="text-stone-500 text-xs tracking-wide">Come comunichi oggi</p>
                                </div>
                            </div>
                            <ul className="relative z-10 space-y-6">
                                {beforeItems.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        className="flex items-start gap-4"
                                        initial={{ opacity: 0, x: -15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                                            <XCircle className="w-4 h-4 text-red-400/70" />
                                        </div>
                                        <span className="text-stone-400 text-sm md:text-[15px] leading-relaxed italic">{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* AFTER */}
                        <motion.div
                            className="relative rounded-2xl p-8 md:p-10 md:ml-6 bg-gradient-to-br from-amber-950/20 via-lux-gold/[0.03] to-black/20 border border-lux-gold/20 backdrop-blur-sm overflow-hidden group"
                            initial={{ opacity: 0, x: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            {/* Gold glow effects */}
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lux-gold/50 to-transparent" />
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-lux-gold/5 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lux-gold/20 to-transparent" />

                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lux-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <div className="relative z-10 flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-lux-gold/10 border border-lux-gold/25 flex items-center justify-center shadow-[0_0_20px_rgba(228,197,114,0.2)]">
                                    <Eye className="w-7 h-7 text-lux-gold" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-widest text-lux-gold font-bold">DOPO VOX AUREA</p>
                                    <p className="text-stone-500 text-xs tracking-wide">Come comunicherai</p>
                                </div>
                            </div>
                            <ul className="relative z-10 space-y-6">
                                {afterItems.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        className="flex items-start gap-4"
                                        initial={{ opacity: 0, x: 15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_10px_rgba(228,197,114,0.1)]">
                                            <CheckCircle2 className="w-4 h-4 text-lux-gold" />
                                        </div>
                                        <span className="text-stone-200 text-sm md:text-[15px] leading-relaxed italic">{item}</span>
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
                            10 Moduli per Mastermind<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lux-cyan to-blue-400">
                                Eccone un assaggio.
                            </span>
                        </h2>
                        <p className="text-stone-400 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
                            Ogni Mastermind è composto da 10 moduli pratici + 3 bonus esclusivi che trasformano la teoria in abilità reali.
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

                    {/* Module Cards Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeTab}-${showAll}`}
                            className={`grid gap-4 ${showAll
                                ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5 max-w-5xl'
                                : 'grid-cols-1 md:grid-cols-3 max-w-3xl'
                                } mx-auto`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {modulesData
                                .filter(m => m.type === activeTab)
                                .slice(0, showAll ? 10 : 3)
                                .map((mod, i) => (
                                    <motion.div
                                        key={`${activeTab}-${mod.num}`}
                                        className={`group relative rounded-xl border transition-all duration-500 ${showAll ? 'p-5' : 'p-6'} ${activeTab === 'storytelling'
                                            ? 'bg-gradient-to-b from-amber-900/[0.08] to-transparent border-lux-gold/15 hover:border-lux-gold/35 hover:shadow-[0_0_20px_rgba(228,197,114,0.06)]'
                                            : 'bg-gradient-to-b from-blue-900/[0.08] to-transparent border-blue-400/15 hover:border-blue-400/35 hover:shadow-[0_0_20px_rgba(96,165,250,0.06)]'
                                            }`}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                    >
                                        <div className={`${showAll ? 'text-4xl' : 'text-5xl'} font-display font-black mb-2 ${activeTab === 'storytelling' ? 'text-lux-gold/12' : 'text-blue-400/12'
                                            }`}>
                                            {mod.num}
                                        </div>
                                        <h3 className={`${showAll ? 'text-base lg:text-lg' : 'text-lg lg:text-xl'} font-display font-bold text-white mb-1.5`}>
                                            {mod.title}
                                        </h3>
                                        <p className={`text-stone-400 ${showAll ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                                            {mod.desc}
                                        </p>
                                    </motion.div>
                                ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Expand / Collapse Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${activeTab === 'storytelling'
                                ? 'border-lux-gold/20 text-lux-gold/80 hover:bg-lux-gold/10 hover:border-lux-gold/40'
                                : 'border-blue-400/20 text-blue-300/80 hover:bg-blue-500/10 hover:border-blue-400/40'
                                }`}
                        >
                            {showAll ? (
                                <>
                                    Mostra meno
                                    <ArrowRight className="w-4 h-4 rotate-[-90deg] transition-transform" />
                                </>
                            ) : (
                                <>
                                    Scopri tutti i 10 moduli
                                    <ArrowRight className="w-4 h-4 rotate-90 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Bottom teaser */}
                    <motion.p
                        className="text-center text-stone-500 text-sm mt-10 italic"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        + 3 bonus esclusivi inclusi in ogni Mastermind. Scopri i dettagli sotto.
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
