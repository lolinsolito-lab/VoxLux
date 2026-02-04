import { WorldContent } from "../../services/courses/types";

export const podcastWorld10Immersive: WorldContent = {
    id: "world-10",
    title: "La Maestria",
    subtitle: "L'Eredità Immortale",
    description: "Il viaggio finisce dove è iniziato, ma tu non sei più lo stesso. Ora non sei più un podcaster. Sei una Voce.",
    narrative: {
        intro: "Ciò che hai detto rimarrà per sempre nell'etere digitale. Fanne buon uso.",
        outro: "Il sistema è completo. Sei pronto per l'Ascensione."
    },
    dualModules: {
        sunContent: {
            title: "Thought Leadership",
            microLesson: "Diventare il Guru.",
            technicalContent: "Come passare da 'creatore di contenuti' a 'leader di pensiero'.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Autenticità Radicale",
                    type: "theory",
                    content: `
                        <p>La Maestria non è perfezione tecnica. È la capacità di dire ciò che tutti pensano ma nessuno ha il coraggio di dire.</p>
                        <p>I leader non seguono i trend. I leader creano i trend andando controcorrente.</p>
                    `
                },
                {
                    title: "Il Concetto Proprietario",
                    type: "framework",
                    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2671&auto=format&fit=crop",
                    content: `
                        <p>Per essere ricordato, devi coniare i tuoi termini. "Oceano Blu", "Anti-Fragile", "Deep Work".</p>
                        <p>Dai un nome ai fenomeni che osservi. Se dai il nome a una cosa, la possiedi nella mente del tuo ascoltatore.</p>
                    `
                },
                {
                    title: "Case Study: Naval Ravikant",
                    type: "case-study",
                    content: `
                        <p>Naval non ha un podcast regolare. Parla quando ha qualcosa da dire. Ma quando parla, il mondo si ferma. Questa è Maestria. Meno segnale, più densità.</p>
                    `
                }
            ],
            downloads: [
                { label: "Leadership Framework.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "Legacy",
            guidingQuestion: "Cosa resta quando spegni il mic?",
            psychologicalContent: "Costruire qualcosa che sopravviva a te.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "La Voce nel Buio",
                    type: "theory",
                    content: `
                        <p>Qualcuno, tra 10 anni, ritroverà questo episodio in un momento buio della sua vita. E la tua voce lo salverà. Tu non lo saprai mai.</p>
                        <p>Questa è la responsabilità che hai. Non stai parlando a un microfono. Stai parlando al futuro.</p>
                    `
                },
                {
                    title: "La Responsabilità della Verità",
                    type: "framework",
                    content: `
                        <p>Quando hai influenza, hai potere. Usa il tuo show per alzare il livello di coscienza collettiva, non solo per vendere materassi.</p>
                    `
                },
                {
                    title: "Workshop: La Lettera Finale",
                    type: "workshop",
                    content: `
                        <p><strong>Esercizio:</strong> Se questo fosse il tuo ultimo episodio, cosa diresti? Registra un "Emergency Episode" di 5 minuti con il tuo messaggio core al mondo. Tienilo da parte.</p>
                    `
                }
            ],
            downloads: []
        },
        goldenThread: {
            title: "La Sintesi Finale",
            synthesisExercise: "Il Cerchio si Chiude.",
            output: "Richiedi il Diploma.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Il Viaggio dell'Eroe",
                    type: "theory",
                    content: `
                        <p>Sei partito dal Mondo Ordinario (non sapevi cosa dire). Hai attraversato la Soglia (il primo episodio). Hai affrontato l'Ordalìa (il Podfading e i numeri bassi). Ora torni con l'Elisir (la tua Voce autentica).</p>
                    `
                },
                {
                    title: "Pronti per l'Esame",
                    type: "framework",
                    content: `
                        <p>Hai completato i 10 Mondi. Ora dimostra di aver appreso.</p>
                        <p>Il guardiano della soglia ti attende. Rispondi alle domande e reclama il tuo posto tra i Maestri.</p>
                    `
                }
            ],
            downloads: []
        }
    }
};
