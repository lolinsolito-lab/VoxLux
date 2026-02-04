import { WorldContent } from '../../services/courses/types';

export const world10: WorldContent = {
    id: 'world-10',
    title: 'MAESTRIA',
    subtitle: 'La Corona dell\'Albero',
    description: 'Il Sovrano della Narrazione. Il cerchio si chiude.',
    narrative: {
        intro: "Non sei più uno studente. Sei un Maestro. Il mondo attende la tua voce.",
        outro: "La fine è solo un nuovo inizio. Va' e crea mondi."
    },
    dualModules: {
        sunContent: {
            title: 'Il Comando (Authority)',
            technicalContent: 'La sintesi di Ethos, Pathos e Logos. Diventare un Leader Culturale, non solo un podcaster.',
            microLesson: 'Ora sei pronto a guidare.',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Manifesto: Leadership Culturale.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: 'L\'Eredità (Legacy)',
            psychologicalContent: 'Il tuo impatto sul mondo. Creare una mitologia personale che sopravvive all\'episodio.',
            guidingQuestion: 'Cosa resterà dopo di te?',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Workbook: La Tua Eredità.pdf", url: "#", type: "pdf" }
            ]
        },
        goldenThread: {
            title: 'Il Capolavoro (Masterwork)',
            synthesisExercise: 'Il Rituale Finale: Creazione dell\'audio finale di 5 minuti che utilizza tutte le tecniche (Sole) e tutte le emozioni (Luna) apprese.',
            output: 'Asset: MASTERPIECE',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Checklist: Masterpiece Finale.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
