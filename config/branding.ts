/**
 * VOX LUX STRATEGY - CENTRALIZED BRANDING CONFIG
 * 
 * Change the brand name here and it updates everywhere!
 */

export const BRANDING = {
    // Main Brand Identity
    name: 'VOX LUX STRATEGY',
    shortName: 'Vox Lux',
    tagline: 'Il portale per l\'ascensione neuro-digitale',

    // Product Names
    products: {
        matrice1: 'MATRICE I: Storytelling Strategy Master',
        matrice2: 'MATRICE II: Vox Podcast Master',
        ascensionBox: 'ASCENSION BOX: The Singularity'
    },

    // Course Archetypes
    archetypes: {
        storytelling: 'The Sun Archetype',
        podcast: 'The Moon Archetype'
    },

    // Contact & Social
    contact: {
        email: 'hello@voxlux.com',
        website: 'https://vox-lux.vercel.app'
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
