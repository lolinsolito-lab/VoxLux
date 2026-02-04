import { WorldContent } from '../../services/courses/types';

export const world2: WorldContent = {
    id: 'world-2',
    title: 'PRESENZA',
    subtitle: 'Il Tronco Solido',
    description: 'L\'autorità fisica. Essere qui, ora.',
    narrative: {
        intro: "Il mondo non ascolta chi chiede il permesso. Il mondo ascolta chi è... Inamovibile. In questo mondo, imparerai la gravità.",
        outro: "La verità, senza un corpo che la sostenga... è solo vento. Occupate il vostro trono."
    },
    dualModules: {
        sunContent: {
            title: 'La Colonna (The Spine)',
            technicalContent: 'Bioenergetica e Tecnica Alexander. L\'allineamento scheletrico come fonte di autorità vocale. La voce non nasce nella gola, ma nel bacino.',
            microLesson: 'Se il corpo collassa, la storia collassa.',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Scheda: Allineamento Bioenergetico.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: 'Il Secondo Cerchio (The Energy)',
            psychologicalContent: 'La gestione dell\'energia (Patsy Rodenburg). Evitare il Primo Cerchio (introverso/nascondersi) e il Terzo Cerchio (aggressivo/vendere). Abitare il Secondo Cerchio: l\'intimità assoluta.',
            guidingQuestion: 'Stai parlando a loro o con loro?',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Guida: I Tre Cerchi dell'Energia.pdf", url: "#", type: "pdf" }
            ]
        },
        goldenThread: {
            title: 'Lo Sguardo (The Gaze)',
            synthesisExercise: 'Parlare al microfono visualizzando un singolo volto amato. Unire la postura regale (Sole) all\'intimità emotiva (Luna).',
            output: 'Asset: Stabilità Paraverbale',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Checklist: Stabilità Paraverbale.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
