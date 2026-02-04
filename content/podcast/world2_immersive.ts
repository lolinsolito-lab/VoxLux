import { WorldContent } from "../../services/courses/types";

export const podcastWorld2Immersive: WorldContent = {
    id: "world-2",
    title: "La Struttura",
    subtitle: "L'Ingegneria del Flusso",
    description: "Un podcast non è un monologo, è un viaggio. Costruisci i pilastri che sosterranno l'attenzione.",
    narrative: {
        intro: "La Struttura. L'ordine nel caos...",
        outro: "Le fondamenta sono solide. Possiamo costruire."
    },
    dualModules: {
        sunContent: {
            title: "Il Triangolo di Potere",
            microLesson: "Hook, Value, Retention.",
            technicalContent: "Ogni episodio deve avere una struttura invisibile ma percepibile. L'ascoltatore deve sempre sapere dove si trova.",
            longText: `
                <h3>Ingegneria dell'Episodio</h3>
                <p>La struttura classica in 3 atti applicata all'audio.</p>
                <ul>
                    <li><strong>Hook (0:00-0:30):</strong> La promessa. Perché devo restare?</li>
                    <li><strong>Value (0:30-15:00):</strong> La consegna della promessa. Densità di informazione alta.</li>
                    <li><strong>Retention (15:00-End):</strong> Il ponte verso il prossimo episodio.</li>
                </ul>
            `,
            videoUrl: "https://player.vimeo.com/video/524933864",
            downloads: [
                { label: "Template Struttura Episodio.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "Il Ritmo Emotivo",
            guidingQuestion: "Dove stai portando l'energia?",
            psychologicalContent: "Non puoi tenere l'energia al 100% sempre. Devi alternare tensione e rilascio.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            downloads: []
        },
        goldenThread: {
            title: "Output: Lo Scheletro",
            synthesisExercise: "Disegna la scaletta del tuo Episodio Zero.",
            output: "Carica il PDF della scaletta.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            downloads: []
        }
    }
};
