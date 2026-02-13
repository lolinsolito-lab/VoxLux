import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Download, Share2, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { generateCertificateId, getVerificationUrl, formatCertificateDate } from '../utils/certificate';

interface UniversalDiplomaCardProps {
    userName: string;
    courseId: string; // 'matrice-1' (Storytelling) or 'matrice-2' (Podcast)
    date?: string;
    variant?: 'standard' | 'luxury'; // NEW PROP
}

export const UniversalDiplomaCard: React.FC<UniversalDiplomaCardProps> = ({
    userName,
    courseId,
    date,
    variant = 'standard' // Default to standard
}) => {
    const { playSound } = useAudioSystem();
    const [textVisible, setTextVisible] = useState(true);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [certificateId, setCertificateId] = useState<string>('');
    const [displayDate, setDisplayDate] = useState<string>('');

    const isPodcast = courseId === 'matrice-2';

    // Initialize Certificate Data
    useEffect(() => {
        const id = generateCertificateId(isPodcast ? 'VL-PM' : 'VL-SS');
        setCertificateId(id);
        setDisplayDate(date || formatCertificateDate(new Date()));

        const verifyUrl = getVerificationUrl(id);

        QRCode.toDataURL(verifyUrl, {
            width: 200,
            margin: 1,
            color: {
                dark: isPodcast ? '#22d3ee' : '#d4af37',
                light: '#00000000'
            }
        }).then(url => {
            setQrCodeUrl(url);
        }).catch(err => {
            console.error('QR Gen Error:', err);
        });
    }, [courseId, date, isPodcast]);


    // THEME CONFIGURATION
    const config = isPodcast ? {
        // PODCAST THEME
        title: "Podcast Mastermind",
        academy: "Vox Sephira Academy",
        role: "Architetto del Suono",
        sealText: "OFFICIAL\nMASTER",
        colors: {
            bgDeep: '#050014',
            bgInner: '#120024',
            bgOuter: '#000000',
            primary: '#22d3ee', // Cyan
            accent: '#8b5cf6', // Violet
            textTitle: '#e0e7ff',
            textBody: '#94a3b8',
            border: 'rgba(139, 92, 246, 0.5)',
            glow: 'rgba(34, 211, 238, 0.6)',
            sealBg: 'radial-gradient(circle at 35% 35%, #a5f3fc 0%, #22d3ee 40%, #0891b2 60%, #155e75 100%)'
        }
    } : {
        // STORYTELLING THEME
        title: "Storytelling Mastermind",
        academy: "Vox Sephira Academy",
        role: "Stratega della Narrazione",
        sealText: "OFFICIAL\nMASTER",
        colors: {
            bgDeep: variant === 'luxury' ? '#080808' : '#000000',
            bgInner: variant === 'luxury' ? '#1a1a1a' : '#110d08',
            bgOuter: variant === 'luxury' ? '#000000' : '#000000',
            primary: '#ffeb3b', // Bright Gold
            accent: '#d4af37', // Metallic Gold
            textTitle: '#f7e7ce',
            textBody: '#b0b0b0',
            border: variant === 'luxury' ? '#ffd700' : 'rgba(212, 175, 55, 0.3)',
            glow: 'rgba(255, 200, 50, 0.4)',
            sealBg: 'radial-gradient(circle at 35% 35%, #fceabb 0%, #fccd4d 40%, #fbdf93 60%, #c49942 100%)'
        }
    };

    // --- ACTIONS ---
    const handleDownloadImg = async () => {
        if (!cardRef.current) return;
        playSound('click');
        setIsGenerating(true);

        // Create toast
        const toast = document.createElement('div');
        toast.innerText = "📸 Generazione Immagine...";
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', right: '20px',
            background: '#fff', color: '#000', padding: '10px 20px',
            borderRadius: '5px', zIndex: '9999', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(toast);

        // CLONE STRATEGY:
        // We clone the card and append it to body to ensure it's captured at full scale (1:1)
        // avoiding issues with the Admin Preview modal's "scale-75" transform.
        const clone = cardRef.current.cloneNode(true) as HTMLElement;
        clone.style.position = 'fixed';
        clone.style.top = '-9999px'; // Off-screen
        clone.style.left = '-9999px';
        clone.style.transform = 'none'; // RESET TRANSFORM
        clone.style.zIndex = '-1';
        clone.style.opacity = '1';
        clone.classList.remove('no-export'); // Ensure it's visible
        clone.classList.add('snapshot-mode'); // Apply snapshot styling

        document.body.appendChild(clone);

        try {
            await new Promise(r => setTimeout(r, 1000)); // Wait for render/fonts

            const canvas = await html2canvas(clone, {
                scale: 3, // High Res
                backgroundColor: null,
                useCORS: true,
                allowTaint: true, // Allow tainting if needed for local blobs
                logging: false,
                ignoreElements: (element) => element.classList.contains('no-export')
            });

            const link = document.createElement('a');
            link.download = `Vox_${isPodcast ? 'Podcast' : 'Storytelling'}_Master_${userName.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error(err);
            alert("Errore immagine: " + err);
        } finally {
            if (document.body.contains(clone)) document.body.removeChild(clone);
            setIsGenerating(false);
            if (document.body.contains(toast)) document.body.removeChild(toast);
        }
    };

    const handleDownloadPDF = async () => {
        if (!cardRef.current) return;
        playSound('click');
        setIsGenerating(true);

        const toast = document.createElement('div');
        toast.innerText = "📄 Creazione Pergamena...";
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', right: '20px',
            background: '#fff', color: '#000', padding: '10px 20px',
            borderRadius: '5px', zIndex: '9999', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(toast);

        // CLONE STRATEGY (Same as Image)
        const clone = cardRef.current.cloneNode(true) as HTMLElement;
        clone.style.position = 'fixed';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        clone.style.transform = 'none'; // RESET TRANSFORM
        clone.style.zIndex = '-1';
        clone.style.opacity = '1';
        clone.classList.remove('no-export');
        clone.classList.add('snapshot-mode');

        document.body.appendChild(clone);

        try {
            await new Promise(r => setTimeout(r, 1000));

            const canvas = await html2canvas(clone, {
                scale: 4, // Max Quality
                useCORS: true,
                allowTaint: true,
                logging: false,
                ignoreElements: (element) => element.classList.contains('no-export')
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.setProperties({
                title: `Diploma Vox Lux - ${userName}`,
                subject: `Certificato: ${config.title}`,
                author: 'Vox Lux Strategy',
                keywords: `diploma, vox lux, ${isPodcast ? 'podcast' : 'storytelling'}, ${certificateId}`,
                creator: 'Vox Sephira Academy'
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificato_${isPodcast ? 'Podcast' : 'Storytelling'}_${userName.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error(err);
            alert("Errore PDF: " + err);
        } finally {
            if (document.body.contains(clone)) document.body.removeChild(clone);
            setIsGenerating(false);
            if (document.body.contains(toast)) document.body.removeChild(toast);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 animate-[fadeIn_1s] w-full max-w-[1200px] pointer-events-auto" style={{ zIndex: 1000 }}>

            <style>{`
                :root {
                    --bg-deep: ${config.colors.bgDeep};
                    --bg-gradient-inner: ${config.colors.bgInner};
                    --bg-gradient-outer: ${config.colors.bgOuter};
                    --diploma-primary: ${config.colors.primary};
                    --diploma-accent: ${config.colors.accent};
                    --diploma-text-title: ${config.colors.textTitle};
                    --diploma-text-body: ${config.colors.textBody};
                    --diploma-border: ${config.colors.border};
                    --diploma-glow: ${config.colors.glow};
                }
                
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Montserrat:wght@300;400;500&family=Orbitron:wght@400;700&display=swap');

                @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                @keyframes pulse-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
                @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes hologram-scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                @keyframes grow-root { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }

                .snapshot-mode .recipient-name {
                    background: none !important;
                    -webkit-background-clip: unset !important;
                    -webkit-text-fill-color: unset !important;
                    color: var(--diploma-accent) !important;
                    text-shadow: 0 0 15px var(--diploma-glow) !important;
                }

                .cosmic-tree-path {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 0;
                    animation: grow-root 3s ease-out forwards;
                }
            `}</style>


            {/* UI CONTROLS - No Export */}
            <div className="absolute top-4 right-4 flex gap-4 z-50 pointer-events-auto no-export">
                {/* Variant Toggle (Hidden in prod, visible for Admin Preview) */}
                <div className="px-3 py-2 bg-black/50 backdrop-blur rounded text-xs text-white border border-white/10 uppercase tracking-widest">
                    {variant === 'luxury' ? '✨ Luxury Edition' : 'Standard Edition'}
                </div>
                <button
                    onClick={() => { playSound('click'); setTheme(prev => prev === 'dark' ? 'light' : 'dark'); }}
                    className="flex items-center gap-2 bg-black/50 backdrop-blur border border-white/10 text-[var(--diploma-accent)] px-4 py-2 rounded text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                    {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                    {theme === 'dark' ? 'Notte' : 'Giorno'}
                </button>
                <button
                    onClick={() => { playSound('click'); setTextVisible(!textVisible); }}
                    className="flex items-center gap-2 bg-black/50 backdrop-blur border border-white/10 text-[var(--diploma-accent)] px-4 py-2 rounded text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
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
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    // LUXURY BACKGROUNDS (USER ASSETS)
                    backgroundImage: variant === 'luxury'
                        ? (isPodcast
                            ? 'url("/diplomas/diploma_podcast_luxury.png")'
                            : 'url("/diplomas/diploma_storytelling_luxury.png")')
                        : 'none',
                    background: variant !== 'luxury'
                        ? (theme === 'dark'
                            ? 'radial-gradient(ellipse at bottom, var(--bg-gradient-inner) 0%, var(--bg-gradient-outer) 100%)'
                            : '#f9f9f9')
                        : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    border: variant === 'luxury'
                        ? 'none' // Border is usually part of the image, or we add a simple one if needed. Let's keep it clean.
                        : '1px solid var(--diploma-border)',
                    boxShadow: variant === 'luxury'
                        ? (isPodcast ? '0 0 30px rgba(0, 240, 255, 0.2)' : '0 0 30px rgba(255, 215, 0, 0.2)')
                        : (theme === 'dark' ? '0 20px 80px rgba(0,0,0,0.8)' : '0 20px 80px rgba(0,0,0,0.1)')
                }}
            >
                {/* --- LUXURY OVERLAYS (Golden Glow - Subtle) --- */}
                {variant === 'luxury' && (
                    <div className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-20"
                        style={{
                            background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
                        }}
                    />
                )}
                {/* --- BACKGROUND ART (SVG) --- */}

                {/* STORYTELLING: COSMIC TREE */}
                {!isPodcast && (
                    <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none mix-blend-screen">
                        <svg viewBox="0 0 1100 700" className="w-full h-full">
                            <defs>
                                <linearGradient id="goldGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="#8a6e2f" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#d4af37" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#fceabb" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Roots & Trunk */}
                            <path d="M550,700 Q550,600 550,500" stroke="url(#goldGrad)" strokeWidth="2" fill="none" className="cosmic-tree-path" />
                            <path d="M550,500 Q500,400 400,300" stroke="url(#goldGrad)" strokeWidth="1" fill="none" className="cosmic-tree-path" style={{ animationDelay: '0.5s' }} />
                            <path d="M550,500 Q600,400 700,300" stroke="url(#goldGrad)" strokeWidth="1" fill="none" className="cosmic-tree-path" style={{ animationDelay: '0.5s' }} />
                            <path d="M400,300 Q350,200 300,100" stroke="url(#goldGrad)" strokeWidth="0.5" fill="none" className="cosmic-tree-path" style={{ animationDelay: '1s' }} />
                            <path d="M700,300 Q750,200 800,100" stroke="url(#goldGrad)" strokeWidth="0.5" fill="none" className="cosmic-tree-path" style={{ animationDelay: '1s' }} />

                            {/* Nodes (Stars/Ideas) */}
                            <circle cx="550" cy="500" r="3" fill="#d4af37" className="animate-[pulse-glow_3s_infinite]" />
                            <circle cx="400" cy="300" r="2" fill="#d4af37" className="animate-[pulse-glow_4s_infinite]" />
                            <circle cx="700" cy="300" r="2" fill="#d4af37" className="animate-[pulse-glow_4s_infinite]" />

                            {/* Subtle particle dust */}
                            {[...Array(20)].map((_, i) => (
                                <circle
                                    key={i}
                                    cx={Math.random() * 1100}
                                    cy={Math.random() * 700}
                                    r={Math.random() * 1.5}
                                    fill="#d4af37"
                                    opacity="0.3"
                                />
                            ))}
                        </svg>
                    </div>
                )}

                {/* PODCAST: MICROPHONE ECOSYSTEM */}
                {isPodcast && (
                    <div className="absolute inset-0 z-[1] opacity-40 pointer-events-none mix-blend-screen">
                        <svg viewBox="0 0 1100 700" className="w-full h-full">
                            <defs>
                                <radialGradient id="cyberGlow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#000" stopOpacity="0" />
                                </radialGradient>
                            </defs>

                            {/* Central Core (Mic Abstract) */}
                            <g transform="translate(550, 350)">
                                <circle r="150" fill="url(#cyberGlow)" className="animate-[pulse-glow_4s_infinite]" />
                                <circle r="100" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[rotate-slow_20s_linear_infinite]" />
                                <circle r="220" fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.3" className="animate-[rotate-slow_30s_linear_infinite_reverse]" />

                                {/* Orbital Nodes (Worlds) */}
                                <g className="animate-[rotate-slow_15s_linear_infinite]">
                                    <circle cx="100" cy="0" r="4" fill="#22d3ee" />
                                    <line x1="0" y1="0" x2="100" y2="0" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.2" />
                                </g>
                                <g className="animate-[rotate-slow_25s_linear_infinite_reverse]">
                                    <circle cx="0" cy="220" r="6" fill="#8b5cf6" />
                                </g>
                            </g>

                            {/* Sound Waves */}
                            <path d="M0,350 Q275,300 550,350 T1100,350" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.1" />
                            <path d="M0,350 Q275,400 550,350 T1100,350" fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.1" />
                        </svg>
                    </div>
                )}

                {/* Scanner effect removed as per user feedback */}

                {/* --- GEOMETRY OVERLAY (Subtle) --- */}
                <div className="absolute inset-0 border-[20px] border-double z-[2] opacity-30 pointer-events-none" style={{ borderColor: 'var(--diploma-border)' }} />
                <div className="absolute top-8 bottom-8 left-8 right-8 border border-dashed z-[2] opacity-20 pointer-events-none" style={{ borderColor: 'var(--diploma-primary)' }} />

                {/* --- CONTENT LAYER --- */}
                <div
                    className={`relative z-[10] w-full h-full flex flex-col justify-start pt-16 pb-10 px-24 box-border transition-opacity duration-500 ${textVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Header */}
                    <div>
                        <h1
                            className="font-display text-[3.2rem] font-medium uppercase m-0 leading-[1.2] tracking-[4px]"
                            style={{
                                fontFamily: isPodcast ? "'Orbitron', sans-serif" : "'Cinzel', serif",
                                color: 'var(--diploma-text-title)',
                                textShadow: '0 0 20px var(--diploma-glow)'
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
                            style={{ fontFamily: "'Cinzel', serif", color: 'var(--diploma-accent)' }}
                        >
                            Certification of Mastery
                        </div>

                        <div className="relative mt-2 mb-2">
                            <h1
                                className="recipient-name text-[5rem] font-bold uppercase leading-none tracking-[4px]"
                                style={{
                                    fontFamily: isPodcast ? "'Orbitron', sans-serif" : "'Cinzel', serif",
                                    background: isPodcast
                                        ? 'linear-gradient(to bottom, #ccfbf1 10%, #22d3ee 50%, #0ea5e9 90%)'
                                        : 'linear-gradient(to bottom, #fff9c4 10%, #ffcc00 50%, #d4af37 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 15px var(--diploma-glow))'
                                }}
                            >
                                {userName}
                            </h1>
                        </div>

                        <div className="w-[350px] h-px mx-auto mb-8 opacity-60" style={{ background: 'linear-gradient(90deg, transparent, var(--diploma-accent), transparent)' }} />

                        <div
                            className="text-[1rem] font-light max-w-[65%] mx-auto leading-[1.7] tracking-[0.5px]"
                            style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--diploma-text-body)' }}
                        >
                            Ha attraversato i Dieci Mondi e forgiato la propria Voce.<br />
                            Conferiamo oggi il titolo di <strong>{config.role}</strong> con pieni onori e diritti.
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex justify-between items-center w-full px-6 relative">

                        {/* LEFT: Verification & ID */}
                        <div className="w-[200px] text-left relative top-2">
                            <div className="text-[0.6rem] mb-1 font-mono uppercase opacity-70" style={{ color: 'var(--diploma-text-body)' }}>Certificate ID</div>
                            <div className="text-[0.8rem] mb-2 font-mono" style={{ color: 'var(--diploma-primary)', letterSpacing: '2px' }}>{certificateId}</div>

                            {qrCodeUrl && (
                                <div className="mt-2 w-[80px] h-[80px] bg-white p-1 rounded-sm opacity-90 hover:opacity-100 transition-opacity">
                                    <img src={qrCodeUrl} alt="Verification QR" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>

                        {/* CENTER: SEAL */}
                        <div
                            className="w-[120px] h-[120px] rounded-full flex justify-center items-center relative mb-5 mx-auto"
                            style={{
                                background: config.colors.sealBg,
                                boxShadow: `0 5px 15px rgba(0,0,0,0.3), 0 0 0 2px var(--diploma-accent), inset 0 0 0 2px rgba(255,255,255,0.4)`
                            }}
                        >
                            <div className="absolute w-[90px] h-[90px] rounded-full border border-dashed border-black/20" />
                            <div
                                className="text-center font-black leading-[1.2] text-[0.75rem] tracking-[1.5px]"
                                style={{ fontFamily: "'Cinzel', serif", color: '#1e1b4b', textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}
                            >
                                {config.sealText.split('\n')[0]}<br />
                                <span className="block text-[0.55rem] font-semibold mt-0.5">{config.sealText.split('\n')[1]}</span>
                            </div>
                        </div>

                        {/* RIGHT: Date & Founder */}
                        <div className="w-[200px] text-right relative top-2">
                            <div className="text-[1.1rem] mb-2 font-normal" style={{ fontFamily: "'Cinzel', serif", color: 'var(--diploma-text-title)' }}>{displayDate}</div>
                            <div className="w-full h-px mb-3" style={{ background: 'linear-gradient(90deg, transparent, var(--diploma-accent), transparent)' }} />
                            <div className="text-[0.65rem] tracking-[0.15rem] uppercase" style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--diploma-text-body)' }}>Michael Jara<br /><span className="opacity-60 text-[0.55rem]">Fondatore Vox Lux</span></div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ACTION BUTTONS (No Export) */}
            <div className="flex gap-8 mt-4 pointer-events-auto pb-8 no-export">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className={`group relative px-8 py-4 bg-transparent border border-[var(--diploma-accent)] text-[var(--diploma-accent)] font-bold uppercase tracking-widest hover:bg-[var(--diploma-accent)] hover:text-black transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Richiedi Eredità (PDF)
                    </span>
                </button>
                <button
                    onClick={handleDownloadImg}
                    disabled={isGenerating}
                    className={`group relative px-8 py-4 bg-transparent border border-[var(--diploma-accent)] text-[var(--diploma-accent)] font-bold uppercase tracking-widest hover:bg-[var(--diploma-accent)] hover:text-black transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
