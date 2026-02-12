import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const FounderSection: React.FC = () => {
    return (
        <section className="relative w-full py-32 px-6 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-lux-gold/20 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-lux-gold/20 to-transparent" />

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">

                {/* Text / Vision Side */}
                <div className="flex-1 order-2 md:order-1 relative">
                    <Quote className="absolute -top-10 -left-6 w-16 h-16 text-lux-gold/10 rotate-180" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 relative z-10"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                            Alla fine,<br />
                            <span className="text-lux-gold italic">vince chi viene ascoltato.</span>
                        </h2>

                        <div className="space-y-6 text-stone-300 text-lg leading-relaxed font-light">
                            <p>
                                "Ho passato anni a guardare persone con metà del mio talento ottenere il doppio dei miei risultati."
                            </p>
                            <p>
                                Mi chiedevo cosa mi mancasse. <br />
                                La competenza? Ne avevo da vendere. <br />
                                La strategia? Era impeccabile.
                            </p>
                            <p className="font-serif italic text-xl text-white/90 border-l-2 border-lux-gold pl-6 py-2">
                                Poi ho capito: non era questione di *cosa* dicevo. <br />
                                Era questione di *come* la mia voce occupava lo spazio.
                            </p>
                            <p>
                                VOX AUREA non è un corso di dizione. È l'arma che avrei voluto avere quando nessuno mi ascoltava.
                                È il protocollo per chi è stanco di essere il "segreto meglio custodito" del suo settore.
                            </p>
                        </div>

                        <div className="pt-4">
                            <p className="text-lux-gold font-display font-bold text-xl tracking-wide uppercase">Michael Jara</p>
                            <p className="text-stone-500 text-xs tracking-[0.2em] uppercase mt-1">Founder & Vocal Strategist</p>
                        </div>
                    </motion.div>
                </div>

                {/* Image Side */}
                <div className="flex-1 order-1 md:order-2 flex justify-center md:justify-end relative">
                    <div className="relative w-full max-w-md aspect-[3/4] group">
                        {/* Frame Effects */}
                        <div className="absolute inset-0 border border-lux-gold/20 rounded-sm translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-lux-gold/5 rounded-sm -translate-x-4 -translate-y-4 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />

                        {/* Photo Container */}
                        <div className="relative w-full h-full overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700 ease-in-out shadow-2xl">
                            <img
                                src="/assets/founder.jpg"
                                alt="Michael Jara - Founder"
                                className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-6 -right-6 bg-stone-950 border border-lux-gold/20 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl max-w-[200px]"
                        >
                            <p className="text-lux-gold text-4xl font-display font-bold mb-1">10+</p>
                            <p className="text-stone-400 text-xs leading-tight uppercase tracking-wider">Anni di esperienza nel Voice Strategy</p>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
};
