import { WorldContent } from "../../services/courses/types";

export const podcastWorld6Immersive: WorldContent = {
    id: "world-6",
    title: "Le Tattiche",
    subtitle: "L'Arsenale della Crescita",
    description: "Hai la qualità. Ora ti serve il volume. Trasforma il tuo show da segreto nascoso a fenomeno di massa.",
    narrative: {
        intro: "Senza distribuzione, l'arte muore al buio.",
        outro: "Il segnale si sta amplificando. Ti sentono ovunque."
    },
    dualModules: {
        sunContent: {
            title: "Launch Strategy",
            microLesson: "Il Giorno 1 è tutto.",
            technicalContent: "Come hackerare l'algoritmo di Apple e Spotify per entrare in classifica.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "L'Algoritmo delle Classifiche",
                    type: "theory",
                    content: `
                        <p>Apple Podcasts non guarda i download totali. Guarda la <strong>velocità</strong> dei nuovi iscritti (Followers) nelle ultime 24-48 ore. Ecco perché il lancio è cruciale.</p>
                        <p>Meglio 100 iscritti in un'ora che 1000 in un mese.</p>
                    `
                },
                {
                    title: "La Strategia dei 3 Episodi",
                    type: "framework",
                    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
                    content: `
                        <p>Non lanciare mai con un solo episodio (il "Trailer"). Lancia con <strong>3 episodi full</strong> (es. 00, 01, 02) disponibili subito.</p>
                        <p>Perché? Se a un ascoltatore piaci, vuole fare bingewatching (o bingelistening). Ascoltando 3 episodi di fila, triplica i tuoi download per utente e segnala all'algoritmo che il tuo contenuto crea dipendenza (Retention).</p>
                    `
                },
                {
                    title: "Case Study: Wondery",
                    type: "case-study",
                    content: `
                        <p>Wondery (Dr. Death, Business Wars) lancia sempre intere stagioni o grossi blocchi. Questo permette loro di dominare le classifiche "Trending" per settimane.</p>
                    `
                }
            ],
            downloads: [
                { label: "Launch Checklist.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "Data Literacy",
            guidingQuestion: "Cosa dicono i numeri?",
            psychologicalContent: "Non contare i download. Conta le persone.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "La Vanity Metric (Downloads)",
                    type: "theory",
                    content: `
                        <p>Tutti ostentano i download. Ma i download si possono comprare (o gonfiare con i bot). Un download non significa ascolto.</p>
                        <p>La metrica reale è il <strong>Consumption Rate</strong> (Tasso di Completamento). Quanta gente arriva alla fine dell'episodio?</p>
                    `
                },
                {
                    title: "Analisi della Ritenzione",
                    type: "framework",
                    content: `
                        <p>Vai su Spotify for Podcasters o Apple Connect:</p>
                        <ul>
                            <li><strong>Drop-off immediato (0-60s):</strong> La tua intro è noiosa o troppo lunga. Tagliala.</li>
                            <li><strong>Drop-off graduale:</strong> Il contenuto non mantiene la promessa del titolo.</li>
                            <li><strong>Drop-off improvviso a metà:</strong> Hai inserito una call to action o una pubblicità troppo aggressiva, o sei andato fuori tema.</li>
                        </ul>
                    `
                },
                {
                    title: "Workshop: L'Autopsia",
                    type: "workshop",
                    content: `
                        <p><strong>Esercizio:</strong> Prendi il tuo episodio peggiore (statistiche alla mano). Riascoltalo e trova il punto esatto dove la gente ha staccato. Chiediti brutalmente: "Perché mi sarei annoiato qui?".</p>
                    `
                }
            ],
            downloads: []
        },
        goldenThread: {
            title: "Il Funnel di Crescita",
            synthesisExercise: "Disegna il flusso.",
            output: "Schema del Funnel.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Da Ascoltatore a Lead",
                    type: "theory",
                    content: `
                        <p>Un podcast non ha l'algoritmo di scoperta di TikTok o YouTube. E' difficile farsi trovare. Ma una volta trovati, la fiducia è altissima.</p>
                        <p>Devi usare i social (Top of Funnel) per portare traffico al Podcast (Middle of Funnel), e dal Podcast portare traffico alla tua Email List o Offerta (Bottom of Funnel).</p>
                    `
                },
                {
                    title: "Il Lead Magnet Audio",
                    type: "framework",
                    content: `
                        <p>Invece di dire "Iscriviti alla newsletter", offri un "Episodio Bonus Segreto" o un "PDF Riassuntivo" in cambio dell'email.</p>
                        <p>Menziona questo lead magnet a metà episodio (Mid-Roll) e alla fine (Outro).</p>
                    `
                }
            ],
            downloads: [
                { label: "Funnel Map.png", url: "#", type: "pdf" }
            ]
        }
    }
};
