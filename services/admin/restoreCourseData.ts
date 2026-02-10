
import { SupabaseClient } from '@supabase/supabase-js';

// DATA: Storytelling (Matrice 1)
const STORYTELLING_MODULES = [
    {
        title: 'Mastermind 1: ORIGINE',
        description: 'Dove la storia respira per la prima volta',
        lessons: [
            { title: 'Il Chiamare la Storia', duration: 18, resources: '[{"type":"output","label":"Prima Frase Rituale"}]' },
            { title: 'L\'Ombra del Messaggio', duration: 13, resources: '[{"type":"output","label":"Emozione Madre"}]' },
            { title: 'Il Sigillo dell\'Intenzione', duration: 22, resources: '[{"type":"output","label":"Registrazione Intenzione (20s)"}]' }
        ]
    },
    {
        title: 'Mastermind 2: PRESENZA',
        description: 'La tua voce è il primo mondo che costruisci',
        lessons: [
            { title: 'La Spina Dorsale della Voce', duration: 20, resources: '[{"type":"output","label":"Asset: Stabilità Paraverbale"}]' },
            { title: 'Il Punto di Sguardo (Gli Archetipi)', duration: 19, resources: '[{"type":"output","label":"Avatar Vocale Dominante"}]' },
            { title: 'La Firma Energetica', duration: 22, resources: '[{"type":"output","label":"Logo Sonoro Personale"}]' }
        ]
    },
    {
        title: 'Mastermind 3: VISIONE',
        description: 'I narratori vedono mondi prima che esistano.',
        lessons: [
            { title: 'Il Teatro Interno', duration: 25, resources: '[{"type":"output","label":"Skill: Vista Cinematografica"}]' },
            { title: 'La Mappa Invisibile', duration: 20, resources: '[{"type":"output","label":"Asset: Setting Canvas"}]' },
            { title: 'La Camera dell\'Immagine', duration: 22, resources: '[{"type":"output","label":"Sigillo della Visione"}]' }
        ]
    },
    {
        title: 'Mastermind 4: FREQUENZA',
        description: 'La storia è un\'onda. Impara a cavalcarla.',
        lessons: [
            { title: 'Il Respiro del Racconto', duration: 21, resources: '[{"type":"output","label":"Asset: Il Metronomo Interiore"}]' },
            { title: 'Il Tempo dell\'Ascoltatore', duration: 17, resources: '[{"type":"output","label":"Tecnica: Pacing Adattivo"}]' },
            { title: 'Onde Emotive', duration: 19, resources: '[{"type":"output","label":"Sigillo della Frequenza"}]' }
        ]
    },
    {
        title: 'Mastermind 5: ARCHETIPI',
        description: 'Indossa le maschere degli dei.',
        lessons: [
            { title: 'Il Custode (Chi è l\'Eroe?)', duration: 20, resources: '[{"type":"output","label":"Concetto: Posizionamento Guida"}]' },
            { title: 'L\'Eroe Ferito (Il Difetto Fatale)', duration: 19, resources: '[{"type":"output","label":"Asset: Vulnerabilità Strategica"}]' },
            { title: 'L\'Antagonista Invisibile', duration: 22, resources: '[{"type":"output","label":"Sigillo degli Archetipi"}]' }
        ]
    },
    {
        title: 'Mastermind 6: NARRATIVA TATTICA',
        description: 'La strategia è l\'arte della guerra senza sangue.',
        lessons: [
            { title: 'Il Gancio di Ingresso (The Hook)', duration: 18, resources: '[{"type":"output","label":"Tecnica: Pattern Interrupt"}]' },
            { title: 'Il Percorso dell\'Attesa (Open Loops)', duration: 21, resources: '[{"type":"output","label":"Schema: Spirale di Tensione"}]' },
            { title: 'Il Punto di Rottura (Plot Twist)', duration: 20, resources: '[{"type":"output","label":"Sigillo della Tattica"}]' }
        ]
    },
    {
        title: 'Mastermind 7: EMPATIA STRATEGICA',
        description: 'Connettersi è vincere.',
        lessons: [
            { title: 'Ascoltare il Non Detto', duration: 20, resources: '[{"type":"output","label":"Skill: Decodifica Emotiva"}]' },
            { title: 'Il Calore della Voce', duration: 18, resources: '[{"type":"output","label":"Tecnica: Prossimità Vocale"}]' },
            { title: 'La Mano sulla Spalla', duration: 22, resources: '[{"type":"output","label":"Sigillo dell\'Empatia"}]' }
        ]
    },
    {
        title: 'Mastermind 8: ASCENSIONE',
        description: 'Oltre la tecnica, c\'è lo spirito.',
        lessons: [
            { title: 'Il Viaggio del Cambiamento', duration: 23, resources: '[{"type":"output","label":"Schema: Mappa della Trasformazione"}]' },
            { title: 'Il Fuoco della Decisione', duration: 20, resources: '[{"type":"output","label":"Skill: Chiamata al Coraggio"}]' },
            { title: 'Il Rito dell\'Avanzamento', duration: 25, resources: '[{"type":"output","label":"Sigillo dell\'Ascensione"}]' }
        ]
    },
    {
        title: 'Mastermind 9: RIVELAZIONE',
        description: 'La verità è l\'unica moneta.',
        lessons: [
            { title: 'La Pelle che si Toglie', duration: 19, resources: '[{"type":"output","label":"Skill: Essenzialità Radicale"}]' },
            { title: 'La Voce Nuda', duration: 21, resources: '[{"type":"output","label":"Asset: Fiducia Istintiva"}]' },
            { title: 'La Soglia della Verità', duration: 24, resources: '[{"type":"output","label":"Sigillo della Rivelazione"}]' }
        ]
    },
    {
        title: 'Mastermind 10: MAESTRIA',
        description: 'La storia è tua. Falla brillare.',
        lessons: [
            { title: 'La Sfera del Comando (Public Speaking)', duration: 24, resources: '[{"type":"output","label":"Skill: Dominio Scenico"}]' },
            { title: 'Il Cerchio Completo (Ring Composition)', duration: 19, resources: '[{"type":"output","label":"Asset: La Chiusura Perfetta"}]' },
            { title: 'Il Sigillo della Maestria', duration: 35, resources: '[{"type":"output","label":"Diploma + Accesso Community"}]' }
        ]
    }
];

