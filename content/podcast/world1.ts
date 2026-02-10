import { WorldContent } from "../../services/courses/types";

export const podcastWorld1Content: WorldContent = {
    // MONDO 1: FONDAZIONE ACUSTICA
    narrative: {
        intro: "Il suono non è vibrazione. È architettura della mente. In questo mondo, imparerai a costruire cattedrali invisibili.",
        outro: "Hai posato la prima pietra. Il tuo tempio sonoro ha ora fondamenta che nessuno può scuotere."
    },
    modulesContent: [
        {
            // 1.1 Architettura Invisibile
            scene: { visual: "Uno spettrogramma dorato fluttua nel vuoto, reagendo al tuo respiro." },
            download: {
                title: "ARCHITETTURA INVISIBILE",
                content: "Prima di registrare, devi progettare lo spazio acustico. Non stai parlando a un microfono, stai parlando all'orecchio interno del tuo ascoltatore."
            },
            ritual: {
                title: "Il Silenzio Zero",
                action: "Ascolta il silenzio della tua stanza.",
                task: "Identifica 3 rumori di fondo. Eliminali.",
                feedback: "L'eliminazione del rumore è un atto di purezza.",
                output: "Unlock: 'Santuario Psicoacustico'."
            },
            script: "Chiudi gli occhi. Cosa senti? Il ronzio del frigo? Il traffico? Quello è il nemico. Il silenzio è la tela."
        },
        {
            // 1.2 La Scelta dell'Arma
            scene: { visual: "Il microfono al centro si illumina. Attorno ad esso ruotano anelli di frequenza." },
            download: {
                title: "LA SCELTA DELL'ARMA",
                content: "Dinamico o Condensatore? USB o XLR? Non sono scelte tecniche, sono scelte di intimità. Il microfono è l'estensione della tua laringe."
            },
            ritual: {
                title: "Sintonizzazione",
                action: "Parla al microfono da diverse distanze.",
                task: "Trova il 'Punto di Prossimità' (Sweet Spot).",
                feedback: "La voce cambia personalità con la distanza.",
                output: "Unlock: 'Setup Ottimale'."
            },
            script: "Avvicinati. Ancora. Senti come il suono diventa caldo? L'effetto di prossimità è il segreto."
        },
        {
            // 1.3 Flusso di Segnale
            scene: { visual: "L'onda sonora si stabilizza e diventa una linea solida di luce indaco." },
            download: {
                title: "FLUSSO DI SEGNALE",
                content: "Dal microfono alla DAW. Ogni cavo, ogni interfaccia è un ponte. Se il ponte è debole, il messaggio cade nel vuoto."
            },
            ritual: {
                title: "Il Check-Up",
                action: "Gain Staging: Imposta il livello perfetto (-12dB).",
                task: "Registra il silenzio e la voce piena.",
                feedback: "Il segnale troppo basso è timido. Troppo alto è arrogante.",
                output: "Unlock: 'Catena Audio Perfetta'."
            },
            script: "Il volume non è potenza. La chiarezza è potenza. Non cercare di sovrastare il rumore. Toglilo."
        }
    ]
};
