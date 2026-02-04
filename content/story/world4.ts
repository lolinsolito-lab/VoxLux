import { WorldContent } from '../../services/courses/types';

export const world4: WorldContent = {
    id: 'world-4',
    title: 'FREQUENZA',
    subtitle: 'La Linfa Vitale',
    description: 'Il ritmo dell\'anima. La gestione del tempo.',
    narrative: {
        intro: "Il tempo non è una linea retta. È un battito. Sincronizzati.",
        outro: "Hai imparato a respirare con l'universo."
    },
    dualModules: {
        sunContent: {
            title: 'Il Ritmo (Pacing)',
            technicalContent: 'Analisi musicale del parlato. Velocità vs. Densità. Quando accelerare (azione) e quando rallentare (rivelazione). La "regola del 3" nella retorica.',
            microLesson: 'Il silenzio non è vuoto. È il luogo dove l\'ascoltatore pensa.',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Scheda: Analisi Ritmica.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: 'Il Respiro (The Breath)',
            psychologicalContent: 'Il respiro come veicolo di emozione. Non si respira per ossigenare, si respira per "sentire". Inspirare il pensiero, espirare la parola.',
            guidingQuestion: 'Dove vive l\'emozione nel tuo respiro?',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Guida: Respirazione Emozionale.pdf", url: "#", type: "pdf" }
            ]
        },
        goldenThread: {
            title: 'L\'Onda (The Arc)',
            synthesisExercise: 'Leggere un testo piatto e trasformarlo variando solo le pause. Creare un\'onda emotiva (Climax e Rilascio).',
            output: 'Audio: Onde Ritmiche',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Template: Onde Sonore.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
