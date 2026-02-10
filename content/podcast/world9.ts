import { WorldContent } from "../../services/courses/types";

export const podcastWorld9Content: WorldContent = {
    // MONDO 9: MONETIZZAZIONE AUDIO
    narrative: {
        intro: "L'arte ha bisogno di risorse. Trasforma l'attenzione in sostegno, e il sostegno in libertà creativa.",
        outro: "Il cerchio si chiude. Il valore che dai ritorna a te moltiplicato."
    },
    modulesContent: [
        {
            // 9.1 Sponsorizzazioni Strategiche
            scene: { visual: "Due mani di luce si stringono. Un contratto d'oro si materializza." },
            download: {
                title: "SPONSORIZZAZIONI STRATEGICHE",
                content: "CPM vs Value Based. Come pitchare agli sponsor anche con pochi ascolti. Pre-roll, Mid-roll e l'arte della 'Host-Read Ad'."
            },
            ritual: {
                title: "Il Pitch",
                action: "Scrivi una mail a un potenziale sponsor di nicchia.",
                task: "Non vendere numeri. Vendi la fiducia della tua audience.",
                feedback: "Tu non vendi impression. Vendi influenza.",
                output: "Unlock: 'Media Kit'."
            },
            script: "Non interrompere lo show per la pubblicità. Integra la pubblicità nello show. Se la consigli tu, non è ad, è consiglio."
        },
        {
            // 9.2 Premium Membership
            scene: { visual: "Un cancello di velluto si apre solo per chi ha la chiave dorata." },
            download: {
                title: "PREMIUM MEMBERSHIP",
                content: "Patreon, Supercast, Apple Subscriptions. Creare contenuti bonus per i 'Super Fans'. I 1000 True Fans."
            },
            ritual: {
                title: "Il Santuario",
                action: "Definisci la tua offerta Premium.",
                task: "Cosa dai in più? (Backstage, Q&A, Extended Episodes).",
                feedback: "I veri fan vogliono 'di più di te'.",
                output: "Unlock: 'Membership Strategy'."
            },
            script: "Chiedi supporto con orgoglio. Stai dando valore. Chi ti ama vuole sostenerti. Dagliene la possibilità."
        },
        {
            // 9.3 Ecosystem Audio
            scene: { visual: "Un albero cresce dal podcast, i cui rami sono libri, corsi, eventi." },
            download: {
                title: "ECOSYSTEM AUDIO",
                content: "Il podcast come Top of Funnel. Portare traffico a corsi, coaching, eventi. Monetizzare la backend, non solo l'ascolto.",
            },
            ritual: {
                title: "L'Imbuto",
                action: "Inserisci una CTA chiara alla fine dell'episodio.",
                task: "Portali fuori dall'app, nel tuo mondo (Email list).",
                feedback: "Non costruire casa su terreno in affitto (Spotify). Porta i dati a casa tua.",
                output: "Unlock: 'Revenue Funnel'."
            },
            script: "Il podcast non è il business. Il podcast è il megafono del business. Usalo per amplificare la tua offerta principale."
        }
    ]
};
