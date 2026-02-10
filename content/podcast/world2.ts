import { WorldContent } from "../../services/courses/types";

export const podcastWorld2Content: WorldContent = {
    // MONDO 2: PSICOLOGIA VOCALE
    narrative: {
        intro: "La tua voce è il primo strumento. Prima di parlare agli altri, devi imparare a suonare te stesso.",
        outro: "Ora controlli lo strumento. Non sei più uno speaker, sei un direttore d'orchestra."
    },
    modulesContent: [
        {
            // 2.1 Texture Vocale
            scene: { visual: "Corde vocali stilizzate vibrano come arpe luminose." },
            download: {
                title: "TEXTURE VOCALE",
                content: "Tono, ritmo, volume. Questi sono i colori della tua palette. Impara a dipingere con la voce, non solo a trasmettere dati."
            },
            ritual: {
                title: "Lo Spettro",
                action: "Registra la stessa frase in 3 modalità: Autorevole, Empatica, Energica.",
                task: "Ascolta le differenze frequenziali.",
                feedback: "La monotonia è la morte dell'attenzione.",
                output: "Unlock: 'Profilo Vocale'."
            },
            script: "La tua voce ha una texture. È ruvida come la pietra o liscia come la seta? Usala intenzionalmente."
        },
        {
            // 2.2 Respirazione Strategica
            scene: { visual: "Un polmone di luce si espande e contrae ritmicamente." },
            download: {
                title: "RESPIRAZIONE STRATEGICA",
                content: "Il respiro è il carburante del pensiero. Senza ossigeno, la voce trema e il pensiero si annebbia. Controllo diaframmatico."
            },
            ritual: {
                title: "Il Mantice",
                action: "Esercizio respiratorio 4-7-8 prima di registrare.",
                task: "Sostieni una nota per 30 secondi.",
                feedback: "Chi controlla il respiro, controlla la stanza.",
                output: "Unlock: 'Controllo del Respiro'."
            },
            script: "Non respirare per sopravvivere. Respira per performare. L'aria è la materia prima delle tue parole."
        },
        {
            // 2.3 Il Punto di Prossimità
            scene: { visual: "Onde concentriche si espandono dalla bocca del narratore all'infinito." },
            download: {
                title: "IL PUNTO DI PROSSIMITÀ",
                content: "L'intimità si crea con la fisica. La distanza dal microfono cambia la percezione psicologica dell'ascoltatore."
            },
            ritual: {
                title: "Il Sussurro",
                action: "Registra avvicinandoti progressivamente al microfono.",
                task: "Trova il punto dove la voce 'abbraccia' l'ascoltatore.",
                feedback: "Troppo vicino è invadente. Troppo lontano è freddo.",
                output: "Unlock: 'Sweet Spot Personale'."
            },
            script: "Vuoi parlare alla folla o all'individuo? Il podcast è un medium intimo. Entra nel loro spazio personale con rispetto."
        }
    ]
};
