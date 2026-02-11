import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Users, Mic, Rocket, Calendar, FileText, Crown } from 'lucide-react';

interface ExtraItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    price: string;
    tag: string;
}

const EXTRAS: ExtraItem[] = [
    {
        icon: <Zap className="w-5 h-5" />,
        title: "Sessione Strategica 1-on-1 VIP",
        description: "90 minuti con il founder. Analisi del tuo brand, voce e posizionamento.",
        price: "€297",
        tag: "Personalizzato"
    },
    {
        icon: <FileText className="w-5 h-5" />,
        title: "Content Audit AI-Powered",
        description: "Analisi completa del tuo profilo social con piano editoriale 90 giorni.",
        price: "€197",
        tag: "AI-Driven"
    },
    {
        icon: <Mic className="w-5 h-5" />,
        title: "Voice Clone Pro Package",
        description: "Setup completo del tuo clone vocale AI professionale.",
        price: "€147",
        tag: "Tech Setup"
    },
    {
        icon: <Rocket className="w-5 h-5" />,
        title: "Viral Blueprint Accelerator",
        description: "Implementazione guidata live per creare il tuo primo contenuto virale.",
        price: "€397",
        tag: "Implementazione"
    },
    {
        icon: <Calendar className="w-5 h-5" />,
        title: "Masterclass Live Annuale",
        description: "12 masterclass live mensili con ospiti internazionali.",
        price: "€497",
        tag: "Community"
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: "Done-For-You Content Pack",
        description: "30 contenuti professionali creati per te. Pronti da pubblicare.",
        price: "€797",
        tag: "Done-For-You"
    },
    {
        icon: <Crown className="w-5 h-5" />,
        title: "Elite Inner Circle",
        description: "Accesso lifetime alla community esclusiva. Chat privata, eventi e revisioni.",
        price: "€997",
        tag: "Premium"
    }
];

export const ExtrasPreview: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleExtras = isExpanded ? EXTRAS : EXTRAS.slice(0, 3);

    return (
        <section className="w-full py-16 relative">
            {/* Header */}
            <div className="max-w-5xl mx-auto px-6 mb-10">
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500/80 mb-3 font-bold">
                        Dopo il Mastermind
                    </p>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400 mb-3">
                        Accelera i Risultati
                    </h2>
                    <p className="text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
                        Servizi premium disponibili nella tua Dashboard dopo l'acquisto. Ogni strumento è progettato per moltiplicare l'impatto del tuo percorso.
                    </p>
                </div>
            </div>

            {/* Extras Grid */}
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AnimatePresence mode="sync">
                        {visibleExtras.map((extra, i) => (
                            <motion.div
                                key={extra.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                className="group relative rounded-lg border border-stone-800/60 bg-black/40 backdrop-blur-sm p-5 hover:border-amber-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(228,197,114,0.1)] cursor-default"
                            >
                                {/* Tag */}
                                <div className="absolute top-3 right-3">
                                    <span className="text-[9px] uppercase tracking-wider text-amber-500/60 font-bold bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10">
                                        {extra.tag}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center mb-3 text-stone-400 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors">
                                    {extra.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-sm font-bold text-stone-200 mb-1.5 group-hover:text-white transition-colors">
                                    {extra.title}
                                </h3>
                                <p className="text-xs text-stone-500 leading-relaxed mb-3">
                                    {extra.description}
                                </p>

                                {/* Price */}
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-400 text-sm font-bold">{extra.price}</span>
                                    <span className="text-[9px] text-stone-600 uppercase tracking-wide">una tantum</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Expand/Collapse */}
                {EXTRAS.length > 3 && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-amber-400 transition-colors uppercase tracking-[0.15em] font-medium"
                        >
                            {isExpanded ? 'Mostra meno' : `Scopri tutti i ${EXTRAS.length} servizi`}
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                )}

                {/* Trust Line */}
                <p className="text-center text-[10px] text-stone-600 mt-6 tracking-wide">
                    Disponibili dopo l'acquisto di qualsiasi Mastermind · Pagamento sicuro Stripe
                </p>
            </div>
        </section>
    );
};
