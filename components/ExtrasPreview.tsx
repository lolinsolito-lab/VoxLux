import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Users, Mic, Rocket, Calendar, FileText, Crown, ArrowRight } from 'lucide-react';

interface ExtraItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    price: string;
    tag: string;
    tagColor: string;
}

const EXTRAS: ExtraItem[] = [
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Sessione Strategica 1-on-1 VIP",
        description: "90 minuti con il founder. Analisi del tuo brand, voce e posizionamento. Roadmap personalizzata.",
        price: "€297",
        tag: "Personalizzato",
        tagColor: "from-amber-400 to-orange-500"
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: "Content Audit AI-Powered",
        description: "Analisi completa del tuo profilo social con piano editoriale 90 giorni. Report dettagliato.",
        price: "€197",
        tag: "AI-Driven",
        tagColor: "from-cyan-400 to-blue-500"
    },
    {
        icon: <Mic className="w-6 h-6" />,
        title: "Voice Clone Pro Package",
        description: "Setup completo del tuo clone vocale AI professionale. 3 voci + integrazione Eleven Labs.",
        price: "€147",
        tag: "Tech Setup",
        tagColor: "from-violet-400 to-purple-500"
    },
    {
        icon: <Rocket className="w-6 h-6" />,
        title: "Viral Blueprint Accelerator",
        description: "3 sessioni di implementazione guidata live per creare il tuo primo contenuto virale.",
        price: "€397",
        tag: "Implementazione",
        tagColor: "from-red-400 to-rose-500"
    },
    {
        icon: <Calendar className="w-6 h-6" />,
        title: "Masterclass Live Annuale",
        description: "12 masterclass live mensili con ospiti internazionali. Networking + registrazioni premium.",
        price: "€497",
        tag: "Community",
        tagColor: "from-emerald-400 to-green-500"
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Done-For-You Content Pack",
        description: "30 contenuti professionali creati per te. Script + voiceover + editing. Pronti da pubblicare.",
        price: "€797",
        tag: "Done-For-You",
        tagColor: "from-amber-400 to-yellow-500"
    },
    {
        icon: <Crown className="w-6 h-6" />,
        title: "Elite Inner Circle",
        description: "Accesso lifetime alla community esclusiva. Chat privata, eventi, revisioni e deal flow.",
        price: "€997",
        tag: "Premium",
        tagColor: "from-indigo-400 to-violet-500"
    }
];

export const ExtrasPreview: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleExtras = isExpanded ? EXTRAS : EXTRAS.slice(0, 3);

    return (
        <section className="w-full py-20 relative">
            {/* Header */}
            <div className="max-w-6xl mx-auto px-6 mb-14">
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500/80 mb-3 font-bold">
                        Dopo il Mastermind
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400 mb-4">
                        Accelera i Risultati
                    </h2>
                    <p className="text-sm md:text-base text-stone-400 max-w-2xl mx-auto leading-relaxed">
                        Servizi premium disponibili nella tua Dashboard dopo l'acquisto. Ogni strumento è progettato per <span className="text-amber-400/80">moltiplicare l'impatto</span> del tuo percorso.
                    </p>
                </div>
            </div>

            {/* Extras Grid */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AnimatePresence mode="sync">
                        {visibleExtras.map((extra, i) => (
                            <motion.div
                                key={extra.title}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: i * 0.06, duration: 0.35 }}
                                className="group relative rounded-2xl border border-stone-800/60 bg-gradient-to-b from-stone-900/40 to-black/60 backdrop-blur-sm p-8 hover:border-amber-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(228,197,114,0.1)] hover:scale-[1.02] cursor-default"
                            >
                                {/* Tag */}
                                <div className="absolute top-5 right-5">
                                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${extra.tagColor} shadow-lg`}>
                                        {extra.tag}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className="w-14 h-14 rounded-2xl border border-stone-700/60 flex items-center justify-center mb-5 text-stone-400 group-hover:text-amber-400 group-hover:border-amber-500/40 group-hover:bg-amber-500/5 transition-all duration-500 bg-stone-900/50">
                                    {extra.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-stone-100 mb-2.5 group-hover:text-white transition-colors">
                                    {extra.title}
                                </h3>
                                <p className="text-sm text-stone-500 leading-relaxed mb-5 group-hover:text-stone-400 transition-colors">
                                    {extra.description}
                                </p>

                                {/* Price + CTA */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">{extra.price}</span>
                                        <span className="text-[10px] text-stone-600 uppercase tracking-wide">una tantum</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-stone-600 group-hover:text-amber-400/60 transition-colors uppercase tracking-wider font-medium">
                                        Scopri
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Expand/Collapse */}
                {EXTRAS.length > 3 && (
                    <div className="text-center mt-10">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm text-stone-400 hover:text-amber-400 transition-all duration-300 uppercase tracking-[0.15em] font-bold border border-stone-800 hover:border-amber-500/30 hover:bg-amber-500/5"
                        >
                            {isExpanded ? 'Mostra meno' : `Scopri tutti i ${EXTRAS.length} servizi`}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                )}

                {/* Trust Line */}
                <p className="text-center text-[10px] text-stone-600 mt-8 tracking-wide">
                    Disponibili dopo l'acquisto di qualsiasi Mastermind · Pagamento sicuro Stripe
                </p>
            </div>
        </section>
    );
};
