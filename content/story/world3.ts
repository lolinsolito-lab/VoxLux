import { WorldContent } from '../../services/courses/types';

export const world3: WorldContent = {
    id: 'world-3',
    title: 'VISIONE',
    subtitle: 'I Primi Rami',
    description: 'L\'allucinazione consensuale. Far vedere con le orecchie.',
    narrative: {
        intro: "Vedere è un atto creativo. Se tu non lo vedi, loro non lo vedranno.",
        outro: "Ora i tuoi occhi sono proiettori. Il mondo è il tuo schermo."
    },
    dualModules: {
        sunContent: {
            title: 'Il Sistema VAK (The Tools)',
            technicalContent: 'Programmazione Neuro-Linguistica. L\'uso scientifico di parole Visive, Auditive e Cinestetiche per attivare la corteccia sensoriale dell\'ascoltatore.',
            microLesson: 'Non dire "era freddo". Di\' "mi battevano i denti".',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Scheda: Sistema VAK.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: 'Il Teatro Interno (The Dream)',
            psychologicalContent: 'L\'immaginazione attiva. Prima di descrivere una scena, devi "abitarla" mentalmente. Se tu non lo vedi (Luna), loro non lo vedranno (Sole).',
            guidingQuestion: 'Che odore ha questa scena?',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Esercizio: Il Teatro Interno.pdf", url: "#", type: "pdf" }
            ]
        },
        goldenThread: {
            title: 'La Camera (The Lens)',
            synthesisExercise: 'Descrivere una stanza familiare per 60 secondi usando solo tatto e olfatto, senza mai nominare i colori.',
            output: 'Skill: Vista Cinematografica',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Template: Descrizione Sensoriale.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
