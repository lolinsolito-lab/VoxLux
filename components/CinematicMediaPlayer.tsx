import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, ArrowLeft } from 'lucide-react';
import { Module } from '../services/courseData';
import { WorldTheme } from '../services/themeRegistry';

interface CinematicMediaPlayerProps {
    module: Module;
    theme: WorldTheme;
    onComplete: () => void;
    onClose: () => void;
}

export const CinematicMediaPlayer: React.FC<CinematicMediaPlayerProps> = ({ module, theme, onComplete, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    // Theme Colors
    const primaryColor = theme.colors.accent.replace('text-', 'bg-'); // e.g., bg-lux-gold
    const glowColor = theme.colors.glow; // e.g., shadow-lux-gold/50

    // Auto-play on mount
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
    }, []);

    // Handle idle mouse to hide controls
    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, []);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(progress);

        // Auto-complete near end
        if (progress > 95) {
            // Optional: Auto-trigger complete or just show the button
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = x / width;
        videoRef.current.currentTime = percent * videoRef.current.duration;
    };

    return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center animate-[fadeIn_1s]">

            {/* AMBIENT GLOW BACKLIGHT (Ambilight effect) */}
            <div className={`absolute w-[90%] h-[80%] ${primaryColor} opacity-20 blur-[100px] animate-pulse transition-all duration-1000`}></div>

            {/* PLAYER CONTAINER (The Obsidian Frame) */}
            <div className={`relative w-full max-w-6xl aspect-video bg-black border border-white/10 rounded-lg shadow-2xl overflow-hidden group ${glowColor} transition-all duration-500`}>

                {/* VIDEO ELEMENT */}
                {/* Using a placeholder nature video for demo purposes if URL is missing */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={module.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4"}
                    loop // For demo loop; usually remove
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    onClick={togglePlay}
                />

                {/* OVERLAY: PAUSE SCREEN */}
                {!isPlaying && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer" onClick={togglePlay}>
                        <div className={`w-20 h-20 rounded-full border-2 ${theme.colors.border} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <Play className={`w-8 h-8 ${theme.colors.accent} ml-1`} />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-widest">{module.title}</h2>
                        <span className={`text-xs uppercase tracking-[0.3em] ${theme.colors.text} mt-2`}>Premi per riprendere</span>
                    </div>
                )}

                {/* CONTROLS BAR (Auto-hide) */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-500 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>

                    {/* Progress Bar */}
                    <div
                        className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/bar"
                        onClick={handleSeek}
                    >
                        <div
                            className={`h-full ${primaryColor} relative rounded-full transition-all duration-100 ease-linear`}
                            style={{ width: `${progress}%` }}
                        >
                            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 ${primaryColor} rounded-full shadow-[0_0_10px_white] scale-0 group-hover/bar:scale-100 transition-transform`}></div>
                        </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button onClick={togglePlay} className="text-white hover:text-white/80 transition-colors">
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                            </button>
                            <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <div className="text-xs font-mono text-gray-400">
                                {Math.floor(videoRef.current?.currentTime || 0)}s / {Math.floor(videoRef.current?.duration || 0)}s
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={onComplete}
                                className={`
                                    px-4 py-2 rounded border border-white/20 bg-white/5 backdrop-blur-md 
                                    text-xs font-bold uppercase tracking-widest text-white 
                                    hover:bg-white hover:text-black transition-all
                                    flex items-center gap-2
                                `}
                            >
                                <SkipForward className="w-4 h-4" />
                                Completa Lezione
                            </button>
                        </div>
                    </div>
                </div>

                {/* HEADER (Title Overlay) - Auto Hide */}
                <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 flex justify-between items-start pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                    <div>
                        <div className={`text-[10px] uppercase tracking-[0.3em] ${theme.colors.accent} mb-1 font-bold`}>
                            In Riproduzione
                        </div>
                        <h3 className="text-white font-bold text-lg drop-shadow-md">{module.title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="pointer-events-auto p-2 bg-black/40 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-md"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </div>
    );
};
