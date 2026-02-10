import { WorldContent } from "../../services/courses/types";

export const podcastWorld6Content: WorldContent = {
    // MONDO 6: SOUND DESIGN EMOZIONALE
    narrative: {
        intro: "Non raccontare e basta. Faglielo vivere. Il sound design è la scenografia del teatro della mente.",
        outro: "Hai creato un mondo in cui l'ascoltatore può perdersi. E ritrovarsi."
    },
    modulesContent: [
        {
            // 6.1 Palette Sonora
            scene: { visual: "Barattoli di vernice sonora vengono aperti: Tuono, Pioggia, Traffico, Vento." },
            download: {
                title: "PALETTE SONORA",
                content: "Creare la tua libreria di SFX. Categorizzare i suoni: Puntuali (Hard FX), Ambientali (Atmospheres), Emozionali (Musical FX)."
            },
            ritual: {
                title: "Il Collezionista",
                action: "Scegli 3 suoni che definiscono il tuo brand.",
                task: "Crea la tua cartella 'Signature Sounds'.",
                feedback: "La coerenza sonora crea branding.",
                output: "Unlock: 'Sound Pack Personale'."
            },
            script: "Qual è il suono della tua idea? È un cristallo che si rompe o un fuoco che crepita? Definisci il tuo universo."
        },
        {
            // 6.2 Transizioni Cinematiche
            scene: { visual: "Un ponte di luce collega due isole fluttuanti (due argomenti)." },
            download: {
                title: "TRANSIZIONI CINEMATICHE",
                content: "Whoosh, Risers, Impacts, Drops. Usare il suono per segnalare il cambio di capitolo o argomento. Mantenere l'attenzione alta."
            },
            ritual: {
                title: "Il Cambio Scena",
                action: "Inserisci un 'Whoosh-Hit' tra l'intro e il contenuto.",
                task: "Senti come resetta l'attenzione?",
                feedback: "Le transizioni sono i punti e a capo dell'audio.",
                output: "Unlock: 'Transition Kit'."
            },
            script: "Non lasciare che l'ascoltatore si addormenti. Sveglialo con un cambio di energia. Guidalo per mano da una stanza all'altra."
        },
        {
            // 6.3 Architettura delle Emozioni
            scene: { visual: "Un grafico mostra la tensione emotiva salire e scendere in sincronia con la musica." },
            download: {
                title: "ARCHITETTURA DELLE EMOZIONI",
                content: "Tensione e Rilascio. Usare droni bassi per l'ansia, archi alti per la speranza. Manipolazione etica dello stato d'animo."
            },
            ritual: {
                title: "Il Regista Emotivo",
                action: "Racconta una storia triste con musica allegra, poi viceversa.",
                task: "Senti la dissonanza? Ora allinea musica e parole.",
                feedback: "Il suono deve amplificare l'emozione, non contraddirla.",
                output: "Unlock: 'Emotional Soundscape'."
            },
            script: "Tu sei il compositore delle loro emozioni. Usa il suono per farli piangere, ridere, tremare."
        }
    ]
};
