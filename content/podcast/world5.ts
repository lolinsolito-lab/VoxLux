import { WorldContent } from "../../services/courses/types";

export const podcastWorld5Content: WorldContent = {
    // MONDO 5: PRODUZIONE & MIX
    narrative: {
        intro: "Hai registrato e pulito. Ora devi dipingere. Il mix è dove la tecnica diventa emozione.",
        outro: "La tua voce ora brilla. Sei pronto per le orecchie del mondo."
    },
    modulesContent: [
        {
            // 5.1 EQ Strategico
            scene: { visual: "Frequenze colorate vengono bilanciate su una bilancia d'oro." },
            download: {
                title: "EQ STRATEGICO",
                content: "Scolpire le frequenze. Rimuovere il fango (Low Mids), esaltare la presenza (High Mids), aggiungere aria (Highs)."
            },
            ritual: {
                title: "Scolpire la Voce",
                action: "Applica High Pass Filter a 80Hz.",
                task: "Trova e riduci la frequenza nasale risonante.",
                feedback: "L'EQ sottrattivo è più potente di quello additivo.",
                output: "Unlock: 'EQ Curves Personali'."
            },
            script: "Non aggiungere ciò che manca. Togli ciò che disturba. L'EQ è l'arte della sottrazione."
        },
        {
            // 5.2 Layering Sonoro
            scene: { visual: "Strati trasparenti di vetro si sovrappongono creando un'immagine complessa." },
            download: {
                title: "LAYERING SONORO",
                content: "Voce + Musica + SFX. Come bilanciare i livelli (Ducking) affinché la voce regni sempre sovrana ma non sia mai sola."
            },
            ritual: {
                title: "Il Tappeto Volante",
                action: "Mixa una voce su una base musicale.",
                task: "Usa il Sidechain Compression per abbassare la musica quando parli.",
                feedback: "La musica deve sostenere, non combattere.",
                output: "Unlock: 'Multi-Track Mix'."
            },
            script: "La musica è il sottotesto emotivo. Deve guidare il cuore senza distrarre la mente."
        },
        {
            // 5.3 Mastering per Streaming
            scene: { visual: "Un sigillo finale viene impresso sul file audio. Check verde: 'Spotify Ready'." },
            download: {
                title: "MASTERING PER STREAMING",
                content: "LUFS, True Peak, Standard broadcast. Come assicurarsi che il tuo podcast suoni forte e chiaro su Spotify come su Apple."
            },
            ritual: {
                title: "Final Polish",
                action: "Misura i LUFS del tuo mix.",
                task: "Portalo a -14 LUFS (Standard) o -16 LUFS (Apple).",
                feedback: "Sei pronto per la distribuzione globale.",
                output: "Unlock: 'Export Settings Pro'."
            },
            script: "Questo è l'ultimo tocco. La vernice finale. Assicurati che il tuo lavoro rispetti gli standard dell'industria."
        }
    ]
};
