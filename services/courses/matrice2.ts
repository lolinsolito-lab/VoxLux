import { Course } from './types';

export const matrice2: Course = {
    id: 'matrice-2',
    title: 'MATRICE II: Vox Podcast Master',
    description: 'Ingegneria Acustica e design di esperienze sonore immersive.',

    masterminds: Array.from({ length: 10 }, (_, i) => ({
        id: `m2-${i + 1}`,
        title: `Mastermind ${i + 1}: ${[
            'Acustica Psicoattiva', 'Hardware & Setup', 'Sound Design Epico', 'La Regia Invisibile',
            'Interviste Strategiche', 'Montaggio Ritmico', 'Distribuzione Globale', 'Monetizzazione Audio',
            'AI Voice Cloning', 'L\'Eredità Sonora'
        ][i]}`,
        subtitle: 'Tecnica e Arte della Sintesi Sonora',
        modules: [
            {
                id: `m2-${i + 1}-1`,
                title: 'Setup della Cripta',
                description: 'Configurazione dell\'ambiente di registrazione.',
                output: 'Schema Acustico',
                type: 'video',
                duration: '18:45'
            },
            {
                id: `m2-${i + 1}-2`,
                title: 'Frequenze Alpha',
                description: 'Utilizzo di binaural beats.',
                output: 'Sound Pack Base',
                type: 'audio',
                duration: '12:00'
            },
            {
                id: `m2-${i + 1}-3`,
                title: 'Mix & Master Luxury',
                description: 'Compressione, EQ e loudness.',
                output: 'Master Template',
                type: 'video',
                duration: '35:00'
            }
        ]
    }))
};
