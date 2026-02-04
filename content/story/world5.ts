import { WorldContent } from '../../services/courses/types';

export const world5: WorldContent = {
    id: 'world-5',
    title: 'ARCHETIPI',
    subtitle: 'Le Maschere',
    description: 'I personaggi universali. Chi abita la tua storia?',
    narrative: {
        intro: "Non siamo mai soli. Dentro di te vivono mille volti. Chi parla ora?",
        outro: "Le maschere sono cadute. Resta solo la verità."
    },
    dualModules: {
        sunContent: {
            title: 'Il Custode (The Guide)',
            technicalContent: 'Il tuo ruolo come narratore. Tu non sei l\'Eroe (Luke Skywalker), sei la Guida (Yoda). La tua autorità tecnica serve a proteggere l\'ascoltatore.',
            microLesson: 'Non essere il protagonista della tua storia.',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Scheda: Archetipi Narrativi.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: 'La Ferita (Hamartia)',
            psychologicalContent: 'Il "Difetto Fatale". Perché la perfezione annoia e la debolezza connette. Rivelare la propria ferita per creare fiducia istantanea.',
            guidingQuestion: 'In cosa hai fallito?',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Esercizio: Trova la Ferita.pdf", url: "#", type: "pdf" }
            ]
        },
        goldenThread: {
            title: 'L\'Antagonista (The Dragon)',
            synthesisExercise: 'Definire il "Villain" del tuo episodio. Non una persona, ma un concetto (es. La Paura, Il Tempo, La Burocrazia). Nominare il Drago per poterlo sconfiggere.',
            output: 'Profilo: Il Drago',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Profilo: Il Drago.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
