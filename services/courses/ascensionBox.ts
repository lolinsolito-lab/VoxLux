import { Course } from './types';

export const ascensionBox: Course = {
    id: 'ascension-box',
    title: 'ASCENSION BOX: Ultimate Combo',
    description: 'L\'accesso totale alla conoscenza proibita. 60 Moduli di pura potenza.',

    masterminds: [{
        id: 'ab-intro',
        title: 'IL PORTALE UNIFICATO',
        subtitle: 'Benvenuto nell\'Ascensione',
        modules: [
            {
                id: 'ab-1',
                title: 'Accesso Matrice I',
                description: 'Redirect ai protocolli di Storytelling.',
                output: 'Access Granted',
                type: 'text',
                duration: 'Link'
            },
            {
                id: 'ab-2',
                title: 'Accesso Matrice II',
                description: 'Redirect ai protocolli Audio.',
                output: 'Access Granted',
                type: 'text',
                duration: 'Link'
            },
            {
                id: 'ab-3',
                title: 'CRIPTE VOCALI (Bonus)',
                description: 'Archivio segreto di prompt e voci AI esclusive.',
                output: 'Download Pack',
                type: 'text',
                duration: 'Download'
            }
        ]
    }]
};
