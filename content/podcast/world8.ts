import { WorldContent } from "../../services/courses/types";

export const podcastWorld8Content: WorldContent = {
    // MONDO 8: DISTRIBUZIONE GLOBALE
    narrative: {
        intro: "Hai creato valore. Ora devi consegnarlo. Il mondo è vasto, ma ci sono autostrade digitali che portano ovunque.",
        outro: "Il segnale è ovunque. La tua voce è ora onnipresente."
    },
    modulesContent: [
        {
            // 8.1 Piattaforme & RSS
            scene: { visual: "Un hub centrale spara raggi di luce verso icone planetarie (Spotify, Apple, Google)." },
            download: {
                title: "PIATTAFORME & RSS",
                content: "Hosting provider. Come funziona l'RSS feed. Distribuire su Spotify, Apple Podcasts, Amazon Music e oltre con un click."
            },
            ritual: {
                title: "Il Lancio",
                action: "Configura il tuo hosting (Anchor/Spotify o Buzzsprout).",
                task: "Valida il feed RSS.",
                feedback: "Sii ovunque. Rimuovi ogni frizione all'ascolto.",
                output: "Unlock: 'Multi-Platform Setup'."
            },
            script: "Non importa quale app usano. Tu devi essere lì. Il tuo show deve essere utility pubblica, accessibile come l'acqua."
        },
        {
            // 8.2 SEO Audio
            scene: { visual: "Parole chiave luminose galleggiano nell'aria e vengono attratte da un magnete." },
            download: {
                title: "SEO AUDIO",
                content: "Titoli, descrizioni, show notes. Come farsi trovare dai motori di ricerca e dagli algoritmi interni delle app."
            },
            ritual: {
                title: "La Calamita",
                action: "Riscrivi 3 titoli di episodi.",
                task: "Usa la formula: Beneficio + Curiosità + Keywords.",
                feedback: "Se non cliccano, non ascoltano. Il titolo è l'80% del lavoro.",
                output: "Unlock: 'SEO Checklist'."
            },
            script: "Non essere criptico. Sii chiaro. La gente cerca risposte ai loro problemi. Metti la soluzione nel titolo."
        },
        {
            // 8.3 Viralità Algoritmica
            scene: { visual: "Un'onda d'urto si propaga esponenzialmente attraverso una rete di nodi." },
            download: {
                title: "VIRALITÀ ALGORITMICA",
                content: "Chart ranking, velocity, ratings. Come hackerare (eticamente) l'algoritmo al lancio per entrare in classifica."
            },
            ritual: {
                title: "L'Onda d'Urto",
                action: "Pianifica la strategia 'Launch Week'.",
                task: "Obiettivo: 50 recensioni in 48 ore.",
                feedback: "L'algoritmo ama la velocità. Dagli fuoco.",
                output: "Unlock: 'Launch Strategy'."
            },
            script: "Agli algoritmi non piaci tu. A loro piace l'engagement. Dagli quello che vogliono e ti daranno il mondo."
        }
    ]
};
