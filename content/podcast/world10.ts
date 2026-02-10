import { WorldContent } from "../../services/courses/types";

export const podcastWorld10Content: WorldContent = {
    // MONDO 10: AI VOICE & LEGACY
    narrative: {
        intro: "Il futuro ci raggiunge. Non temerlo, cavalcalo. E lascia qualcosa che duri oltre il tempo.",
        outro: "L'Ascensione è completa. Sei diventato una Voce. E le Voci non muoiono mai."
    },
    modulesContent: [
        {
            // 10.1 Voice Cloning Etico
            scene: { visual: "Un ologramma della tua voce si stacca da te e inizia a parlare autonomamente." },
            download: {
                title: "VOICE CLONING ETICO",
                content: "Eleven Labs e il futuro della sintesi. Come clonare la tua voce per scalare la produzione (intro, ad, correzioni) mantenendo l'anima."
            },
            ritual: {
                title: "Il Gemello Digitale",
                action: "Crea il tuo clone vocale su Eleven Labs.",
                task: "Fagli leggere un testo emotivo. Raffinalo.",
                feedback: "L'AI è lo strumento. Tu sei l'artista.",
                output: "Unlock: 'Clone Vocale Personale'."
            },
            script: "Non è fantascienza. È leva. Immagina di poter registrare mentre dormi. Questa è la magia del 21° secolo."
        },
        {
            // 10.2 Automazione Creativa
            scene: { visual: "Robot invisibili assemblano pezzi di audio mentre tu guardi dall'alto." },
            download: {
                title: "AUTOMAZIONE CREATIVA",
                content: "AI per scripting, show notes, clip social. Automatizzare il noioso per liberare il creativo. Descript e strumenti moderni."
            },
            ritual: {
                title: "La Fabbrica",
                action: "Usa l'AI per estrarre 3 clip virali dal tuo ultimo episodio.",
                task: "Automatizza la trascrizione e i sottotitoli.",
                feedback: "Sii il CEO del tuo contenuto, non l'operaio.",
                output: "Unlock: 'AI Workflow'."
            },
            script: "Il tuo tempo è prezioso. Usalo per pensare e creare, non per tagliare e incollare. Delega alle macchine."
        },
        {
            // 10.3 L'Eredità Sonora
            scene: { visual: "Una capsula del tempo dorata viene sigillata e lanciata verso le stelle." },
            download: {
                title: "L'EREDITÀ SONORA",
                content: "Cosa resterà? Costruire un archivio (Library) che abbia valore tra 10 anni. Il podcast come biografia audio e legacy."
            },
            ritual: {
                title: "Il Messaggio in Bottiglia",
                action: "Registra un messaggio per te stesso tra 10 anni.",
                task: "Cosa vuoi che la tua voce rappresenti nel mondo?",
                feedback: "Le parole volano. La voce registrata resta.",
                output: "Unlock: 'Legacy Blueprint'."
            },
            script: "Hai una responsabilità. La tua voce entrerà nella mente di sconosciuti e pianterà semi. Fa che siano semi di grandezza."
        }
    ]
};
