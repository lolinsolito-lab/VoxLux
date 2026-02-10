-- FIX: Data Deduplication & Type Conversion
-- Problema: Esistono moduli duplicati (alcuni con ID 'matrice-1', altri con l'UUID corretto).
-- Soluzione: 
-- 1. Eliminiamo i moduli con ID 'slug' SE esiste già un corrispettivo con ID 'UUID' (per evitare conflitti).
-- 2. Aggiorniamo i restanti ID 'slug' con ID 'UUID'.
-- 3. Convertiamo la colonna in UUID per abilitare la Foreign Key.

DO $$
DECLARE
    course_rec RECORD;
BEGIN
    -- Iteriamo su tutti i corsi che hanno uno slug
    FOR course_rec IN SELECT id, slug FROM courses WHERE slug IS NOT NULL LOOP
        
        -- 1. DELETE SICURO:
        -- Rimuovi i moduli "fantasma" (con course_id = slug) SE esiste già
        -- un modulo "reale" (con course_id = UUID) nello stesso ordine.
        DELETE FROM modules m_slug
        WHERE course_id = course_rec.slug
        AND EXISTS (
            SELECT 1 
            FROM modules m_real 
            WHERE m_real.course_id = course_rec.id::text 
            AND m_real.order_index = m_slug.order_index
        );

        -- 2. UPDATE DEI RIMANENTI:
        -- Ora che i duplicati sono rimossi, possiamo aggiornare quelli rimasti
        -- senza violare la constraint di unicità (course_id, order_index)
        UPDATE modules 
        SET course_id = course_rec.id::text 
        WHERE course_id = course_rec.slug;
        
    END LOOP;
END $$;

-- 3. Conversione Tipo Colonna (Text -> UUID)
ALTER TABLE "public"."modules"
ALTER COLUMN "course_id" TYPE uuid USING "course_id"::uuid;

-- 4. Aggiunta Foreign Key (se mancante)
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

-- Ricarica configurazione API
NOTIFY pgrst, 'reload config';
