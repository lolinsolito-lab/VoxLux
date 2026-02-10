import { WorldContent } from "../../services/courses/types";

export const podcastWorld3Content: WorldContent = {
    // MONDO 3: ARCHITETTURA SONORA
    narrative: {
        intro: "Non registriamo nel vuoto. Registriamo in uno spazio. Impara a piegare l'acustica alla tua volontà.",
        outro: "Hai costruito il tuo tempio. Ora ogni parola risuonerà con la giusta sacralità."
    },
    modulesContent: [
        {
            // 3.1 Trattamento Acustico
            scene: { visual: "Pannelli geometrici assorbono onde rosse caotiche, restituendo onde blu ordinate." },
            download: {
                title: "TRATTAMENTO ACUSTICO",
                content: "La stanza suona più del microfono. Bass traps, pannelli, diffusione. Come trattare uno spazio senza spendere una fortuna."
            },
            ritual: {
                title: "Il Clapping Test",
                action: "Batti le mani negli angoli della stanza.",
                task: "Identifica le frequenze che 'rimbalzano' metalliche.",
                feedback: "Il riverbero incontrollato distrugge l'intelligibilità.",
                output: "Unlock: 'Mappa Acustica'."
            },
            script: "Senti quel rimbombo? È il suono che muore male. Dobbiamo catturarlo prima che torni nel microfono."
        },
        {
            // 3.2 Il Silenzio Come Canvas
            scene: { visual: "Un livello d'acqua perfettamente immobile riflette il cielo." },
            download: {
                title: "IL SILENZIO COME CANVAS",
                content: "Noise floor e rapporto segnale/rumore. Il silenzio digitale assoluto è innaturale. Il 'Room Tone' è la colla."
            },
            ritual: {
                title: "Cattura del Fantasma",
                action: "Registra 30 secondi di 'Room Tone' puro.",
                task: "Usa questo profilo per la riduzione rumore spettrale.",
                feedback: "Il silenzio non è vuoto. È pieno di potenziale.",
                output: "Unlock: 'Profilo Silenzio'."
            },
            script: "Non cancellare il mondo. Addomesticalo. Il Room Tone è l'impronta digitale del tuo spazio."
        },
        {
            // 3.3 Reverb Naturale vs Artificiale
            scene: { visual: "Una cattedrale virtuale si costruisce attorno all'audio." },
            download: {
                title: "REVERB & SPAZIALITÀ",
                content: "Quando aggiungere spazio artificiale? Creare profondità e ambiente per trasportare l'ascoltatore altrove."
            },
            ritual: {
                title: "Teletrasporto",
                action: "Applica un riverbero 'Small Room' e uno 'Large Hall' alla stessa voce.",
                task: "Senti come cambia l'autorità percepita.",
                feedback: "Il riverbero è un vestito. Scegli quello adatto all'occasione.",
                output: "Unlock: 'Signature Reverb'."
            },
            script: "Dove siamo? In una biblioteca o in uno stadio? Tu decidi la location nella mente dell'ascoltatore."
        }
    ]
};
