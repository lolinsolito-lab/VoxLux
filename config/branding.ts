/**
 * VOX AUREA - CENTRALIZED BRANDING CONFIG
 * 
 * Change the brand name here and it updates everywhere!
 */

export const BRANDING = {
    // Main Brand Identity
    name: 'VOX AUREA',
    shortName: 'Vox Aurea',
    tagline: 'La comunicazione d\'élite per chi merita di essere ascoltato',

    // Product Names
    products: {
        matrice1: 'Storytelling Mastermind',
        matrice2: 'Podcast Mastermind',
        ascensionBox: 'ASCENSION: Il Percorso Completo'
    },

    // Course Archetypes
    archetypes: {
        storytelling: 'The Sun Archetype',
        podcast: 'The Moon Archetype'
    },

    // Contact & Social
    contact: {
        email: 'hello@voxaurea.com',
        website: 'https://vox-aurea.vercel.app'
    },

    // Legal
    legal: {
        companyName: 'Insolito Lab',
        copyright: `© ${new Date().getFullYear()} Insolito Lab. All rights reserved.`
    },

    // Color Palette (for reference)
    colors: {
        gold: '#E4C572',
        darkGold: '#C8AA6E',
        lightGold: '#FFD700',
        black: '#00040A',
        cyan: '#4FD4D0',
        bronze: '#8B7355'
    }
} as const;
