
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gqirnlitkmrthmnzvhby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaXJubGl0a21ydGhtbnp2aGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzQ1NjUsImV4cCI6MjA4NTgxMDU2NX0.wKFmgCV2zbtAIVsSpV3-jifo6oux9BQXB511lKEVK6M';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const questions = [
    {
        category_title_match: 'Pagamenti',
        question: 'Posso chiedere il rimborso?',
        answer_html: '<p>Sì, offriamo una garanzia <strong>Soddisfatti o Rimborsati di 30 giorni</strong>. Se il protocollo non risuona con la tua frequenza, scrivici e ti rimborseremo, senza domande.</p>',
        is_public: true,
        order_index: 1
    },
    {
        category_title_match: 'Contenuti',
        question: 'Quanto tempo ho accesso al materiale?',
        answer_html: '<p>L\'accesso è <strong>a vita</strong> (Lifetime). Include tutti gli aggiornamenti futuri della matrice che hai acquistato.</p>',
        is_public: true,
        order_index: 2
    },
    {
        category_title_match: 'Contenuti',
        question: 'Riceverò un certificato?',
        answer_html: '<p>Assolutamente. Al completamento del percorso e superamento dell\'Esame della Singolarità, riceverai il <strong>Diploma NFT Vox Lux</strong> registrato su Blockchain.</p>',
        is_public: true,
        order_index: 3
    },
    {
        category_title_match: 'Pagamenti',
        question: 'Posso pagare a rate?',
        answer_html: '<p>Sì, offriamo piani di pagamento flessibili tramite Klarna o PayPal in 3 rate senza interessi. Seleziona l\'opzione al checkout.</p>',
        is_public: true,
        order_index: 4
    }
];

async function seed() {
    console.log('🌱 Seeding FAQs...');

    // Get Categories
    const { data: categories, error: catError } = await supabase.from('faq_categories').select('id, title');
    if (catError) {
        console.error('Error fetching categories:', catError);
        return;
    }

    for (const q of questions) {
        const category = categories.find(c => c.title.includes(q.category_title_match));
        if (!category) {
            console.warn(`Category matching "${q.category_title_match}" not found. Skipping question: ${q.question}`);
            continue;
        }

        const { error: insertError } = await supabase.from('faq_questions').insert({
            category_id: category.id,
            question: q.question,
            answer_html: q.answer_html,
            is_public: q.is_public,
            order_index: q.order_index
        });

        if (insertError) {
            console.error(`Error inserting question "${q.question}":`, insertError);
        } else {
            console.log(`✅ Inserted: ${q.question}`);
        }
    }

    console.log('✨ Done!');
}

seed();
