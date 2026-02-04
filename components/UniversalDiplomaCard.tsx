import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Share2, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAudioSystem } from '../hooks/useAudioSystem';

interface UniversalDiplomaCardProps {
    userName: string;
    courseId: string; // 'matrice-1' (Storytelling) or 'matrice-2' (Podcast)
    date?: string;
}

export const UniversalDiplomaCard: React.FC<UniversalDiplomaCardProps> = ({
    userName,
    courseId,
    date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}) => {
    const { playSound } = useAudioSystem();
    const [textVisible, setTextVisible] = useState(true);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const isPodcast = courseId === 'matrice-2';

    // THEME CONFIGURATION
    const config = isPodcast ? {
        // PODCAST THEME (Neon/Cyber - Overrides defaults via inline styles if needed, or we adapt css classes)
        // But user template was Gold. I will adapt colors dynamically.
        title: "Podcast Mastermind",
        academy: "Vox Sephira Academy", // Or Vox Acustica? User template said Vox Sephira. I will stick to Vox Sephira for base but maybe tweak for podcast.
        role: "Architetto del Suono",
        sealText: "OFFICIAL\nMASTER",
        colors: {
            // We'll use CSS variables injection for this
            bgDeep: '#050014', // Deep Violet Black
            bgInner: '#120024',
            bgOuter: '#000000',
            goldPrimary: '#22d3ee', // Cyan
            goldMetallic: '#8b5cf6', // Violet
            goldCrystal: 'rgba(34, 211, 238, 0.4)',
            goldTextTitle: '#e0e7ff',
            goldTextBody: '#94a3b8',
            borderColor: 'rgba(139, 92, 246, 0.5)',
            starColor: '#ffffff',
            starGlow: 'rgba(34, 211, 238, 0.6)',
            nebula1: 'rgba(139, 92, 246, 0.2)',
            nebula2: 'rgba(34, 211, 238, 0.15)',
            sealText: '#1e1b4b',
            sealBg: 'radial-gradient(circle at 35% 35%, #a5f3fc 0%, #22d3ee 40%, #0891b2 60%, #155e75 100%)'
        }
    } : {
        // STORYTELLING THEME (Gold/Lux - Default from Template)
        title: "Storytelling Mastermind",
        academy: "Vox Sephira Academy",
        role: "Stratega della Narrazione",
        sealText: "OFFICIAL\nMASTER",
        colors: {
            bgDeep: '#000000',
            bgInner: '#110d08',
            bgOuter: '#000000',
            goldPrimary: '#ffeb3b',
            goldMetallic: '#d4af37',
            goldCrystal: 'rgba(255, 236, 179, 0.4)',
            goldTextTitle: '#f7e7ce',
            goldTextBody: '#b0b0b0',
            borderColor: 'rgba(212, 175, 55, 0.3)',
            starColor: '#fff8e1',
            starGlow: 'rgba(255, 200, 50, 0.4)',
            nebula1: 'rgba(100, 80, 40, 0.15)',
            nebula2: 'rgba(140, 100, 40, 0.1)',
            sealText: '#5e430d',
            sealBg: 'radial-gradient(circle at 35% 35%, #fceabb 0%, #fccd4d 40%, #fbdf93 60%, #c49942 100%)'
        }
    };

    // --- ACTIONS ---

    const handleDownloadImg = async () => {
        if (!cardRef.current) return;
        playSound('click');
        setIsGenerating(true);
        // User Feedback
        const toast = document.createElement('div');
        toast.innerText = "📸 Generazione Immagine in corso...";
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', right: '20px',
            background: '#fff', color: '#000', padding: '10px 20px',
            borderRadius: '5px', zIndex: '9999', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        });
        document.body.appendChild(toast);

        try {
            cardRef.current.classList.add('snapshot-mode');
            // Wait for repaint and fonts
            await new Promise(r => setTimeout(r, 500));

            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,       // CRITICAL: Loading cross-origin images safely
                allowTaint: false    // CRITICAL: Must be FALSE to allow toDataURL()
            });

            const link = document.createElement('a');
            link.download = `Vox_mastermind_${userName.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error(err);
            alert("Impossibile generare immagine: " + err);
        } finally {
            if (cardRef.current) cardRef.current.classList.remove('snapshot-mode');
            setIsGenerating(false);
            if (document.body.contains(toast)) document.body.removeChild(toast);
        }
    };

    const handleDownloadPDF = async () => {
        if (!cardRef.current) return;
        playSound('click');
        setIsGenerating(true);
        const toast = document.createElement('div');
        toast.innerText = "📄 Generazione PDF in corso...";
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', right: '20px',
            background: '#fff', color: '#000', padding: '10px 20px',
            borderRadius: '5px', zIndex: '9999', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        });
        document.body.appendChild(toast);

        try {
            cardRef.current.classList.add('snapshot-mode');
            await new Promise(r => setTimeout(r, 500));

            const canvas = await html2canvas(cardRef.current, {
                scale: 3,
                useCORS: true,
                allowTaint: false // IMPORTANT
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificato_Mastermind_${userName.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error(err);
            alert("Impossibile generare PDF: " + err);
        } finally {
            if (cardRef.current) cardRef.current.classList.remove('snapshot-mode');
            setIsGenerating(false);
            if (document.body.contains(toast)) document.body.removeChild(toast);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 animate-[fadeIn_1s] w-full max-w-[1200px] pointer-events-auto" style={{ zIndex: 1000 }}>

            {/* Added explicit pointer-events-auto to container */}

            {/* CSS VARIABLES INJECTION */}
            <style>{`
                :root {
                    --bg-deep: ${config.colors.bgDeep};
                    --bg-gradient-inner: ${config.colors.bgInner};
                    --bg-gradient-outer: ${config.colors.bgOuter};
                    --gold-primary: ${config.colors.goldPrimary};
                    --gold-metallic: ${config.colors.goldMetallic};
                    --gold-crystal: ${config.colors.goldCrystal};
                    --gold-text-title: ${config.colors.goldTextTitle};
                    --gold-text-body: ${config.colors.goldTextBody};
                    --border-color: ${config.colors.borderColor};
                    --star-color: ${config.colors.starColor};
                    --star-glow: ${config.colors.starGlow};
                    --nebula-color-1: ${config.colors.nebula1};
                    --nebula-color-2: ${config.colors.nebula2};
                    --seal-text: ${config.colors.sealText};
                    --seal-bg: ${config.colors.sealBg};
                }
                
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Montserrat:wght@300;400;500&display=swap');

                /* ANIMATIONS */
                @keyframes star-drift { from { transform: rotate(0deg); } to { transform: rotate(20deg); } }
                @keyframes nebula-pulse { 0% { opacity: 0.5; transform: scale(1); } 100% { opacity: 0.8; transform: scale(1.05); } }
                @keyframes twinkle { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }

                .universe-stars {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E");
                }
                .universe-stars::after {
                    content: '';
                    position: absolute;
                    top: -50%; left: -50%; width: 200%; height: 200%;
                    background-image: 
                        radial-gradient(1px 1px at 5% 5%, var(--star-color) 100%, transparent),
                        radial-gradient(1.5px 1.5px at 25% 25%, var(--star-color) 100%, transparent),
                        radial-gradient(1px 1px at 55% 55%, var(--star-color) 100%, transparent),
                        radial-gradient(2px 2px at 65% 65%, var(--star-color) 100%, transparent),
                        radial-gradient(1px 1px at 95% 95%, var(--star-color) 100%, transparent);
                    background-size: 300px 300px;
                    opacity: 0.5;
                    animation: star-drift 150s linear infinite;
                }

                .snapshot-mode .recipient-name {
                    background: none !important;
                    -webkit-background-clip: unset !important;
                    -webkit-text-fill-color: unset !important;
                    color: var(--gold-metallic) !important;
                    text-shadow: 0 0 15px var(--star-glow) !important;
                }
            `}</style>


            {/* UI CONTROLS */}
            <div className="absolute top-4 right-4 flex gap-4 z-50 pointer-events-auto">
                <button
                    onClick={() => { playSound('click'); setTheme(prev => prev === 'dark' ? 'light' : 'dark'); }}
                    className="flex items-center gap-2 bg-black/50 backdrop-blur border border-[#d4af37]/30 text-[#d4af37] px-4 py-2 rounded text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all"
                >
                    {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                    {theme === 'dark' ? 'Notte' : 'Giorno'}
                </button>
                <button
                    onClick={() => { playSound('click'); setTextVisible(!textVisible); }}
                    className="flex items-center gap-2 bg-black/50 backdrop-blur border border-[#d4af37]/30 text-[#d4af37] px-4 py-2 rounded text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all"
                >
                    {textVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                    {textVisible ? 'Nascondi Testo' : 'Mostra Testo'}
                </button>
            </div>

            {/* DIPLOMA CARD CONTAINER */}
            <div
                id="diploma-capture"
                ref={cardRef}
                className={`relative w-[1100px] h-[700px] rounded-lg shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center transition-all duration-700
                    ${theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'}
                `}
                style={{
                    background: theme === 'dark'
                        ? 'radial-gradient(ellipse at bottom, var(--bg-gradient-inner) 0%, var(--bg-gradient-outer) 100%)'
                        : '#f8f8f8',
                    border: '1px solid var(--border-color)',
                    boxShadow: theme === 'dark' ? '0 20px 80px rgba(0,0,0,0.8)' : '0 20px 80px rgba(184, 134, 11, 0.15)'
                }}
            >
                {/* --- BACKGROUND LAYERS --- */}
                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none universe-stars z-[1]" />
                <div
                    className="absolute inset-0 z-[1] pointer-events-none animate-[nebula-pulse_10s_infinite_alternate]"
                    style={{
                        background: `
                            radial-gradient(circle at 20% 80%, var(--nebula-color-1), transparent 50%),
                            radial-gradient(circle at 80% 20%, var(--nebula-color-2), transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(30, 20, 10, 0.3), transparent 60%)
                        `,
                        filter: 'blur(40px)'
                    }}
                />

                {/* --- GEOMETRY --- */}
                <div className="absolute w-[950px] h-[950px] rounded-full border border-[var(--gold-crystal)] z-[2] top-1/2 -translate-y-1/2 -left-[380px] shadow-[0_0_5px_var(--star-glow)]" />
                <div className="absolute w-[950px] h-[950px] rounded-full border border-[var(--gold-crystal)] z-[2] top-1/2 -translate-y-1/2 -right-[380px] shadow-[0_0_5px_var(--star-glow)]" />
                <div className="absolute w-[700px] h-[700px] rounded-full border border-[var(--border-color)] z-[2] top-1/2 -translate-y-1/2 -left-[220px] shadow-[0_0_8px_var(--star-glow)]" />
                <div className="absolute w-[700px] h-[700px] rounded-full border border-[var(--border-color)] z-[2] top-1/2 -translate-y-1/2 -right-[220px] shadow-[0_0_8px_var(--star-glow)]" />
                <div className="absolute w-[500px] h-[500px] rounded-full border border-[var(--gold-crystal)] z-[2] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                {/* --- STARS --- */}
                {/* Simplified stars as JSX for cleaner code than pure CSS repeated classes */}
                {[
                    { top: '22%', left: '26%', delay: '0s', scale: 1 },
                    { top: '78%', right: '26%', delay: '2s', scale: 1 },
                    { top: '15%', right: '18%', delay: '1s', scale: 0.8 },
                    { top: '85%', left: '18%', delay: '3s', scale: 0.8 },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-[var(--star-color)] rounded-full animate-[twinkle_4s_infinite_ease-in-out] z-[3]"
                        style={{
                            ...s,
                            boxShadow: '0 0 4px 1px var(--star-color), 0 0 12px 3px var(--gold-primary), 0 0 20px 5px var(--star-glow)',
                            animationDelay: s.delay
                        }}
                    />
                ))}

                {/* --- CONTENT LAYER --- */}
                <div
                    className={`relative z-[10] w-full h-full flex flex-col justify-start pt-20 pb-10 px-24 box-border transition-opacity duration-500 ${textVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Header */}
                    <div>
                        <h1
                            className="font-display text-[3.2rem] font-medium uppercase m-0 leading-[1.2] tracking-[4px]"
                            style={{
                                fontFamily: "'Cinzel', serif",
                                color: 'var(--gold-text-title)',
                                textShadow: '0 0 20px var(--star-glow)'
                            }}
                        >
                            {config.title}
                        </h1>
                        <div
                            className="text-sm tracking-[0.5rem] uppercase font-normal opacity-80 mt-5"
                            style={{ fontFamily: "'Cinzel', serif", color: theme === 'light' ? '#888' : '#aaa' }}
                        >
                            {config.academy}
                        </div>
                    </div>

                    {/* Main Name */}
                    <div>
                        <div
                            className="text-[1.2rem] tracking-[0.3rem] uppercase font-normal mt-12"
                            style={{ fontFamily: "'Cinzel', serif", color: 'var(--gold-metallic)' }}
                        >
                            Certification of Mastery
                        </div>

                        <div className="relative mt-2 mb-2">
                            <h1
                                className="recipient-name text-[5rem] font-bold uppercase leading-none tracking-[4px]"
                                style={{
                                    fontFamily: "'Cinzel', serif",
                                    background: 'linear-gradient(to bottom, #fff9c4 10%, #ffcc00 50%, #d4af37 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 15px var(--star-glow))'
                                }}
                            >
                                {userName}
                            </h1>
                        </div>

                        <div className="w-[350px] h-px mx-auto mb-8 opacity-60" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-metallic), transparent)' }} />

                        <div
                            className="text-[1rem] font-light max-w-[65%] mx-auto leading-[1.7] tracking-[0.5px]"
                            style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--gold-text-body)' }}
                        >
                            Ha attraversato i Dieci Mondi e forgiato la propria Voce.<br />
                            Conferiamo oggi il titolo di <strong>{config.role}</strong> con pieni onori e diritti.
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex justify-between items-center w-full px-6">
                        <div className="hidden md:block w-[180px] text-center relative top-2">
                            <div className="text-[1.1rem] mb-2 font-normal" style={{ fontFamily: "'Cinzel', serif", color: 'var(--gold-text-title)' }}>Vox Sephira</div>
                            <div className="w-full h-px mb-3" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-metallic), transparent)' }} />
                            <div className="text-[0.65rem] tracking-[0.15rem] uppercase" style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--gold-text-body)' }}>Il Fondatore</div>
                        </div>

                        {/* SEAL */}
                        <div
                            className="w-[120px] h-[120px] rounded-full flex justify-center items-center relative mb-5 mx-auto"
                            style={{
                                background: 'var(--seal-bg)',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.3), 0 0 0 2px var(--gold-metallic), inset 0 0 0 2px rgba(255,255,255,0.4)'
                            }}
                        >
                            <div className="absolute w-[90px] h-[90px] rounded-full border border-dashed border-[#8a6e2f]/60" />
                            <div
                                className="text-center font-black leading-[1.2] text-[0.75rem] tracking-[1.5px]"
                                style={{ fontFamily: "'Cinzel', serif", color: 'var(--seal-text)', textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}
                            >
                                {config.sealText.split('\n')[0]}<br />
                                <span className="block text-[0.55rem] font-semibold mt-0.5">{config.sealText.split('\n')[1]}</span>
                            </div>
                        </div>

                        <div className="hidden md:block w-[180px] text-center relative top-2">
                            <div className="text-[1.1rem] mb-2 font-normal" style={{ fontFamily: "'Cinzel', serif", color: 'var(--gold-text-title)' }}>{date}</div>
                            <div className="w-full h-px mb-3" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-metallic), transparent)' }} />
                            <div className="text-[0.65rem] tracking-[0.15rem] uppercase" style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--gold-text-body)' }}>Data</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-8 mt-4 pointer-events-auto pb-8">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className={`group relative px-8 py-4 bg-transparent border border-[var(--gold-metallic)] text-[var(--gold-metallic)] font-bold uppercase tracking-widest hover:bg-[var(--gold-metallic)] hover:text-black transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Richiedi Eredità (PDF)
                    </span>
                </button>
                <button
                    onClick={handleDownloadImg}
                    disabled={isGenerating}
                    className={`group relative px-8 py-4 bg-transparent border border-[var(--gold-metallic)] text-[var(--gold-metallic)] font-bold uppercase tracking-widest hover:bg-[var(--gold-metallic)] hover:text-black transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className="flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Mostra al Mondo (IMG)
                    </span>
                </button>
            </div>
        </div>
    );
};
