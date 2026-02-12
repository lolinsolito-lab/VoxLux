import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

export const FounderSection: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="relative w-full py-32 px-6 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-lux-gold/20 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-lux-gold/20 to-transparent" />

            <div className="max-w-4xl mx-auto text-center relative">
                <Quote className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-16 text-lux-gold/10 rotate-180" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-10 relative z-10"
                >
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                        Alla fine<br />
                        <span className="text-lux-gold italic">vince chi viene ascoltato</span>
                    </h2>

                    <div className="space-y-8 text-stone-300 text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto">
                        <p>
                            "Ho passato anni a guardare persone con metà del mio talento ottenere il doppio dei miei risultati."
                        </p>
                        <p>
                            Mi chiedevo cosa mi mancasse.<br />
                            La competenza? Ne avevo da vendere.<br />
                            La strategia? Era impeccabile.
                        </p>
                        <p className="font-serif italic text-2xl text-white/90 py-4 border-y border-white/5 bg-white/[0.02]">
                            Poi ho capito: non era questione di *cosa* dicevo.<br />
                            Era questione di *come* la mia voce occupava lo spazio.
                        </p>
                        <p>
                            VOX AUREA non è un corso di dizione. È l'arma che avrei voluto avere quando nessuno mi ascoltava.
                            È il protocollo per chi è stanco di essere il "segreto meglio custodito" del suo settore.
                        </p>
                    </div>

                    <div className="pt-8 relative inline-block">
                        <div
                            className="relative cursor-pointer group"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => setIsHovered(!isHovered)}
                        >
                            <p className="text-lux-gold font-display font-bold text-2xl tracking-wide uppercase transition-all duration-300 group-hover:text-white group-hover:scale-105">
                                Michael Jara
                            </p>
                            <div className="h-[1px] w-0 bg-lux-gold mt-1 mx-auto transition-all duration-300 group-hover:w-full" />

                            <p className="text-stone-500 text-xs tracking-[0.2em] uppercase mt-2 group-hover:text-stone-400 transition-colors">
                                Founder & Vocal Strategist
                            </p>

                            {/* HOVER REVEAL CARD */}
                            <AnimatePresence>
                                {isHovered && (
                                    <>
                                        {/* Mobile Overlay Backdrop */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                                            onClick={(e) => { e.stopPropagation(); setIsHovered(false); }}
                                        />

                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="fixed md:absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-auto md:bottom-full md:left-1/2 md:-translate-x-1/2 md:translate-y-0 md:mb-6 w-[300px] md:w-[320px] z-50"
                                        >
                                            <div className="bg-stone-950 border border-lux-gold/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(228,197,114,0.3)] relative">
                                                {/* Image with stronger gradient for text readability */}
                                                <div className="h-[320px] w-full relative grayscale">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent opacity-90" />
                                                    <img
                                                        src="/assets/founder.png"
                                                        alt="Michael Jara"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Text Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-6 text-left z-10">
                                                    <p className="text-white font-bold text-lg leading-tight mb-2">L'Arte dell'Ascesa</p>
                                                    <p className="text-stone-300 text-xs leading-relaxed italic border-l-2 border-lux-gold pl-3 drop-shadow-md">
                                                        "Ho lanciato imprese che hanno toccato il cielo e altre che mi hanno insegnato a rialzarmi.
                                                        Non esiste fallimento per chi ha la virtù di persistere.
                                                        La mia voce non è un dono, è una conquista."
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-4">
                                                        <span className="text-lux-gold font-bold text-lg">10+</span>
                                                        <span className="text-[10px] text-stone-400 uppercase tracking-widest">Anni di Strategia</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Little Arrow - Desktop Only */}
                                            <div className="hidden md:block absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-stone-950 border-r border-b border-lux-gold/30 rotate-45" />
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
