# Strategia di Integrazione Ibrida (Vox Lux)

## 🎯 Obiettivo
Colmare il divario tra l'architettura visiva complessa ("Cinematic UI") esistente e il nuovo backend Supabase, senza riscrivere i componenti frontend personalizzati.

## 🏗️ Architettura: Il Pattern "Data Bridge"

Invece di rifare le UI, abbiamo creato un **Hook Ponte** (`useCourseData`) che agisce come adattatore universale.

### Flusso dei Dati
1.  **Chiamata Iniziale:** Il componente (es. `CinematicHubView`) richiede i dati tramite `useCourseData(courseId)`.
2.  **Tentativo DB (Supabase):** L'hook interroga la tabella `courses` e `course_modules`.
3.  **Adattamento Strutturale:** 
    - Il DB restituisce una lista *piatta* di moduli.
    - L'hook li raggruppa logicamente in "Mondi" (Masterminds) per rispettare l'UI a 10 nodi.
4.  **Fail-Safe (Legacy Fallback):**
    - Se il DB è vuoto, irraggiungibile o manca il corso, l'hook carica istantaneamente il file statico locale (`services/courses/matrice1.ts`, ecc.).
    - Questo garantisce che l'app non mostri mai una pagina vuota.

## 🧩 Componenti Adattati

### 1. `CinematicHubView` (Matrice 1)
- **Prima:** Importava staticamente `COURSES['matrice-1']`.
- **Dopo:** Usa `const { course, loading } = useCourseData('matrice-1')`.
- **Beneficio:** Mantiene le animazioni e la mappa stellare, ma i titoli dei moduli sono ora modificabili dal pannello Admin.

### 2. `PodcastCinematicHub` (Matrice 2)
- **Prima:** Importava staticamente `COURSES['matrice-2']`.
- **Dopo:** Usa `useCourseData('matrice-2')`.
- **Beneficio:** Il sistema solare orbitale renderizza i dati dinamici.

### 3. `DashboardPage`
- Aggiornata per leggere lo stato di sblocco e progresso direttamente da `purchase_status` e `course_progress` su Supabase.

## 🛡️ Sicurezza & Performance
- **CSP (Content Security Policy):** Aggiornato `vercel.json` per permettere l'embedding di `player.vimeo.com` e altri provider video sicuri.
- **Caching:** L'hook implementa una logica di stato locale per evitare flickering durante la navigazione.

## 🚀 Prossimi Passi
- Completare il popolamento dei contenuti su Supabase (Admin Panel).
- Una volta che tutti i dati sono su DB, si potrà rimuovere la logica di fallback legacy (opzionale, ma consigliato per pulizia codice).
