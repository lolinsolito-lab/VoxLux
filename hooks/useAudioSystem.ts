import { useCallback, useRef, useEffect } from 'react';

type SoundType = 'hover' | 'click' | 'unlock' | 'victory' | 'ambient_transition' | 'warp' | 'transition_whoosh';

export const useAudioSystem = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);

    // Initialize Audio Context on user interaction (handled lazily)
    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioCtxRef.current = new AudioContext();
                masterGainRef.current = audioCtxRef.current.createGain();
                masterGainRef.current.connect(audioCtxRef.current.destination);
                masterGainRef.current.gain.value = 0.3; // Global volume
            }
        }
        if (audioCtxRef.current?.state === 'suspended') {
            audioCtxRef.current.resume().catch(() => {
                // Ignore autoplay errors - user hasn't interacted yet
            });
        }
        return audioCtxRef.current;
    };

    const playSound = useCallback((type: SoundType) => {
        const ctx = initAudio();
        // If context is still suspended (autoplay blocked) and it's just a hover, don't try to force it
        if (!ctx || !masterGainRef.current || (ctx.state === 'suspended' && type === 'hover')) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGainRef.current);

        switch (type) {
            case 'hover':
                // High tech blip
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start();
                osc.stop(now + 0.05);
                break;

            case 'click':
                // Solid affirmation click
                osc.type = 'square';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start();
                osc.stop(now + 0.1);
                break;

            case 'unlock':
                // Magical chime
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.2);
                gain.gain.setValueAtTime(0.0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

                // Add a sparkle
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(masterGainRef.current);
                osc2.frequency.setValueAtTime(1200, now);
                osc2.frequency.linearRampToValueAtTime(2000, now + 0.3);
                gain2.gain.setValueAtTime(0.1, now);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                osc.start(); osc2.start();
                osc.stop(now + 0.6); osc2.stop(now + 0.4);
                break;

            case 'victory':
                // Epic major chord
                const root = 220; // A3
                const majorThird = root * 1.2599; // C#4 approx
                const perfectFifth = root * 1.4983; // E4 approx

                [root, majorThird, perfectFifth].forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(masterGainRef.current!);

                    o.type = 'triangle';
                    o.frequency.setValueAtTime(freq, now);
                    g.gain.setValueAtTime(0, now);
                    g.gain.linearRampToValueAtTime(0.2 / (i + 1), now + 0.1); // Stagger volume
                    g.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

                    o.start();
                    o.stop(now + 2.5);
                });
                break;

            case 'ambient_transition':
                // Low whoosh
                osc.type = 'sine';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 1);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.5);
                gain.gain.linearRampToValueAtTime(0, now + 2);
                osc.start();
                osc.stop(now + 2);
                break;

            case 'warp':
                // Interstellar Acceleration (Shepard Tone approximation)
                osc.type = 'sawtooth'; // More grit than sine
                osc.frequency.setValueAtTime(50, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 2.5); // Accel to 800Hz

                // Volume envelope
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 1); // Fade in
                gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5); // Cut at end

                // Optional: Secondary layer for harmonics (in a real app we'd do more, but this is fine)
                osc.start();
                osc.stop(now + 2.5);
                break;
                osc.stop(now + 2.5);
                break;

            case 'transition_whoosh':
                // Rapid orbital whoosh
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.8);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

                osc.start();
                osc.stop(now + 0.8);
                break;
        }
    }, []);

    return { playSound };
};
