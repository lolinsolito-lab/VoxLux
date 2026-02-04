import { WorldContent } from "../../services/courses/types";

export const podcastWorld8Immersive: WorldContent = {
    id: "world-8",
    title: "L'Ascension",
    subtitle: "L'Arte della Monetizzazione",
    description: "Non sei un volontario. Sei un professionista. Trasforma l'attenzione in valore economico.",
    narrative: {
        intro: "Vendere non è sporco. Vendere è l'unico modo per continuare a servire.",
        outro: "Il valore è scambiato. Il cerchio si chiude."
    },
    dualModules: {
        sunContent: {
            title: "Modelli di Revenue",
            microLesson: "Sponsor vs Prodotti.",
            technicalContent: "L'economia del creatore: CPM vs Value-Based Pricing.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "La Trappola del CPM",
                    type: "theory",
                    content: `
                        <p>Il modello pubblicitario classico (CPM: Costo per Mille ascolti) paga circa 20€ ogni 1000 ascolti. Per fare 2000€ al mese ti servono 100.000 ascolti. È un gioco a somma negativa per chi inizia.</p>
                    `
                },
                {
                    title: "La Piramide del Valore",
                    type: "framework",
                    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2671&auto=format&fit=crop",
                    content: `
                        <p>Invece di vendere gli ascoltatori agli sponsor (basso valore), vendi i tuoi prodotti agli ascoltatori (alto valore).</p>
                        <ul>
                            <li><strong>Consulenza/Coaching:</strong> Alto prezzo, bassa scalabilità. Ottimo per iniziare con pochi ascolti.</li>
                            <li><strong>Corsi/Prodotti Digitali:</strong> Medio prezzo, alta scalabilità.</li>
                            <li><strong>Community A Pagamento:</strong> Basso prezzo, rendita ricorrente (MRR).</li>
                        </ul>
                    `
                },
                {
                    title: "Case Study: The Agora",
                    type: "case-study",
                    content: `
                        <p>Podcast di nicchia (es. "Diritto Tributario") con 500 ascoltatori possono generare 50.000€ l'anno vendendo consulenze high-ticket. Non serve la massa.</p>
                    `
                }
            ],
            downloads: [
                { label: "Revenue Calculator.xlsx", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "Ethical Selling",
            guidingQuestion: "Ti vergogni di vendere?",
            psychologicalContent: "Sbloccare il denaro come energia.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Vendere è Servire",
                    type: "theory",
                    content: `
                        <p>Se hai la cura per il cancro e non la vendi (o la distribuisci) col massimo sforzo possibile, sei egoista. Se il tuo prodotto risolve un dolore reale, è tuo dovere morale venderlo.</p>
                        <p>La timidezza nella vendita non è umiltà. È mancanza di fede nel proprio prodotto.</p>
                    `
                },
                {
                    title: "Il Bridge Naturale",
                    type: "framework",
                    content: `
                        <p>Non fare interruzioni pubblicitarie ("E ora un messaggio..."). Fai ponti narrativi.</p>
                        <p><em>"Abbiamo appena parlato di quanto è difficile X. È esattamente per questo che ho creato Y..."</em></p>
                        <p>La soluzione deve essere la naturale conseguenza del problema discusso nell'episodio.</p>
                    `
                },
                {
                    title: "Workshop: L'Offerta Irresistibile",
                    type: "workshop",
                    content: `
                        <p><strong>Esercizio:</strong> Scrivi la tua offerta usando la formula: "Aiuto [Avatar] a ottenere [Risultato] in [Tempo] senza [Dolore/Sforzo inutile]".</p>
                    `
                }
            ],
            downloads: []
        },
        goldenThread: {
            title: "Il Media Kit",
            synthesisExercise: "Crea il tuo pass.",
            output: "Media Kit PDF.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Presentarsi ai Brand",
                    type: "theory",
                    content: `
                        <p>Anche se vendi prodotti tuoi, un Media Kit professionale ti dà autorità. È il CV del tuo show.</p>
                    `
                },
                {
                    title: "Anatomia di un Media Kit",
                    type: "framework",
                    content: `
                        <ol>
                            <li><strong>About:</strong> Chi sei e la missione.</li>
                            <li><strong>Audience:</strong> Demografica e Psicografica (dati reali o stimati).</li>
                            <li><strong>Numeri:</strong> Download (o proiezioni di crescita).</li>
                            <li><strong>Partnership Opportunities:</strong> Cosa offri (Mid-roll, Social, Newsletter).</li>
                        </ol>
                    `
                }
            ],
            downloads: [
                { label: "Media Kit Template.ppt", url: "#", type: "pdf" }
            ]
        }
    }
};
