import { WorldContent } from "../../services/courses/types";

export const podcastWorld9Immersive: WorldContent = {
    id: "world-9",
    title: "La Rivelazione",
    subtitle: "L'Espansione dell'Impero",
    description: "Il podcast non è il prodotto finale. Il podcast è il motore gravitazionale che attrae tutto il resto.",
    narrative: {
        intro: "Hai costruito la gravità. Ora costruisci i pianeti.",
        outro: "L'ecosistema è completo. Sei onnipresente."
    },
    dualModules: {
        sunContent: {
            title: "IP Expansion",
            microLesson: "Uno a Molti.",
            technicalContent: "Trasformare l'audio in libri, corsi, eventi dal vivo.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "La Ruota dei Contenuti",
                    type: "theory",
                    content: `
                        <p>Ogni episodio del podcast è un seme. Non lasciarlo marcire. Un episodio di 45 minuti contiene:</p>
                        <ul>
                            <li>10 Reels/TikTok (Clip).</li>
                            <li>1 Newsletter (Sintesi).</li>
                            <li>1 Capitolo di libro (Trascrizione editata).</li>
                            <li>1 Modulo di corso (Il concetto insegnato).</li>
                        </ul>
                    `
                },
                {
                    title: "Il Libro del Podcast",
                    type: "framework",
                    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2574&auto=format&fit=crop",
                    content: `
                        <p>Tim Ferriss ha scritto "Tools of Titans" semplicemente trascrivendo e riorganizzando le sue interviste. È diventato un Best Seller NYT.</p>
                        <p>Se hai fatto 50 episodi, hai già scritto il tuo libro. Devi solo assemblarlo.</p>
                    `
                },
                {
                    title: "Case Study: Summit of Greatness",
                    type: "case-study",
                    content: `
                        <p>Lewis Howes ha trasformato il suo podcast in un evento dal vivo annuale. La community vuole incontrarsi. L'audio crea intimità, l'evento crea appartenenza fisica.</p>
                    `
                }
            ],
            downloads: [
                { label: "Content Multiplier Map.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "Letting Go (Delega)",
            guidingQuestion: "Sei il collo di bottiglia?",
            psychologicalContent: "L'arte di licenziarsi dal proprio show.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "La Zona di Genio",
                    type: "theory",
                    content: `
                        <p>Tu devi fare solo due cose: 1. Parlare nel microfono. 2. Avere la Visione.</p>
                        <p>Tutto il resto (editing, grafica, caricamento, scheduling) è delegabile a 10-20€/ora. Se lo fai tu, stai svalutando il tuo tempo.</p>
                    `
                },
                {
                    title: "Il Primo Hire",
                    type: "framework",
                    content: `
                        <p>Non assumere un "Audio Engineer". Assumi un "Podcast Manager". Qualcuno che prenda il file raw e ti restituisca i link pronti da condividere.</p>
                        <p>Usa Upwork o Fiverr, ma fai un test pagato. Dai lo stesso file a 3 persone diverse. Assumi chi ti fa meno domande stupide.</p>
                    `
                },
                {
                    title: "Workshop: Il Calcolo del Tempo",
                    type: "workshop",
                    content: `
                        <p><strong>Esercizio:</strong> Cronometra quanto tempo passi a fare editing. Moltiplica per il tuo target orario (es. 100€/h). Scoprirai che quell'editing ti sta costando 400€ a episodio, quando potresti pagarlo 50€.</p>
                    `
                }
            ],
            downloads: []
        },
        goldenThread: {
            title: "La RoadMap a 3 Anni",
            synthesisExercise: "Dove saremo?",
            output: "Vision Board.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "L'Effetto Composto",
                    type: "theory",
                    content: `
                        <p>Un podcast cresce esponenzialmente, non linearmente. I primi 2 anni sono piatti (la "Valle della Morte"). Il 3° anno è verticale.</p>
                        <p>Disegna la linea dove sarai tra 3 anni se non smetti. Quella visione è il carburante per oggi.</p>
                    `
                },
                {
                    title: "Exit Strategy?",
                    type: "framework",
                    content: `
                        <p>Vuoi vendere lo show a Spotify (come Joe Rogan)? Vuoi usarlo per alimentare la tua azienda per sempre? Vuoi cederlo a un altro host?</p>
                        <p>Inizia con la fine in mente.</p>
                    `
                }
            ],
            downloads: [
                { label: "3-Year Growth Plan.pdf", url: "#", type: "pdf" }
            ]
        }
    }
};
