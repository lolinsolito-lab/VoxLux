import { WorldContent } from "../../services/courses/types";

export const podcastWorld4Immersive: WorldContent = {
    id: "world-4",
    title: "La Frequenza",
    subtitle: "Il Ritmo del Dominio",
    description: "Il talento è sopravvalutato. La costanza è l'unica superpotenza reale. Impara a piegare il tempo al tuo volere.",
    narrative: {
        intro: "Non sei un artista che crea quando ha l'ispirazione. Sei un professionista che consegna.",
        outro: "Il ritmo è stabilito. Il tuo show è ora una macchina inarrestabile."
    },
    dualModules: {
        sunContent: {
            title: "Il Sistema Operativo",
            microLesson: "Lavora una volta, pubblica per mesi.",
            technicalContent: "Come produrre 3 mesi di contenuti in 2 giorni. Il segreto del Batching.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "La Legge del Batching",
                    type: "theory",
                    content: `
                        <p>Il cervello umano odia cambiare contesto (Context Switching). Se registri un episodio a settimana, perdi il 40% del tuo tempo solo per 'entrare nel mood' e settare l'attrezzatura.</p>
                        <p>Il Batching è l'arte di raggruppare compiti simili. Non si scrive un'email alla volta, si scrivono a blocchi. Non si registra un episodio alla volta, se ne registrano 4.</p>
                    `
                },
                {
                    title: "Protocollo 4-Giorni",
                    type: "framework",
                    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop",
                    content: `
                        <p>Ecco come gestire un podcast settimanale lavorando solo 4 giorni al <strong>mese</strong>:</p>
                        <ul>
                            <li><strong>Giorno 1 (Pianificazione):</strong> Scripting di 4 episodi.</li>
                            <li><strong>Giorno 2 (Registrazione):</strong> 4 ore intensive di recording.</li>
                            <li><strong>Giorno 3 (Post-Produzione):</strong> Editing o delega.</li>
                            <li><strong>Giorno 4 (Scheduling):</strong> Caricamento e programmazione social.</li>
                        </ul>
                    `
                },
                {
                    title: "Case Study: Tim Ferriss",
                    type: "case-study",
                    content: `
                        <p>Tim Ferriss registra le sue interviste a blocchi di 2-3 giorni consecutivi quando è in una città specifica (es. NY o LA), creando un archivio di 10-15 episodi che gli copre 3-4 mesi di pubblicazione. Questo gli permette di scomparire o viaggiare senza interrompere lo show.</p>
                    `
                }
            ],
            downloads: [
                { label: "Checklist Batching.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "La Resistenza (Podfading)",
            guidingQuestion: "Perché ti fermerai?",
            psychologicalContent: "Il 'Podfading' uccide il 70% dei podcast entro l'episodio 7. Ecco come vaccinarti.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Anatomia del Podfading",
                    type: "theory",
                    content: `
                        <p>Il Podfading non succede perché "non hai tempo". Succede perché perdi la battaglia contro la Resistenza (Steven Pressfield).</p>
                        <p>Accade solitamente tra l'episodio 7 e il 10, quando l'eccitazione della novità svanisce e i risultati "virali" non arrivano.</p>
                    `
                },
                {
                    title: "La Regola dei 100 Episodi",
                    type: "framework",
                    content: `
                        <p>Fai un patto con te stesso: <strong>Nessuna valutazione dei risultati prima dell'episodio 100.</strong></p>
                        <p>Se guardi le statistiche all'episodio 5 e vedi 12 ascolti, il tuo ego ti farà smettere. Se ti impegni al processo, vincerai.</p>
                    `
                },
                {
                    title: "Workshop: Kill The Perfectionism",
                    type: "workshop",
                    content: `
                        <p><strong>Esercizio:</strong> Pubblica un audio "imperfetto" di 2 minuti oggi stesso. Registralo col telefono, mentre cammini. Rompi la barriera della qualità ossessiva.</p>
                        <p>La perfezione è solo procrastinazione mascherata da qualità.</p>
                    `
                }
            ],
            downloads: []
        },
        goldenThread: {
            title: "Il Calendario Editoriale",
            synthesisExercise: "Pianifica i prossimi 6 mesi.",
            output: "Carica il Piano Editoriale.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Architettura della Stagione",
                    type: "theory",
                    content: `
                        <p>Non pensare "episodio dopo episodio". Pensa a Stagioni o Serie Tematiche.</p>
                        <p>Una stagione di 10 episodi su un tema specifico (es. "Le Basi della Vendita") è un asset vendibile. 10 episodi a caso sono rumore.</p>
                    `
                },
                {
                    title: "Matrice dei Contenuti",
                    type: "framework",
                    content: `
                        <p>Alterna i formati per mantenere l'interesse:</p>
                        <ol>
                            <li><strong>Solo (Deep Dive):</strong> Tu che spieghi un concetto (Autorità).</li>
                            <li><strong>Intervista (Guest):</strong> Tu che ospiti un esperto (Network).</li>
                            <li><strong>Q&A (Community):</strong> Tu che rispondi (Relazione).</li>
                            <li><strong>Case Study (Tattico):</strong> Analisi pratica (Utilità).</li>
                        </ol>
                    `
                }
            ],
            downloads: [
                { label: "Template Calendario 12-Mesi.xlsx", url: "#", type: "pdf" }
            ]
        }
    }
};
