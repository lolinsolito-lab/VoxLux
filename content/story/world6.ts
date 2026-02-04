import { WorldContent } from '../../services/courses/types';

export const world6: WorldContent = {
    id: 'world-6',
    title: 'TATTICA',
    subtitle: 'Le Spine',
    description: 'Ingegneria dell\'attenzione. Tenere l\'ascoltatore in ostaggio.',
    narrative: {
        intro: "L'attenzione non si chiede. Si ruba. Strategia è destino.",
        outro: "Ora possiedi la loro mente. Usala con cura."
    },
    dualModules: {
        sunContent: {
            title: 'Il Gancio (The Hook)',
            technicalContent: 'Tecnica "In Media Res". Iniziare a metà dell\'azione. I primi 60 secondi devono contenere una promessa o una minaccia.',
            microLesson: 'Se non li prendi subito, li perdi per sempre.',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Checklist: I 5 Hook.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: 'L\'Attesa (Open Loops)',
            psychologicalContent: 'L\'Effetto Zeigarnik. Il cervello umano odia le cose non finite. Aprire "loop" psicologici (domande) e non chiuderli subito per generare desiderio.',
            guidingQuestion: 'Cosa sta aspettando di sapere l\'ascoltatore?',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Guida: Open Loops.pdf", url: "#", type: "pdf" }
            ]
        },
        goldenThread: {
            title: 'La Svolta (Plot Twist)',
            synthesisExercise: 'Costruire un micro-racconto di 3 frasi: Contesto -> Azione -> Rovesciamento (Sorpresa).',
            output: 'Micro-Script: Hook',
            videoUrl: "https://player.vimeo.com/video/524933864?h=1ac4fd9ef4", // Placeholder
            downloads: [
                { label: "Template: Plot Twist.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
