import { WorldContent } from "../../services/courses/types";

export const podcastWorld1Immersive: WorldContent = {
    id: "world-1",
    title: "L'Eco Primordiale",
    subtitle: "L'Architettura Invisibile",
    description: "Prima ancora di parlare, devi costruire il vuoto in cui la tua voce risuonerà. Il podcast non avviene nel microfono, avviene nella mente di chi ascolta.",
    narrative: {
        intro: "L'Eco Primordiale. Prima del suono, c'è lo spazio...",
        outro: "Hai costruito il tempio. Ora sei pronto a riempirlo."
    },
    dualModules: {
        sunContent: {
            title: "Architettura Invisibile",
            microLesson: "Lo spazio acustico definisce l'autorità.",
            technicalContent: "Prima di registrare, devi progettare lo spazio acustico. Non stai parlando a un microfono, stai parlando all'orecchio interno del tuo ascoltatore.",
            longText: `
                <h3>Il Tempio Sonoro</h3>
                <p>La maggior parte dei podcaster fallisce perché tratta il podcast come un blog letto ad alta voce. Ignorano la fisica del suono, che è la fisica dell'intimità.</p>
                
                <p>Quando parli in cuffia, sei letteralmente dentro la testa del tuo ascoltatore. Non c'è distanza fisica. Questo richiede un'attenzione maniacale all'"Architettura Invisibile" della tua registrazione.</p>
                
                <h4>Checklist per lo Spazio Acustico:</h4>
                <ul>
                    <li><strong>Il Silenzio Attivo:</strong> Non cercare il silenzio morto. Cerca un silenzio "fermo". Spegni frigoriferi, chiudi finestre, ma lascia che la stanza "respiri".</li>
                    <li><strong>Materiali Assorbenti:</strong> Il vetro e il cemento sono i tuoi nemici. Uccidono il calore della voce. Circondati di legno, tessuto, libri. La voce ama la complessità materica.</li>
                    <li><strong>La Distanza Aurea:</strong> Mantieni la bocca a 10-15cm dal diaframma del microfono (la regola del pugno). Troppo vicino e avrai l'effetto prossimità (troppi bassi), troppo lontano e perderai l'intimità.</li>
                </ul>

                <p>Ricorda: l'ascoltatore non perdona un audio che lo affatica. Se l'audio è "sporco", il cervello dell'ascoltatore deve lavorare il doppio per decodificare le parole. Si stancherà e chiuderà l'episodio.</p>
            `,
            videoUrl: "https://player.vimeo.com/video/524933864?h=12345678", // Placeholder valid video
            featuredImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop",
            downloads: [
                { label: "Checklist Spazio Acustico.pdf", url: "#", type: "pdf" },
                { label: "Guida al Trattamento Sonoro.pdf", url: "#", type: "pdf" },
                { label: "Microfono Setup Guide.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "La Stanza della Risonanza",
            guidingQuestion: "Chi stai invitando nel tuo spazio sacro?",
            psychologicalContent: "Il microfono non amplifica solo la voce, amplifica l'intenzione. Se sei incerto, suonerai fragile. Se sei arrogante, suonerai distante.",
            longText: `
                <h3>L'Orecchio Interno</h3>
                <p>Parliamo spesso di "Tone of Voice", ma raramente di "Tone of Mind". Prima di premere REC, devi entrare in uno stato di risonanza emotiva con il tuo Avatar.</p>
                
                <p>Non stai parlando a una folla ("Ciao a tutti!"). Stai parlando a UNA persona sola. Immagina il tuo ascoltatore ideale seduto di fronte a te, in una stanza silenziosa, con una tazza di caffè in mano. Parla a LUI.</p>
                
                <h4>Il Rituale di Ingresso:</h4>
                <p>Prima di iniziare, fai tre respiri profondi. Visualizza l'energia che scende dalla testa al petto. La voce "di testa" è nervosa e intellettuale. La voce "di petto" è calda, autorevole e rassicurante.</p>
            `,
            videoUrl: "https://player.vimeo.com/video/524933864",
            downloads: [
                { label: "Meditazione Pre-Recording.mp3", url: "#", type: "link" }
            ]
        },
        goldenThread: {
            title: "Output: Il Primo Pilastro",
            synthesisExercise: "Registra 60 secondi di test. Non parlare di un argomento. Leggi una lista della spesa. L'obiettivo non è il contenuto, è il contenitore.",
            output: "Carica il file audio del test ambientale.",
            longText: `
                <h3>Esercizio Pratico</h3>
                <p>Non mi interessa cosa dici. Mi interessa COME suona il silenzio attorno a te.</p>
                <ol>
                    <li>Prepara il tuo spazio secondo la checklist solare.</li>
                    <li>Siediti. Chiudi gli occhi. Entra nello stato lunare.</li>
                    <li>Premi REC.</li>
                    <li>Resta in silenzio per 10 secondi (voglio sentire il "Rumore di Fondo" o Noise Floor).</li>
                    <li>Leggi un testo qualsiasi per 30 secondi.</li>
                    <li>Riascolta. Senti il riverbero? Senti eco? La tua voce è calda o metallica?</li>
                </ol>
            `,
            videoUrl: "https://player.vimeo.com/video/524933864",
            downloads: [
                { label: "Template Analisi Audio.pdf", url: "#", type: "pdf" },
                { label: "Esempio Audio Pulito.wav", url: "#", type: "link" }
            ]
        }
    }
};
