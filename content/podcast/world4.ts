import { WorldContent } from "../../services/courses/types";

export const podcastWorld4Content: WorldContent = {
    // MONDO 4: EDITING STRATEGICO
    narrative: {
        intro: "L'editing non è correzione. È riscrittura. Qui scolpiamo il tempo e il ritmo del pensiero.",
        outro: "Il superfluo è stato rimosso. Ciò che resta è essenza pura."
    },
    modulesContent: [
        {
            // 4.1 Anatomia del Taglio
            scene: { visual: "Un bisturi laser seziona una forma d'onda, rimuovendo le parti grigie." },
            download: {
                title: "ANATOMIA DEL TAGLIO",
                content: "Cut, Fade, Crossfade. La differenza tra un taglio udibile (errore) e un taglio invisibile (arte). Il respiro come punto di editing."
            },
            ritual: {
                title: "Chirurgia Sonora",
                action: "Prendi una registrazione grezza di 5 min.",
                task: "Riducila a 3 min senza perdere il senso, solo rimuovendo pause e ripetizioni.",
                feedback: "Se non si sente il taglio, hai fatto un buon lavoro.",
                output: "Unlock: 'Workflow Editing'."
            },
            script: "Rispetta il respiro, ma uccidi l'esitazione. Il tuo ospite deve sembrare la versione più intelligente di se stesso."
        },
        {
            // 4.2 Pulizia Chirurgica
            scene: { visual: "Particelle di polvere (click e pop) vengono aspirate via dall'audio." },
            download: {
                title: "PULIZIA CHIRURGICA",
                content: "De-click, De-breath, De-ess. Rimuovere i distatori subconsci che affaticano il cervello dell'ascoltatore."
            },
            ritual: {
                title: "Detox Audio",
                action: "Identifica e rimuovi 5 'Lip Smacks' o respiri eccessivi.",
                task: "Confronta prima e dopo.",
                feedback: "L'ascoltatore non sa perché, ma ora prova sollievo.",
                output: "Unlock: 'Audio Pulito'."
            },
            script: "Ogni 'click' della bocca è un micro-stress per chi ascolta in cuffia. Pulisci il segnale. Rispetta l'orecchio."
        },
        {
            // 4.3 Compressione & Limiting
            scene: { visual: "Un blocco di granito viene pressato fino a diventare un diamante." },
            download: {
                title: "DINAMICHE & LOUDNESS",
                content: "Compressione non vuol dire schiacciare. Vuol dire rendere consistente l'intimità. Portare i sussurri al livello delle urla."
            },
            ritual: {
                title: "Il Muro del Suono",
                action: "Applica compressione 3:1.",
                task: "Nota come la voce diventa 'presente' e 'in faccia'.",
                feedback: "La compressione è il suono della radio moderna.",
                output: "Unlock: 'Master Chain Template'."
            },
            script: "Vogliamo che ti sentano anche in metropolitana. La dinamica è bella, ma l'intelligibilità è regina."
        }
    ]
};
