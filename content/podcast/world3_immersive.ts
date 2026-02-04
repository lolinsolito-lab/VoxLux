import { WorldContent } from "../../services/courses/types";

export const podcastWorld3Immersive: WorldContent = {
    id: "world-3",
    title: "La Visione",
    subtitle: "L'Orizzonte degli Eventi",
    description: "Senza una meta, ogni passo è un errore. Definisci dove vuoi portare il tuo ascoltatore.",
    narrative: {
        intro: "La Visione non è ciò che vedi. È ciò che fai vedere agli altri.",
        outro: "La rotta è tracciata. Ora sai esattamente dove stiamo andando."
    },
    dualModules: {
        sunContent: {
            title: "Strategia Oceano Blu",
            microLesson: "Non competere. Crea.",
            technicalContent: "La concorrenza è per i perdenti. In questa lezione imparerai ad applicare la 'Blue Ocean Strategy' al tuo show.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "La Trappola dell'Oceano Rosso",
                    type: "theory",
                    content: `
                        <p>Oggi ci sono oltre 4 milioni di podcast nel mondo. Il 90% di questi compete sugli stessi argomenti, con gli stessi formati, per lo stesso pubblico. Questo è un "Oceano Rosso", un mare sporco di sangue dove gli squali competono per le stesse poche prede.</p>
                        <p>Se lanci un podcast di "Marketing" o "Crescita Personale" oggi, stai entrando in una stanza affollatissima urlando per farti sentire. È una strategia perdente in partenza.</p>
                    `
                },
                {
                    title: "Il Framework delle 4 Azioni",
                    type: "framework",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
                    content: `
                        <p>Per trovare il tuo Oceano Blu, devi rispondere a queste 4 domande:</p>
                        <ul>
                            <li><strong>ELIMINARE:</strong> Quali fattori che l'industria dà per scontati puoi eliminare del tutto? (Es. La sigla lunga, le presentazioni formali).</li>
                            <li><strong>RIDURRE:</strong> Quali fattori puoi ridurre ben al di sotto dello standard? (Es. La durata: invece di 60 minuti, 8 minuti densissimi).</li>
                            <li><strong>AUMENTARE:</strong> Quali fattori puoi alzare ben al di sopra dello standard? (Es. La qualità del sound design, la narrazione emotiva).</li>
                            <li><strong>CREARE:</strong> Quali fattori mai offerti dall'industria puoi creare? (Es. Un'esperienza immersiva, esercizi pratici in tempo reale).</li>
                        </ul>
                    `
                },
                {
                    title: "Case Study: Hardcore History vs NPR",
                    type: "case-study",
                    content: `
                        <p>Mentre tutti facevano interviste di 45 minuti (Standard Industry), Dan Carlin ha applicato la strategia Oceano Blu:</p>
                        <ul>
                            <li><strong>Ha Eliminato</strong> le interviste.</li>
                            <li><strong>Ha Aumentato</strong> la durata (episodi di 4-6 ore).</li>
                            <li><strong>Ha Creato</strong> un audiolibro narrativo a episodi.</li>
                        </ul>
                        <p>Risultato: È il podcast di storia più famoso al mondo, senza concorrenza diretta.</p>
                    `
                }
            ],
            downloads: [
                { label: "Matrice Oceano Blu.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "Il 'Why' Profondo",
            guidingQuestion: "Chi stai salvando davvero?",
            psychologicalContent: "Non parliamo di demografica. Parliamo di psicografica.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Oltre la Demografica",
                    type: "theory",
                    content: `
                        <p>"Maschio, 25-45 anni, interessato al business". Questa non è una nicchia. Questo è un elenco telefonico. Se provi a parlare a tutti, non parlerai a nessuno.</p>
                        <p>Devi definire il tuo ascoltatore non per chi è fuori, ma per come si sente dentro.</p>
                    `
                },
                {
                    title: "L'Avatar Emotivo",
                    type: "framework",
                    content: `
                        <p>Chiediti:</p>
                        <ul>
                            <li>Cosa lo tiene sveglio alle 2 di notte?</li>
                            <li>Di cosa ha paura ma non lo ammette nemmeno a sua moglie/marito?</li>
                            <li>Qual è la bugia che si racconta ogni giorno?</li>
                        </ul>
                        <p>Più vai a fondo nel dolore (Pain Point), più forte sarà la connessione.</p>
                    `
                },
                {
                    title: "Workshop: Il Diario",
                    type: "workshop",
                    content: `
                        <p><strong>Esercizio:</strong> Scrivi una pagina di diario <em>come se fossi il tuo ascoltatore ideale</em>, nel suo giorno peggiore. Usa le sue parole, le sue paure, il suo slang.</p>
                        <p>Questo è il materiale grezzo su cui costruirai la tua comunicazione.</p>
                    `
                }
            ],
            downloads: []
        },
        goldenThread: {
            title: "Output: Il Manifesto",
            synthesisExercise: "Scrivi il Manifesto del tuo Show.",
            output: "Carica il PDF del Manifesto.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Cos'è un Manifesto?",
                    type: "theory",
                    content: `
                        <p>Un Manifesto non è una bio. È una dichiarazione di guerra allo status quo. È il documento che definisce CHI SIAMO, in cosa crediamo e contro cosa combattiamo.</p>
                    `
                },
                {
                    title: "Template del Manifesto",
                    type: "framework",
                    content: `
                        <ol>
                            <li><strong>Lo Status Quo (Il Nemico):</strong> Cosa c'è che non va nel mondo o nella tua industria oggi?</li>
                            <li><strong>La Credenza (Il Valore):</strong> In cosa crediamo noi che è diverso dalla massa?</li>
                            <li><strong>La Promessa (La Soluzione):</strong> Cosa faremo di diverso?</li>
                            <li><strong>La Chiamata (L'Azione):</strong> Chi è invitato a unirsi a noi?</li>
                        </ol>
                    `
                }
            ],
            downloads: []
        }
    }
};
