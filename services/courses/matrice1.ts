import { Course } from './types';

// MATRICE I: Storytelling Strategy Master - Complete Premium Edition
export const matrice1: Course = {
    id: 'matrice-1',
    title: 'MATRICE I: Storytelling Strategy Master',
    description: 'Il percorso definitivo sulla Neuro-Narrativa e la Voce Strategica. 10 Masterminds, 30 moduli intensivi per dominare l\'arte dell\'influenza attraverso il racconto.',

    masterminds: [
        // MASTERMIND 1 - Livello I: ORIGINE
        {
            id: 'm1-1',
            title: 'Mastermind 1: ORIGINE',
            subtitle: 'Dove la storia respira per la prima volta',
            modules: [
                {
                    id: 'm1-1-1',
                    title: 'Il Chiamare la Storia',
                    description: 'Capisci cosa “ti chiama” a raccontare, definisci il perché del tuo podcast/narrazione e ritrovi la tua radice emotiva. Mini-rituale: Scrivi la prima frase che “ti trova”.',
                    output: 'Prima Frase Rituale',
                    type: 'video',
                    duration: '18:00'
                },
                {
                    id: 'm1-1-2',
                    title: 'L’Ombra del Messaggio',
                    description: 'Cosa la tua storia vuole trasformare, cosa succede davvero nell’ascoltatore e cosa resta quando la storia finisce. Mini-rituale: Identifica l’emozione madre del tuo progetto.',
                    output: 'Emozione Madre',
                    type: 'audio',
                    duration: '12:30'
                },
                {
                    id: 'm1-1-3',
                    title: 'Il Sigillo dell’Intenzione',
                    description: 'Stabilisci la tua direzione narrativa, dai energia al mondo che creerai e firmi il tuo “patto narrativo”. Mini-rituale: Registra 20 secondi della tua intenzione vocale.',
                    output: 'Registrazione Intenzione (20s)',
                    type: 'video',
                    duration: '22:15'
                }
            ]
        },

        // MASTERMIND 2 - Livello II: PRESENZA
        {
            id: 'm1-2',
            title: 'Mastermind 2: PRESENZA',
            subtitle: "La tua voce è il primo mondo che costruisci",
            modules: [
                {
                    id: 'm1-2-1',
                    title: 'La Spina Dorsale della Voce',
                    description: 'Grounding bio-meccanico. Abbassare il baricentro per alzare l\'impatto. Rituale: Il Pilastro Sonoro.',
                    output: 'Asset: Stabilità Paraverbale',
                    type: 'video',
                    duration: '20:00'
                },
                {
                    id: 'm1-2-2',
                    title: 'Il Punto di Sguardo (Gli Archetipi)',
                    description: 'Indossare la maschera vocale corretta. Guerriero, Oracolo, Amante. Rituale: La Sala delle Maschere.',
                    output: 'Avatar Vocale Dominante',
                    type: 'video',
                    duration: '18:45'
                },
                {
                    id: 'm1-2-3',
                    title: 'La Firma Energetica',
                    description: 'Sintetizzare Calore, Potenza e Velocità per creare il tuo Logo Sonoro unico. Rituale: Il Sintetizzatore d\'Anima.',
                    output: 'Logo Sonoro Personale',
                    type: 'video',
                    duration: '22:15'
                }
            ]
        },

        // MASTERMIND 3 - Livello III: VISIONE
        {
            id: 'm1-3',
            title: 'Mastermind 3: VISIONE',
            subtitle: 'I narratori vedono mondi prima che esistano.',
            modules: [
                {
                    id: 'm1-3-1',
                    title: 'Il Teatro Interno',
                    description: 'Show, Don\'t Tell. Tradurre concetti astratti in immagini sensoriali. Rituale: L\'Alchimista Visivo.',
                    output: 'Skill: Vista Cinematografica',
                    type: 'video',
                    duration: '25:00'
                },
                {
                    id: 'm1-3-2',
                    title: 'La Mappa Invisibile',
                    description: 'Worldbuilding & Contextual Framing. L\'ambiente come personaggio. Rituale: Il Genesi Point.',
                    output: 'Asset: Setting Canvas',
                    type: 'video',
                    duration: '19:30'
                },
                {
                    id: 'm1-3-3',
                    title: 'La Camera dell\'Immagine',
                    description: 'Mood, Tone & Sensory Priming. Definire la texture della narrazione. Rituale: Il Moodboard Vivente.',
                    output: 'Sigillo della Visione',
                    type: 'video',
                    duration: '22:00'
                }
            ]
        },

        // MASTERMIND 4 - Livello IV: FREQUENZA
        {
            id: 'm1-4',
            title: 'Mastermind 4: FREQUENZA',
            subtitle: 'La storia è un\'onda. Impara a cavalcarla.',
            modules: [
                {
                    id: 'm1-4-1',
                    title: 'Il Respiro del Racconto',
                    description: 'Potere della Pausa. Gestire il silenzio tattico. Rituale: Il Tagliatore di Tempo.',
                    output: 'Asset: Il Metronomo Interiore',
                    type: 'video',
                    duration: '21:00'
                },
                {
                    id: 'm1-4-2',
                    title: 'Il Tempo dell\'Ascoltatore',
                    description: 'Cognitive Load & Pacing. Dosare il flusso di informazioni. Rituale: Il Dosaggio Sacro.',
                    output: 'Tecnica: Pacing Adattivo',
                    type: 'video',
                    duration: '16:45'
                },
                {
                    id: 'm1-4-3',
                    title: 'Onde Emotive',
                    description: 'Variazione Prosodica. Evitare la flatline. Rituale: Il Direttore d\'Orchestra.',
                    output: 'Sigillo della Frequenza',
                    type: 'video',
                    duration: '18:30'
                }
            ]
        },

        // MASTERMIND 5 - Livello V: ARCHETIPI
        {
            id: 'm1-5',
            title: 'Mastermind 5: ARCHETIPI',
            subtitle: 'Indossa le maschere degli dei.',
            modules: [
                {
                    id: 'm1-5-1',
                    title: 'Il Custode (Chi è l\'Eroe?)',
                    description: 'Posizionamento della Guida. Tu non sei Luke, sei Yoda. Rituale: La Pulizia dello Specchio.',
                    output: 'Concetto: Posizionamento Guida',
                    type: 'video',
                    duration: '20:00'
                },
                {
                    id: 'm1-5-2',
                    title: 'L\'Eroe Ferito (Il Difetto Fatale)',
                    description: 'Vulnerabilità strategica. Kintsugi narrativo. Rituale: Il Kintsugi Digitale.',
                    output: 'Asset: Vulnerabilità Strategica',
                    type: 'video',
                    duration: '19:00'
                },
                {
                    id: 'm1-5-3',
                    title: 'L\'Antagonista Invisibile',
                    description: 'Definire il Nemico. Senza buio la luce non serve. Rituale: L\'Evocazione della Bestia.',
                    output: 'Sigillo degli Archetipi',
                    type: 'video',
                    duration: '22:00'
                }
            ]
        },

        // MASTERMIND 6 - Livello VI: NARRATIVA TATTICA
        {
            id: 'm1-6',
            title: 'Mastermind 6: NARRATIVA TATTICA',
            subtitle: 'La strategia è l\'arte della guerra senza sangue.',
            modules: [
                {
                    id: 'm1-6-1',
                    title: 'Il Gancio di Ingresso (The Hook)',
                    description: 'Pattern Interrupt. Catturare l\'attenzione in 3 secondi. Rituale: Lo Spezza-Flusso.',
                    output: 'Tecnica: Pattern Interrupt',
                    type: 'video',
                    duration: '18:00'
                },
                {
                    id: 'm1-6-2',
                    title: 'Il Percorso dell\'Attesa (Open Loops)',
                    description: 'Effetto Zeigarnik. Costruire ponti di curiosità. Rituale: L\'Architetto dei Ponti.',
                    output: 'Schema: Spirale di Tensione',
                    type: 'video',
                    duration: '21:00'
                },
                {
                    id: 'm1-6-3',
                    title: 'Il Punto di Rottura (Plot Twist)',
                    description: 'Sorpresa e cambio di prospettiva. Rituale: Il Sabotaggio.',
                    output: 'Sigillo della Tattica',
                    type: 'video',
                    duration: '20:00'
                }
            ]
        },

        // MASTERMIND 7 - Livello VII: EMPATIA STRATEGICA
        {
            id: 'm1-7',
            title: 'Mastermind 7: EMPATIA STRATEGICA',
            subtitle: 'Connettersi è vincere.',
            modules: [
                {
                    id: 'm1-7-1',
                    title: 'Ascoltare il Non Detto',
                    description: 'Sottotesto e Decodifica Emotiva. Rituale: Lo Spettro Emotivo.',
                    output: 'Skill: Decodifica Emotiva',
                    type: 'video',
                    duration: '20:00'
                },
                {
                    id: 'm1-7-2',
                    title: 'Il Calore della Voce',
                    description: 'Intimità e Prossimità Vocale. Rituale: Il Cerchio del Fuoco.',
                    output: 'Tecnica: Prossimità Vocale',
                    type: 'video',
                    duration: '18:00'
                },
                {
                    id: 'm1-7-3',
                    title: 'La Mano sulla Spalla',
                    description: 'Validazione ed Empatia Radicale. Rituale: Il Nodo d\'Oro.',
                    output: 'Sigillo dell\'Empatia',
                    type: 'video',
                    duration: '22:00'
                }
            ]
        },

        // MASTERMIND 8 - Livello VIII: ASCENSIONE
        {
            id: 'm1-8',
            title: 'Mastermind 8: ASCENSIONE',
            subtitle: 'Oltre la tecnica, c\'è lo spirito.',
            modules: [
                {
                    id: 'm1-8-1',
                    title: 'Il Viaggio del Cambiamento',
                    description: 'Trasformazione Before & After. Rituale: Il Ponte di Luce.',
                    output: 'Schema: Mappa della Trasformazione',
                    type: 'video',
                    duration: '23:00'
                },
                {
                    id: 'm1-8-2',
                    title: 'Il Fuoco della Decisione',
                    description: 'Il Climax e la Call to Action irrevocabile. Rituale: Il Salto della Fede.',
                    output: 'Skill: Chiamata al Coraggio',
                    type: 'video',
                    duration: '20:00'
                },
                {
                    id: 'm1-8-3',
                    title: 'Il Rito dell\'Avanzamento',
                    description: 'Il Nuovo Normale e l\'Incoronazione. Rituale: L\'Incoronazione.',
                    output: 'Sigillo dell\'Ascensione',
                    type: 'video',
                    duration: '25:00'
                }
            ]
        },

        // MASTERMIND 9 - Livello IX: RIVELAZIONE
        {
            id: 'm1-9',
            title: 'Mastermind 9: RIVELAZIONE',
            subtitle: 'La verità è l\'unica moneta.',
            modules: [
                {
                    id: 'm1-9-1',
                    title: 'La Pelle che si Toglie',
                    description: 'De-Cliché ed Essenzialità Radicale. Rituale: La Lama di Luce.',
                    output: 'Skill: Essenzialità Radicale',
                    type: 'video',
                    duration: '19:00'
                },
                {
                    id: 'm1-9-2',
                    title: 'La Voce Nuda',
                    description: 'Improvvisazione e Flow. Rituale: Il Salto nel Buio.',
                    output: 'Asset: Fiducia Istintiva',
                    type: 'video',
                    duration: '21:00'
                },
                {
                    id: 'm1-9-3',
                    title: 'La Soglia della Verità',
                    description: 'Core Story e Identità Profonda. Rituale: Il Passaggio della Soglia.',
                    output: 'Sigillo della Rivelazione',
                    type: 'video',
                    duration: '24:00'
                }
            ]
        },

        // MASTERMIND 10 - Livello X: MAESTRIA
        {
            id: 'm1-10',
            title: 'Mastermind 10: MAESTRIA',
            subtitle: 'La storia è tua. Falla brillare.',
            modules: [
                {
                    id: 'm1-10-1',
                    title: 'La Sfera del Comando (Public Speaking)',
                    description: 'Stage Presence. Dirigere l\'energia della sala. Rituale: Il Direttore d\'Orchestra.',
                    output: 'Skill: Dominio Scenico',
                    type: 'video',
                    duration: '24:00'
                },
                {
                    id: 'm1-10-2',
                    title: 'Il Cerchio Completo (Ring Composition)',
                    description: 'Narrative Closure. Ricollegare la fine all\'inizio. Rituale: L\'Ouroboros.',
                    output: 'Asset: La Chiusura Perfetta',
                    type: 'video',
                    duration: '18:30'
                },
                {
                    id: 'm1-10-3',
                    title: 'Il Sigillo della Maestria',
                    description: 'Certification. Fusione dell\'identità. Rituale: La Fusione Finale.',
                    output: 'Diploma + Accesso Community',
                    type: 'video',
                    duration: '35:00'
                }
            ]
        }
    ]
};
