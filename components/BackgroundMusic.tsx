import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
    src: string;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ src }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const location = useLocation();

    // Pages where music should play
    const publicPaths = ['/', '/login', '/signup', '/reset-password', '/terms', '/privacy', '/thank-you', '/onboarding'];
    const shouldPlay = publicPaths.includes(location.pathname) || location.pathname === '/';

    // Volume Fade Logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // FADE IN/OUT based on route
        if (shouldPlay) {
            // If we are on a allowed page, target volume is 0.3 (or 0 if muted)
            const targetVolume = isMuted ? 0 : 0.4;
            fadeVolume(audio, targetVolume);

            if (userInteracted && audio.paused) {
                audio.play().catch(e => console.log("Autoplay prevented:", e));
            }
        } else {
            // If we are on dashboard/course, fade to 0 and pause
            fadeVolume(audio, 0, () => {
                audio.pause();
            });
        }
    }, [shouldPlay, userInteracted, isMuted, location.pathname]);

    // Handle Mute Toggle
    const toggleMute = () => {
        setIsMuted(!isMuted);
        setUserInteracted(true); // Treat mute toggle as interaction
        if (audioRef.current) {
            if (!isMuted) {
                // Muting - PAUSE formatting for mobile
                audioRef.current.pause();
                audioRef.current.currentTime = 0; // Optional: reset or keep position? Keep position usually better but pause is key.
            } else {
                // Unmuting
                audioRef.current.play();
                fadeVolume(audioRef.current, 0.4);
            }
        }
    };

    // Helper: Smooth Volume Fade
    const fadeVolume = (audio: HTMLAudioElement, target: number, onComplete?: () => void) => {
        const step = 0.02;
        const interval = 50; // ms

        const fade = setInterval(() => {
            // Check if audio element still exists
            if (!audio) {
                clearInterval(fade);
                return;
            }

            const current = audio.volume;

            // Close enough to target?
            if (Math.abs(current - target) < step) {
                audio.volume = target;
                clearInterval(fade);
                if (onComplete) onComplete();
                return;
            }

            // Adjust volume
            if (current < target) {
                audio.volume = Math.min(1, current + step);
            } else {
                audio.volume = Math.max(0, current - step);
            }
        }, interval);
    };

    // Auto-start on first interaction (Click anywhere)
    useEffect(() => {
        const handleFirstInteraction = () => {
            // STRICT MUTE CHECK: If muted, do NOT start playing
            if (isMuted) return;

            if (!userInteracted && audioRef.current && shouldPlay) {
                // Try to play
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // SUCCESS: Interaction accepted
                            console.log("Audio started successfully");
                            setUserInteracted(true); // INTERACTION CONFIRMED
                            fadeVolume(audioRef.current!, 0.4);

                            // Only remove listeners if it ACTUALLY worked
                            ['click', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(event =>
                                window.removeEventListener(event, handleFirstInteraction)
                            );
                        })
                        .catch(error => {
                            // FAIL: Browser blocked it (likely "interaction required")
                            // We do NOT remove listeners, so we try again on the next event (e.g. the actual click)
                            console.log("Autoplay deferred (waiting for gesture):", error);
                        });
                }
            }
        };

        // Listen for ANY interaction to start music asap
        ['click', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(event =>
            window.addEventListener(event, handleFirstInteraction)
        );

        return () => {
            ['click', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(event =>
                window.removeEventListener(event, handleFirstInteraction)
            );
        };
    }, [userInteracted, shouldPlay]);

    if (!shouldPlay && audioRef.current?.paused) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] transition-opacity duration-1000" style={{ opacity: shouldPlay ? 1 : 0 }}>
            <audio
                ref={audioRef}
                src={src}
                loop
                preload="auto"
            />

            <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-lux-gold hover:bg-black/60 hover:text-white transition-all hover:scale-110 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            </button>
        </div>
    );
};
