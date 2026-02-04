import { WorldContent } from '../../services/courses/types';

export const world8: WorldContent = {
    id: 'world-8',
    title: 'ASCENSIONE',
    subtitle: 'I Frutti',
    description: 'Il punto di non ritorno. Il Climax.',
    narrative: {
        intro: "Ogni storia deve salire. Verso la luce, o verso il buio.",
        outro: "Sei arrivato in vetta. Goditi la vista."
    },
    dualModules: {
        sunContent: {
            title: 'Il Fuoco (The Climax)',
            technicalContent: 'La struttura della "Scena Madre". Il momento di massima tensione. Come costruirlo tecnicamente (volume, velocità, sound design).',
            microLesson: 'Senza fuoco, non c\'è trasformazione.',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Checklist: Costruire il Climax.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: 'Il Cambiamento (The Shift)',
            psychologicalContent: 'L\'arco di trasformazione interno. Se alla fine sei uguale all\'inizio, non è successo nulla. Cosa è morto in te? Cosa è nato?',
            guidingQuestion: 'Cosa è cambiato per sempre?',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Workbook: Arco di Trasformazione.pdf", url: "#", type: "pdf" }
            ]
        },
        goldenThread: {
            title: 'La Risoluzione (Return)',
            synthesisExercise: 'Definire lo stato "PRIMA" e lo stato "DOPO" dell\'ascoltatore. Cosa si porta a casa?',
            output: 'BluePrint: Trasformazione',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Blueprint: Prima e Dopo.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
