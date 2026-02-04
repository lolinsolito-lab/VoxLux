
export interface WorldTheme {
    primaryColor: string;    // Main accent (UI, Rim Light)
    secondaryColor: string;  // Secondary accent (Sparks, Background)
    orbitRadius: number;     // How far the planets are (4.5 is default)
    coreScale: number;       // How big the mic is (1 is default)
    starColor: string;       // Background tinted stars
    atmosphere: 'warm' | 'cool' | 'neutral' | 'glitch';
}

export const PODCAST_THEMES: Record<number, WorldTheme> = {
    1: { // ORIGIN - Gold/Intimate
        primaryColor: '#fbbf24', // Amber-400
        secondaryColor: '#d97706',
        orbitRadius: 4.5,
        coreScale: 1.2, // Dominant Core inside the mind
        starColor: '#fffbeb',
        atmosphere: 'warm'
    },
    2: { // STRUCTURE - Blue/Architectural
        primaryColor: '#38bdf8', // Sky-400
        secondaryColor: '#0ea5e9',
        orbitRadius: 6.0, // Wider, more organized
        coreScale: 1.0,
        starColor: '#f0f9ff',
        atmosphere: 'cool'
    },
    3: { // VISION - Purple/Vast
        primaryColor: '#c084fc', // Purple-400
        secondaryColor: '#9333ea',
        orbitRadius: 8.0, // Huge vision
        coreScale: 0.8, // Distant guiding light
        starColor: '#faf5ff',
        atmosphere: 'cool'
    },
    4: { // FREQUENCY - Cyan/Electric
        primaryColor: '#22d3ee', // Cyan-400
        secondaryColor: '#06b6d4',
        orbitRadius: 5.0,
        coreScale: 1.1,
        starColor: '#ecfeff',
        atmosphere: 'glitch'
    },
    5: { // ARCHETYPES - Red/Primal
        primaryColor: '#f87171', // Red-400
        secondaryColor: '#dc2626',
        orbitRadius: 4.0, // Intense close pressure
        coreScale: 1.3,
        starColor: '#fef2f2',
        atmosphere: 'warm'
    },
    6: { // TACTICS - Emerald/Grid
        primaryColor: '#34d399', // Emerald-400
        secondaryColor: '#059669',
        orbitRadius: 6.5,
        coreScale: 1.0,
        starColor: '#ecfdf5',
        atmosphere: 'neutral'
    },
    7: { // EMPATHY - Rose/Soft
        primaryColor: '#fb7185', // Rose-400
        secondaryColor: '#e11d48',
        orbitRadius: 5.0,
        coreScale: 0.9,
        starColor: '#fff1f2',
        atmosphere: 'warm'
    },
    8: { // ASCENSION - Indigo/Deep
        primaryColor: '#818cf8', // Indigo-400
        secondaryColor: '#4f46e5',
        orbitRadius: 9.0, // High altitude
        coreScale: 1.5, // Massive presence
        starColor: '#eef2ff',
        atmosphere: 'cool'
    },
    9: { // REVELATION - White/Blinding
        primaryColor: '#ffffff',
        secondaryColor: '#94a3b8',
        orbitRadius: 10.0,
        coreScale: 0.5, // The singularity
        starColor: '#ffffff',
        atmosphere: 'neutral'
    },
    10: { // MASTERY - Gold/Rainbow (Return to source but evolved)
        primaryColor: '#fcd34d', // Amber-300
        secondaryColor: '#a855f7', // Purple secondary
        orbitRadius: 5.5,
        coreScale: 1.0,
        starColor: '#fff7ed',
        atmosphere: 'warm'
    }
};
