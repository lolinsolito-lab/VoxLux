import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load .env.local for local testing
dotenv.config({ path: '.env.local' });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY not found in environment variables!');
    console.error('Make sure .env.local exists with STRIPE_SECRET_KEY');
    process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
});

/**
 * Script to automatically create Stripe products and prices
 * Run with: node --loader tsx scripts/create-stripe-products.ts
 */

const products = [
    {
        name: 'MATRICE I: Storytelling Strategy Master',
        description: 'Il percorso completo per padroneggiare lo storytelling strategico. Trasforma la tua voce in uno strumento di influenza.',
        price: 59700, // €597
        courseId: 'matrice-1',
    },
    {
        name: 'MATRICE II: Vox Podcast Master',
        description: 'Il percorso completo per creare podcast professionali con AI Voice Cloning. Skill monetizzabile immediatamente.',
        price: 59700, // €597
        courseId: 'matrice-2',
    },
    {
        name: 'ASCENSION BOX: The Singularity',
        description: 'Accesso completo a MATRICE I + MATRICE II + contenuti esclusivi. RISPARMIO €197 rispetto all\'acquisto separato (valore totale €1.194).',
        price: 99700, // €997
        courseId: 'ascension-box',
    },
];

async function createProducts() {
    console.log('🚀 Creating Stripe products with HIGH TICKET pricing...\n');

    const results = [];

    for (const productData of products) {
        try {
            // Create product
            const product = await stripe.products.create({
                name: productData.name,
                description: productData.description,
                metadata: {
                    courseId: productData.courseId,
                },
            });

            console.log(`✅ Created product: ${product.name}`);
            console.log(`   Product ID: ${product.id}`);

            // Create price
            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: productData.price,
                currency: 'eur',
                metadata: {
                    courseId: productData.courseId,
                },
            });

            console.log(`✅ Created price: €${productData.price / 100}`);
            console.log(`   Price ID: ${price.id}\n`);

            results.push({
                courseId: productData.courseId,
                productId: product.id,
                priceId: price.id,
                amount: productData.price,
            });
        } catch (error: any) {
            console.error(`❌ Error creating ${productData.name}:`, error.message);
        }
    }

    console.log('\n📋 SUMMARY - Copy these Price IDs to services/stripe.ts:\n');
    console.log('export const STRIPE_PRODUCTS = {');
    results.forEach((r) => {
        console.log(`  '${r.courseId}': {`);
        console.log(`    priceId: '${r.priceId}',`);
        console.log(`    amount: ${r.amount},`);
        console.log(`    name: '...',`);
        console.log(`    description: '...',`);
        console.log(`  },`);
    });
    console.log('};\n');

    console.log('🎉 Done! Update services/stripe.ts with the Price IDs above.');
}

createProducts().catch(console.error);