// DATA: Podcast (Matrice 2)
const PODCAST_MODULES = [
    {
        title: 'LIVELLO I — FONDAZIONE',
        description: 'Fondazione della Voce ed Anatomia Sonora.',
        lessons: [
            { title: 'Modulo 1 – Timbro & Anatomia Vocale', duration: 15 },
            { title: 'Modulo 2 – Respirazione di Potenza', duration: 15 },
            { title: 'Modulo 3 – Coordinazione Voce-Emozione', duration: 15 }
        ]
    },
    {
        title: 'LIVELLO II — PSICOLOGIA',
        description: 'Psicologia dell’Ascolto e Neuroscienze.',
        lessons: [
            { title: 'Modulo 4 – Come il cervello ascolta', duration: 15 },
            { title: 'Modulo 5 – Frequenze che trattengono', duration: 15 },
            { title: 'Modulo 6 – Modelli di attivazione', duration: 15 }
        ]
    },
    {
        title: 'LIVELLO III — ARCHITETTURA',
        description: 'Costruzione dell’Episodio Audio Perfetto.',
        lessons: [
            { title: 'Modulo 7 – Intro, Setup, Immersione', duration: 15 },
            { title: 'Modulo 8 – Ritmo Sonoro e Transizioni', duration: 15 },
            { title: 'Modulo 9 – Struttura Podcast Elite', duration: 15 }
        ]
    },
    {
        title: 'MODULI AVANZATI',
        description: 'Tecniche Elite di Sound Design e Voce.',
        lessons: [
            { title: 'Modulo 10 – Purezza del Suono', duration: 15 },
            { title: 'Modulo 11 – Silenzio Perfetto', duration: 15 },
            { title: 'Modulo 12 – Profiling Acustico', duration: 15 }
        ]
    },
    {
        title: 'Mastermind 5: Produzione & Edit',
        description: 'L\'arte del montaggio invisibile.',
        lessons: [
            { title: 'Edit: Workflow', duration: 15 },
            { title: 'Edit: Mix', duration: 15 }
        ]
    },
    {
        title: 'Mastermind 6: Sound Design',
        description: 'Creare atmosfere uniche.',
        lessons: [
            { title: 'SFX: Librerie', duration: 15 },
            { title: 'SFX: Layering', duration: 15 }
        ]
    },
    {
        title: 'Mastermind 7: Distribuzione Globale',
        description: 'Strategie di lancio.',
        lessons: [
            { title: 'Distribuzione Globale: Setup', duration: 18 },
            { title: 'Distribuzione Globale: RSS', duration: 12 },
            { title: 'Distribuzione Globale: Launch', duration: 35 }
        ]
    },
    {
        title: 'Mastermind 8: Monetizzazione Audio',
        description: 'Revenue.',
        lessons: [
            { title: 'Monetizzazione: Sponsor', duration: 18 },
            { title: 'Monetizzazione: Premium', duration: 12 },
            { title: 'Monetizzazione: Funnel', duration: 35 }
        ]
    },
    {
        title: 'Mastermind 9: AI Voice Cloning',
        description: 'Sintesi vocale.',
        lessons: [
            { title: 'AI Voice: Cloning', duration: 18 },
            { title: 'AI Voice: Automation', duration: 12 },
            { title: 'AI Voice: Ethics', duration: 35 }
        ]
    },
    {
        title: 'Mastermind 10: L\'Eredità Sonora',
        description: 'Archivio perenne.',
        lessons: [
            { title: 'Eredità: Archivio', duration: 18 },
            { title: 'Eredità: Network', duration: 12 },
            { title: 'Eredità: Visione', duration: 35 }
        ]
    }
];

