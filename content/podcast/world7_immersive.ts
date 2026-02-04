import { WorldContent } from "../../services/courses/types";

export const podcastWorld7Immersive: WorldContent = {
    id: "world-7",
    title: "L'Empatia",
    subtitle: "La Costruzione della Tribù",
    description: "I numeri sono vanità. La community è sanità. Impara a trasformare ascoltatori passivi in discepoli attivi.",
    narrative: {
        intro: "Non stai costruendo un pubblico. Stai costruendo una religione laica.",
        outro: "Loro si fidano di te. Non tradirli mai."
    },
    dualModules: {
        sunContent: {
            title: "Community Management",
            microLesson: "1000 True Fans.",
            technicalContent: "La teoria di Kevin Kelly applicata all'audio.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "La Teoria dei 1000 True Fans",
                    type: "theory",
                    content: `
                        <p>Non ti servono milioni di follower. Ti servono 1000 persone disposte a comprare qualsiasi cosa fai. Se hai 1000 fan che ti pagano 100€ l'anno, hai un business da 100.000€.</p>
                        <p>Il Podcast è lo strumento migliore al mondo per convertire <em>Interessati</em> in <em>True Fans</em>.</p>
                    `
                },
                {
                    title: "Il Rituale di Risposta",
                    type: "framework",
                    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2669&auto=format&fit=crop",
                    content: `
                        <p>All'inizio, rispondi a TUTTI. Non mettere "cuoricini". Manda note vocali.</p>
                        <p>Quando un ascoltatore ti scrive su Instagram e riceve una tua nota vocale di 30 secondi dove lo chiami per nome, diventa un True Fan a vita. È un investimento di tempo con un ROI infinito.</p>
                    `
                },
                {
                    title: "Case Study: Pat Flynn",
                    type: "case-study",
                    content: `
                        <p>Pat Flynn (Smart Passive Income) ha costruito un impero chiamando personalmente i primi iscritti alla sua email list per chiedere "Cosa ti blocca?". Quella conoscenza intima del problema lo ha reso invincibile.</p>
                    `
                }
            ],
            downloads: [
                { label: "Community Canvas.pdf", url: "#", type: "pdf" }
            ]
        },
        moonContent: {
            title: "Ascolto Attivo",
            guidingQuestion: "Stai ascoltando o stai aspettando di parlare?",
            psychologicalContent: "L'arte dell'intervista trasformativa.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "L'Intervistatore vs Il Curioso",
                    type: "theory",
                    content: `
                        <p>Le interviste noiose sono scalette di domande ("Raccontami di te", "Qual è la tua routine").</p>
                        <p>Le interviste memorabili sono conversazioni dove l'host ascolta davvero la risposta e devia dalla scaletta per scavare più a fondo ("Hai detto che avevi paura... spiegami meglio quel momento esatto").</p>
                    `
                },
                {
                    title: "La Tecnica del Silenzio",
                    type: "framework",
                    content: `
                        <p>Quando l'ospite finisce di parlare... aspetta 3 secondi prima di rispondere. Nel disagio del silenzio, l'ospite spesso aggiungerà la verità più profonda che stava trattenendo.</p>
                    `
                },
                {
                    title: "Workshop: Mirroring",
                    type: "workshop",
                    content: `
                        <p><strong>Esercizio:</strong> Nella prossima conversazione (anche col partner), ripeti le ultime 3 parole che hanno detto con tono interrogativo. (Es. "Sono stanco." -> "Sei stanco?"). Li costringerà ad elaborare e sentirsi capiti.</p>
                    `
                }
            ],
            downloads: []
        },
        goldenThread: {
            title: "Il Superfan Ritual",
            synthesisExercise: "Crea il tuo rito.",
            output: "Definisci il Rituale.",
            videoUrl: "https://player.vimeo.com/video/524933864",
            segments: [
                {
                    title: "Gamification della Community",
                    type: "theory",
                    content: `
                        <p>Dai un nome ai tuoi ascoltatori (es. "Beliebers", "Vulfpack"). Crea un simbolo, un hashtag, o un rituale segreto che solo chi ascolta conosce.</p>
                    `
                },
                {
                    title: "Inside Jokes",
                    type: "framework",
                    content: `
                        <p>Usa recurring jokes o riferimenti a vecchi episodi. Crea un senso di "noi contro loro" (chi non ascolta). L'esclusività genera lealtà.</p>
                    `
                }
            ],
            downloads: []
        }
    }
};
