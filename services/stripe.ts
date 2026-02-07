import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export type CourseId = 'matrice-1' | 'matrice-2' | 'ascension-box';

export const STRIPE_PRODUCTS: Record<CourseId, { priceId: string; amount: number; name: string; description: string }> = {
    'matrice-1': {
        priceId: 'price_1SxCswCtMqmAVVg27E6H8yvF', // Stripe Price ID
        amount: 59700, // €597 in cents
        name: 'MATRICE I: Storytelling Strategy Master',
        description: 'Il percorso completo per padroneggiare lo storytelling strategico',
    },
    'matrice-2': {
        priceId: 'price_1SxCswCtMqmAVVg2DRoO3dYi', // Stripe Price ID
        amount: 59700, // €597 in cents
        name: 'MATRICE II: Vox Podcast Master',
        description: 'Il percorso completo per creare podcast professionali con AI Voice Cloning',
    },
    'ascension-box': {
        priceId: 'price_1SxCt1CtMqmAVVg2LIKwvh3s', // Stripe Price ID (Corrected)
        amount: 99700, // €997 in cents
        name: 'ASCENSION BOX: The Ultimate Collection',
        description: 'Accesso completo a Matrice I, Matrice II e sessioni 1-on-1 VIP.',
    },
};

export const createCheckoutSession = async (priceId: CourseId, email?: string, promoCode?: string, returnUrl?: string) => {
    try {
        console.log('Initiating checkout for:', priceId);

        let targetPriceId = STRIPE_PRODUCTS[priceId].priceId;

        // Safety check for Ascension Box specifically
        if (priceId === 'ascension-box' && targetPriceId !== 'price_1SxCt1CtMqmAVVg2LIKwvh3s') {
            console.warn('Correcting Ascension Box Price ID');
            targetPriceId = 'price_1SxCt1CtMqmAVVg2LIKwvh3s';
        }

        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: targetPriceId,
                courseId: priceId,
                userEmail: email, // Optional: Pre-fill email in Stripe
                promoCode: promoCode,
                returnUrl: returnUrl, // Optional: Redirect back to specific page
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error('No checkout URL returned');
        }

    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};