export async function restoreCourses(supabase: SupabaseClient) {
    console.log('--- STARTING RESTORE (FRONTEND) ---');

    // 1. GET COURSE IDs
    const { data: courses, error: errC } = await supabase.from('courses').select('id, slug');
    if (errC) {
        console.error('Error fetching courses', errC);
        throw errC;
    }

    const mat1 = courses.find(c => c.slug === 'matrice-1');
    const mat2 = courses.find(c => c.slug === 'matrice-2');

    if (!mat1 || !mat2) {
        console.error('Missing courses in DB. Run seed first.');
        throw new Error('Missing courses in DB.');
    }

    // HELPER FUNCTION
    const restoreCourse = async (courseId: string, modulesData: any[]) => {
        console.log(`\nRestoring data for Course ID: ${courseId}`);

        // A. CLEANUP 
        const { data: oldMods, error: fetchErr } = await supabase.from('modules').select('id').eq('course_id', courseId);
        if (!fetchErr && oldMods && oldMods.length > 0) {
            const modIds = oldMods.map(m => m.id);
            // Cascading deletion via modules typically works, but deleting lessons first is safer if no Cascade
            await supabase.from('lessons').delete().in('module_id', modIds);
            await supabase.from('modules').delete().in('id', modIds);
            console.log('Cleaned up old data.');
        }

        // B. INSERT
        for (let i = 0; i < modulesData.length; i++) {
            const m = modulesData[i];

            // Insert Module
            const { data: modResult, error: modErr } = await supabase
                .from('modules')
                .insert({
                    course_id: courseId,
                    title: m.title,
                    description: m.description,
                    order_index: i,
                    is_locked: false
                })
                .select('id')
                .single();

            if (modErr || !modResult) {
                console.error(`Failed to insert module ${m.title}`, modErr);
                continue;
            }

            const moduleId = modResult.id;
            console.log(`Inserted Module: ${m.title}`);

            // Insert Lessons
            const lessonsPayload = m.lessons.map((l: any, lIdx: number) => ({
                module_id: moduleId,
                title: l.title,
                description: l.title,
                video_provider: 'custom',
                duration_minutes: l.duration,
                order_index: lIdx,
                resources: l.resources || '[]'
            }));

            const { error: lessonErr } = await supabase.from('lessons').insert(lessonsPayload);
            if (lessonErr) console.error(`Failed to insert lessons for ${m.title}`, lessonErr);
        }
    };

    await restoreCourse(mat1.id, STORYTELLING_MODULES);
    await restoreCourse(mat2.id, PODCAST_MODULES);

    console.log('--- RESTORE COMPLETE ---');
    return true;
}
