import { DiplomaSpec } from './types';

// Diploma Magistrale 3D - Stile League of Legends
export const matrice1Diploma: DiplomaSpec = {
    name: 'Diploma Magistrale — Architetto della Narrativa (Vox Lux)',

    visualDescription: `
    Formato 3D interattivo: una placchetta metallica finemente cesellata che ruota su asse, con rilievo dorato.
    
    Elementi visibili:
    - Stemma Vox Lux in rilievo centrale
    - Nome nominativo del diplomato
    - Livello di Maestria X
    - Data di emissione
    - ID certificato univoco
    - Firma audio (2-4s) della dirigenza
    
    Animazione d'ingresso:
    1. Sigillo appare dal vuoto con particelle dorate
    2. Luce scorre lungo le incisioni (effetto circuitry)
    3. Nome emerge in rilievo 3D con glow effect
    4. Suono chime cristallino + voce che proclama il nominativo
    
    Rito di consegna: 
    Quando visualizzato in dashboard, parte automaticamente la Cerimonia di Ascensione 
    con animazione completa e audio immersivo.
  `,

    technicalSpecs: {
        model3D: 'glTF 2.0 (PBR rendering) con texture metalliche + fallback PNG 4K per browser legacy',

        animations: `
      - Lottie (JSON) per particelle dorate e glow effects
      - Rotazione continua su asse Y (loop infinito)
      - Pulse effect sul bordo quando hover
      - Particle system per l'ingresso (500+ particelle)
    `,

        audio: `
      - Cerimonia completa: WAV 48kHz 24-bit (alta qualità)
      - Web playback: MP3 320kbps
      - Chime: sound design custom (cristallino + riverbero)
      - Voice proclamation: registrazione professionale nominativo
    `,

        metadata: `
      JSON structure:
      {
        "name": "Nome Cognome",
        "id": "VL-SS-2025-XXXXXX",
        "issueDate": "2025-12-07",
        "course": "Storytelling Strategy Master",
        "level": "Maestria X",
        "badgeList": ["Mastermind I", "Mastermind II", ..., "Mastermind X"],
        "signedBy": "Michael Jara",
        "signatureImageUrl": "https://voxlux.com/signatures/mj.svg",
        "signatureAudioUrl": "https://voxlux.com/signatures/mj_voice.mp3",
        "verificationUrl": "https://voxlux.com/verify?id=VL-SS-2025-XXXXXX"
      }
    `,

        exports: [
            'diploma.glb - Modello 3D interattivo',
            'diploma_poster.png - Poster 4K per stampa (3840x2160)',
            'diploma_certificate.pdf - Certificato stampabile con QR code',
            'diploma_ceremony.wav - Audio cerimonia completa (48kHz 24-bit)',
            'diploma_metadata.json - Dati certificato per verifica'
        ]
    },

    personalization: {
        nominative: true, // Nome estratto automaticamente dal profilo utente
        signature: true,  // Firma visiva SVG + firma audio registrata
        security: `
      - Watermark dinamico con ID univoco integrato nel modello 3D
      - QR code verificabile generato dinamicamente
      - API endpoint per verifica autenticità: GET /api/verify-diploma/:id
      - Blockchain hash opzionale per certificati premium
      - Rate limiting su verifiche per prevenire scraping
    `
    }
};
