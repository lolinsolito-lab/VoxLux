import { WorldContent } from '../../services/courses/types';

export const world9: WorldContent = {
    id: 'world-9',
    title: 'RIVELAZIONE',
    subtitle: 'Il Cristallo',
    description: 'La verità nuda. Togliere le maschere.',
    narrative: {
        intro: "Basta artifici. Basta trucchi. Solo la nuda verità.",
        outro: "Trasparente come il cristallo. Tagliente come la luce."
    },
    dualModules: {
        sunContent: {
            title: 'De-Cliché (Purification)',
            technicalContent: 'Pulizia linguistica. Eliminare le frasi fatte ("pensare fuori dagli schemi") che spengono il cervello. Usare metafore originali.',
            microLesson: 'La verità non ha bisogno di aggettivi.',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Scheda: Detox Linguistico.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: 'La Voce Nuda (Improv)',
            psychologicalContent: 'L\'arte dell\'imperfezione (Wabi-Sabi). Lasciare una risata, un\'esitazione, un respiro vero. Essere umani, non AI.',
            guidingQuestion: 'Qual è la tua verità inconfessabile?',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Esercizio: Imperfezione Intenzionale.pdf", url: "#", type: "pdf" }
            ]
        },
        goldenThread: {
            title: 'La Verità (Core Story)',
            synthesisExercise: '"Lo Specchio Sonoro". Raccontare una storia personale di 2 minuti in una sola take, senza script, puntando solo alla verità emotiva.',
            output: 'Recording: Voce Nuda',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Template: Lo Specchio Sonoro.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
