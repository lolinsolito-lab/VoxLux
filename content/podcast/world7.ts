import { WorldContent } from "../../services/courses/types";

export const podcastWorld7Content: WorldContent = {
    // MONDO 7: INTERVISTE & STORYTELLING
    narrative: {
        intro: "L'altro è uno specchio. Impara a fare le domande giuste e rivelerai l'anima del mondo.",
        outro: "Hai estratto l'oro dalle parole altrui. Ora sei un maestro della conversazione."
    },
    modulesContent: [
        {
            // 7.1 La Domanda Che Disarma
            scene: { visual: "Una chiave dorata gira in una serratura complessa, aprendo una porta segreta." },
            download: {
                title: "LA DOMANDA CHE DISARMA",
                content: "Come superare le risposte pre-confezionate (PR answers). Tecniche per portare l'ospite in uno stato di flusso e vulnerabilità."
            },
            ritual: {
                title: "Lo Scassinatore",
                action: "Prepara 3 domande che l'ospite non ha mai sentito.",
                task: "Evita 'raccontaci di te'. Chiedi 'qual è stata la tua notte più buia?'.",
                feedback: "Le domande migliori sono brevi e coraggiose.",
                output: "Unlock: 'Question Framework'."
            },
            script: "Non chiedere informazioni. Chiedi trasformazioni. Non chiedere 'cosa', chiedi 'perché' e 'come ti sei sentito'."
        },
        {
            // 7.2 Ascolto Attivo Strategico
            scene: { visual: "Un radar pulsa dal centro, captando segnali deboli e nascosti." },
            download: {
                title: "ASCOLTO ATTIVO STRATEGICO",
                content: "Il silenzio come arma. Come usare le pause per far dire all'ospite più di quanto volesse. Ascoltare il non-detto."
            },
            ritual: {
                title: "Il Vuoto Fertile",
                action: "Simulazione: Dopo una risposta, aspetta 3 secondi prima di parlare.",
                task: "Osserva come l'altro riempie il vuoto con la verità.",
                feedback: "La magia accade nelle pause.",
                output: "Unlock: 'Listening Protocol'."
            },
            script: "Se stai pensando alla prossima domanda, non stai ascoltando. Sii presente. Balla con quello che ti danno."
        },
        {
            // 7.3 Montaggio Narrativo
            scene: { visual: "Pezzi di un puzzle temporale vengono riordinati per formare un'immagine perfetta." },
            download: {
                title: "MONTAGGIO NARRATIVO",
                content: "La cronologia è noiosa. Inizia dalla fine (In Media Res). Costruisci archi narrativi spostando blocchi di conversazione."
            },
            ritual: {
                title: "Lo Storyboarder",
                action: "Prendi un'intervista lineare.",
                task: "Sposta il momento più emozionante all'inizio (Cold Open).",
                feedback: "La realtà è lineare. La storia è circolare.",
                output: "Unlock: 'Story Arc Template'."
            },
            script: "Tu non sei un verbalizzatore. Sei un regista. Hai il potere di manipolare il tempo per massimizzare l'impatto."
        }
    ]
};
