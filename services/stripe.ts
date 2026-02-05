import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
    if (!stripePromise) {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

        if (!publishableKey) {
            throw new Error('Missing Stripe publishable key');
        }

        stripePromise = loadStripe(publishableKey);
    }

    return stripePromise;
};

// Stripe Product IDs (High-Ticket Pricing Strategy)
export const STRIPE_PRODUCTS = {
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
        priceId: 'price_1SxCsxCtMqmAVVg2cgeGTO6j', // Stripe Price ID
        amount: 99700, // €997 in cents (risparmio €197 vs €1.194)
        name: 'ASCENSION BOX: The Singularity',
        description: 'Accesso completo a MATRICE I + MATRICE II + contenuti esclusivi',
    },
} as const;

export type CourseId = keyof typeof STRIPE_PRODUCTS;

// Create Stripe Checkout Session
export const createCheckoutSession = async (courseId: CourseId, userEmail?: string) => {
    const product = STRIPE_PRODUCTS[courseId];

    if (!product) {
        throw new Error(`Invalid course ID: ${courseId}`);
    }

    try {
        // Call API to create checkout session
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: product.priceId,
                courseId,
                userEmail,
            }),
        });

        const { url } = await response.json();

        if (url) {
            window.location.href = url;
        } else {
            console.error('No checkout URL returned from API');
            throw new Error('No checkout URL returned');
        }
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};
