-- FIX: Data Cleanup & Type Conversion
-- Problema: Alcuni 'course_id' sono salvati come SLUG ("matrice-1") invece che come UUID.
-- Soluzione: Sostituiamo gli slug con gli UUID reali presi dalla tabella courses, poi convertiamo.

DO $$
DECLARE
    course_rec RECORD;
BEGIN
    -- 1. Per ogni corso che ha uno slug, aggiorniamo i moduli che usano quello slug come ID
    FOR course_rec IN SELECT id, slug FROM courses WHERE slug IS NOT NULL LOOP
        -- Aggiorna i moduli dove course_id corrisponde allo slug del corso (es. 'matrice-1')
        UPDATE modules 
        SET course_id = course_rec.id::text 
        WHERE course_id = course_rec.slug;
    END LOOP;
    
    -- Gestione specifica per eventuali id hardcoded noti se lo slug non matchasse
    -- UPDATE modules SET course_id = (SELECT id FROM courses WHERE slug='matrice-1' LIMIT 1)::text WHERE course_id = 'matrice-1';
END $$;

-- 2. Ora che i dati sono puliti (sono stringhe di UUID), convertiamo la colonna
ALTER TABLE "public"."modules"
ALTER COLUMN "course_id" TYPE uuid USING "course_id"::uuid;

-- 3. Aggiungiamo il vincolo di Foreign Key
-- (Solo se non esiste già)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'modules_course_id_fkey'
    ) THEN
        ALTER TABLE "public"."modules"
        ADD CONSTRAINT "modules_course_id_fkey"
        FOREIGN KEY ("course_id")
        REFERENCES "public"."courses" ("id")
        ON DELETE CASCADE;
    END IF;
END $$;

-- Ricarica schema cache per Supabase
NOTIFY pgrst, 'reload config';
