# Integrazione Ibrida & Fix CSP

## 🎯 Obiettivo
Risolvere i blocchi di visualizzazione video (CSP) e connettere i corsi "Cinematici" (Matrice 1 e 2) ai dati reali del database Supabase, mantenendo intatta l'interfaccia utente personalizzata.

## 🛠️ Modifiche Effettuate

### 1. Fix Sicurezza (CSP) & Video
- **File:** `vercel.json`
- **Azione:** Aggiunto `https://player.vimeo.com` alla whitelist `frame-src`.
- **Risultato:** I video di Vimeo ora possono essere caricati all'interno dell'app senza essere bloccati dal browser.

### 2. Hook "Ibrido" `useCourseData`
- **Nuovo File:** `hooks/useCourseData.ts`
- **Funzione:**
    - Tenta di caricare i dati del corso da Supabase (Titolo, Moduli).
    - Se il DB è vuoto o offline, fa **fallback automatico** sui dati hardcoded locali.
    - Mappa la struttura piatta del DB nella struttura gerarchica "Mastermind" richiesta dall'UI.

### 3. Integrazione Visuale
- **File:** `components/CinematicHubView.tsx` (Matrice 1)
- **File:** `components/PodcastCinematicHub.tsx` (Matrice 2)
- **Modifica:** Sostituito il caricamento statico con:
  ```typescript
  const { course, loading } = useCourseData(courseId);
  ```
- **Risultato:** L'interfaccia "spaziale/galattica" ora si popola dinamicamente. Se modifichi un titolo nel pannello Admin, si aggiorna anche qui.

## ✅ Verifica Richiesta
1. **Video:** Controlla se i video delle lezioni ora partono senza errori in console.
2. **Corsi:** Entra in "Matrice 1" o "Matrice 2" dalla Dashboard.
    - Dovresti vedere i moduli caricarsi (brevi spinner di caricamento).
    - Se il DB è stato popolato (come fatto nel passaggio precedente), vedrai i dati reali.
