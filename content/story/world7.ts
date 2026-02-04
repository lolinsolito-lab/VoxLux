import { WorldContent } from '../../services/courses/types';

export const world7: WorldContent = {
    id: 'world-7',
    title: 'EMPATIA',
    subtitle: 'I Fiori',
    description: 'La risonanza limbica. Toccare il cuore.',
    narrative: {
        intro: "La logica convince, l'emozione muove. Entra nel loro cuore.",
        outro: "Non c'è più distanza tra te e loro. Siete una cosa sola."
    },
    dualModules: {
        sunContent: {
            title: 'Il Calore (Tone)',
            technicalContent: 'La prosodia. Come "colorare" le parole. La differenza tecnica tra voce di testa (distaccata) e voce di petto (calda).',
            microLesson: 'La gente dimentica cosa dici, ma non come li fai sentire.',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Scheda: I Registri Vocali.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: 'Il Non-Detto (Subtext)',
            psychologicalContent: 'Ascoltare ciò che non viene detto. Il sottotesto emotivo. L\'empatia non è capire le parole, è capire il silenzio tra le parole.',
            guidingQuestion: 'Qual è l\'emozione sotto questa frase?',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Guide: Ascoltare il Sottotesto.pdf", url: "#", type: "pdf" }
            ]
        },
        goldenThread: {
            title: 'Il Tocco (Intimacy)',
            synthesisExercise: 'L\'uso del "NOI". Riscrivere un paragrafo trasformando "Io vi insegno" in "Noi scopriamo insieme". Abbattere il pulpito.',
            output: 'Script: Intimità',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Script: Scrittura Intima.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
