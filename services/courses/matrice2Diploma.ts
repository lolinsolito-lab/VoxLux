import { DiplomaSpec } from './types';

// Diploma Matrice 2 - Stile Cyber/Podcast
export const matrice2Diploma: DiplomaSpec = {
    name: 'Diploma Master — Architetto del Suono (Vox Lux)',

    visualDescription: `
    Formato 3D interattivo: una sfera cromata che pulsa di luce al neon (Viola/Ciano).
    
    Elementi visibili:
    - Onde sonore visualizzate come spettrogramma
    - Nome nominativo del diplomato in font futuristico
    - Livello di Maestria Audio
    - Data di emissione
    - ID certificato univoco
    - Firma audio (Beat signature)
    
    Animazione d'ingresso:
    1. Grid laser che scansiona l'area
    2. La sfera si materializza dal wireframe
    3. Impulso sonoro visibile (Shockwave)
    4. Voce sintetica che proclama il completamento
    
    Rito di consegna: 
    Frequenze binaurali e glitch art controllata.
  `,

    technicalSpecs: {
        model3D: 'glTF 2.0 (Neon PBR) con emissione luce dinamica',

        animations: `
      - Shader graph per le onde sonore
      - Rotazione su 3 assi (Gimbal lock free)
      - Glitch effect su hover
      - Particle system (Digital Rain)
    `,

        audio: `
      - Cerimonia completa: Synthwave/Dark Ambient track
      - Web playback: MP3 320kbps
      - Chime: Digital confirmation sound
      - Voice proclamation: AI Voice "Vox Sephira"
    `,

        metadata: `
      JSON structure:
      {
        "name": "Nome Cognome",
        "id": "VL-PM-2025-XXXXXX",
        "issueDate": "2025-12-07",
        "course": "Vox Podcast Master",
        "level": "Audio Architect",
        "skills": ["Audio Engineering", "Voice Cloning", "Sound Design"],
        "signedBy": "Michael Jara",
        "verificationUrl": "https://voxlux.com/verify?id=VL-PM-2025-XXXXXX"
      }
    `,

        exports: [
            'diploma_podcast.glb - Modello 3D',
            'diploma_podcast_poster.png - Poster 4K',
            'diploma_podcast_cert.pdf - Certificato PDF',
            'diploma_podcast_audio.wav - Traccia audio personale'
        ]
    },

    personalization: {
        nominative: true,
        signature: true,
        security: `
      - QR code olografico
      - ID univoco hash
      - Link di verifica persistente
    `
    }
};
