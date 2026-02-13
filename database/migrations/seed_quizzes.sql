-- SEED DATA FOR QUIZZES
-- Run this AFTER creating the tables in 003_diplomas_and_quizzes.sql

-- 1. STORYTELLING MASTERMIND FINAL EXAM
-- Attached to Module m1-10-3 (Il Sigillo della Maestria) - Using slug 'm1-10' actually, or lesson slug?
-- Quiz attaches to MODULE, so 'm1-10'.
INSERT INTO quizzes (module_id, title, description, passing_score, questions)
VALUES (
    (SELECT id FROM modules WHERE slug = 'm1-10'), -- Lookup UUID by slug
    'Esame Finale: Stratega della Narrazione',
    'Dimostra di aver padroneggiato i 10 Regni della Neuro-Narrativa. Solo la verità sopravvive.',
    80,
    '[
        {
            "id": "q1",
            "text": "Qual è lo scopo ultimo del ''Viaggio dell''Eroe'' secondo la filosofia Vox Lux?",
            "options": [
                {"text": "Intrattenere il pubblico con effetti speciali", "isCorrect": false},
                {"text": "Trasformare l''identità dell''ascoltatore attraverso la risonanza", "isCorrect": true},
                {"text": "Vendere prodotti ad alto costo", "isCorrect": false},
                {"text": "Scrivere una sceneggiatura per Netflix", "isCorrect": false}
            ]
        },
        {
            "id": "q2",
            "text": "Cosa si intende per ''Punto di Sguardo'' (Mastermind 2)?",
            "options": [
                {"text": "Dove guardi mentre registri il video", "isCorrect": false},
                {"text": "La scelta dell''Avatar Vocale (Archetipo) da incarnare", "isCorrect": true},
                {"text": "La corretta illuminazione del set", "isCorrect": false},
                {"text": "Il punto focale della telecamera", "isCorrect": false}
            ]
        },
        {
            "id": "q3",
            "text": "Nel ''Teatro Interno'' (Mastermind 3), quale tecnica è fondamentale?",
            "options": [
                {"text": "Show, Don''t Tell (Mostra, non dire)", "isCorrect": true},
                {"text": "Leggere il copione parola per parola", "isCorrect": false},
                {"text": "Usare parole complesse e accademiche", "isCorrect": false},
                {"text": "Parlare il più velocemente possibile", "isCorrect": false}
            ]
        },
        {
            "id": "q4",
            "text": "Qual è la funzione del ''Plot Twist'' nella Narrativa Tattica?",
            "options": [
                {"text": "Confondere l''ascoltatore per fargli perdere il filo", "isCorrect": false},
                {"text": "Rompere lo schema previsto e riattivare l''attenzione (Dopamina)", "isCorrect": true},
                {"text": "Allungare la durata dell''episodio", "isCorrect": false},
                {"text": "Inserire una pubblicità a sorpresa", "isCorrect": false}
            ]
        },
        {
            "id": "q5",
            "text": "Cosa rappresenta l''Ouroboros nel Mastermind 10?",
            "options": [
                {"text": "Un serpente mitologico senza significato", "isCorrect": false},
                {"text": "La Ring Composition: la fine deve ricollegarsi all''inizio", "isCorrect": true},
                {"text": "Il cerchio di luce della ring light", "isCorrect": false},
                {"text": "Un simbolo di pericolo narrativo", "isCorrect": false}
            ]
        }
    ]'::jsonb
)
ON CONFLICT (module_id) DO UPDATE 
SET questions = EXCLUDED.questions, title = EXCLUDED.title;

-- 2. PODCAST MASTERMIND FINAL EXAM
-- Attached to Module m2-10
INSERT INTO quizzes (module_id, title, description, passing_score, questions)
VALUES (
    (SELECT id FROM modules WHERE slug = 'm2-10'), -- Lookup by slug
    'Esame Finale: Architetto del Suono',
    'La frequenza è la tua arma. Dimostra di saperla calibrare.',
    80,
    '[
        {
            "id": "p1",
            "text": "In termini di Ingegneria Acustica, cosa sono le ''Frequenze Alpha''?",
            "options": [
                {"text": "Rumore bianco di sottofondo", "isCorrect": false},
                {"text": "Onde cerebrali (8-12Hz) associate a stati di rilassamento e focus", "isCorrect": true},
                {"text": "Il volume massimo del microfono", "isCorrect": false},
                {"text": "Un tipo di equalizzazione per la voce", "isCorrect": false}
            ]
        },
        {
            "id": "p2",
            "text": "Qual è l''obiettivo del ''Mix & Master Luxury''?",
            "options": [
                {"text": "Rendere l''audio più forte possibile (Loudness War)", "isCorrect": false},
                {"text": "Creare uno spazio sonoro tridimensionale e pulito", "isCorrect": true},
                {"text": "Aggiungere effetti robotici alla voce", "isCorrect": false},
                {"text": "Muffolare i bassi per risparmiare banda", "isCorrect": false}
            ]
        },
        {
            "id": "p3",
            "text": "Il ''Sound Design Epico'' serve a:",
            "options": [
                {"text": "Coprire la voce se l''audio è pessimo", "isCorrect": false},
                {"text": "Creare un contesto emotivo e immersivo (Cinema per le orecchie)", "isCorrect": true},
                {"text": "Spaventare l''ascoltatore all''improvviso", "isCorrect": false},
                {"text": "Avere una sigla molto lunga", "isCorrect": false}
            ]
        }
    ]'::jsonb
)
ON CONFLICT (module_id) DO UPDATE 
SET questions = EXCLUDED.questions, title = EXCLUDED.title;
