import { WorldContent } from "../../services/courses/types";

export const podcastWorld5Immersive: WorldContent = {
    id: "world-5",
    title: "Gli Archetipi",
    subtitle: "L'Identità Risonante",
    description: "La voce non è solo suono, è personalità. Scopri chi sei veramente quando il microfono si accende.",
    narrative: {
        intro: "Non si ascoltano informazioni. Si ascoltano personalità.",
        outro: "Hai trovato la tua voce. Ora usala per comandare."
    },
    dualModules: {
        sunContent: {
            title: "Sonic Branding",
            microLesson: "Firma il tuo suono.",
            technicalContent: "Come creare un'identità sonora che sia riconoscibile in 3 secondi netti.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "L'Audio Logo",
                    type: "theory",
                    content: `
                        <p>Pensa al "Tu-dum" di Netflix o al jingle di Intel. Quello è branding sonoro. Il tuo podcast deve avere un suono distintivo che Pavlovianamente prepara il cervello dell'ascoltatore.</p>
                    `
                },
                {
                    title: "La Texture Vocale",
                    type: "framework",
                    image: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2676&auto=format&fit=crop",
                    content: `
                        <p>La tua voce ha parametri che puoi equalizzare:</p>
                        <ul>
                            <li><strong>Tono (Pitch):</strong> Basso = Autorità. Alto = Energia.</li>
                            <li><strong>Ritmo (Pace):</strong> Veloce = Urgenza. Lento = Importanza/Dramma.</li>
                            <li><strong>Volume (Dynamic):</strong> Sussurrato = Intimità. Proiettato = Leadership.</li>
                        </ul>
                        <p>Modula questi parametri consciamente, non parlare a caso.</p>
                    `
                },
                {
                    title: "Case Study: The Daily",
                    type: "case-study",
                    content: `
                        <p>Michael Barbaro (" The Daily" del NYT) ha creato uno stile iconico con le sue pause ("Hmm...") e il suo modo di dire "Here's what else... you need... to know... today". È diventato così distintivo da essere parodiato al SNL. Questo è branding.</p>
                    `
                }
            ],
            downloads: [
                { label: "Pack Suoni FX.zip", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "L'Ombra (Imposter Syndrome)",
            guidingQuestion: "Chi ti credi di essere?",
            psychologicalContent: "Affrontare la voce interiore che ti dice che sei una truffa.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "La Sindrome dell'Impostore",
                    type: "theory",
                    content: `
                        <p>Il 70% degli host soffre della Sindrome dell'Impostore. "Chi sono io per insegnare?".</p>
                        <p>La verità: Non devi essere il guru sulla montagna. Devi solo essere <strong>un capitolo avanti</strong> rispetto a chi ti ascolta. O essere il "Reporter Curioso" che impara insieme a loro.</p>
                    `
                },
                {
                    title: "Le 3 Maschere",
                    type: "framework",
                    content: `
                        <p>Scegli il tuo archetipo conduttore:</p>
                        <ul>
                            <li><strong>Il Saggio (The Sage):</strong> Sa le risposte. Insegna dall'alto. (Es. Huberman)</li>
                            <li><strong>L'Esploratore (The Explorer):</strong> Cerca le risposte. Intervista per imparare. (Es. Joe Rogan)</li>
                            <li><strong>L'Eroe Riluttante:</strong> Condivide il viaggio e le ferite. (Es. Diary of a CEO)</li>
                        </ul>
                    `
                },
                {
                    title: "Workshop: Shadow Work",
                    type: "workshop",
                    content: `
                        <p><strong>Esercizio:</strong> Scrivi le 3 critiche peggiori che hai paura di ricevere nei commenti. Poi scrivi la risposta che daresti se fossi totalmente sicuro di te.</p>
                        <p>Disinnesca la paura guardandola in faccia.</p>
                    `
                }
            ],
            downloads: []
        },
        goldenThread: {
            title: "La Definizione dell'Host",
            synthesisExercise: "Chi conduce questo show?",
            output: "Definisci il tuo Archetipo.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Il Patto con l'Ascoltatore",
                    type: "theory",
                    content: `
                        <p>L'ascoltatore deve sapere cosa aspettarsi da te. Se un giorno sei serio e il giorno dopo fai il clown, perdi fiducia. La coerenza (Consistency) batte l'intensità.</p>
                    `
                },
                {
                    title: "Bio Strategica",
                    type: "framework",
                    content: `
                        <p>Scrivi la tua Bio in 2 frasi:</p>
                        <p>1. Autorità (Perché dovrebbero ascoltarti).</p>
                        <p>2. Umanità (Perché dovrebbero fidarsi di te).</p>
                        <p><em>Esempio: "Ho scalato 3 aziende a 7 cifre (Autorità). Ma ho perso i capelli e la salute nel processo, e sono qui per evitare che succeda a voi (Umanità)."</em></p>
                    `
                }
            ],
            downloads: []
        }
    }
};
