import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Force dynamic execution (no caching)
export const config = {
    api: {
        bodyParser: true,
    },
};

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''; // Or service role if needed

// Initialize clients safely inside handler or locally if possible, but global is fine for cold starts
// if env vars are present. 
// However, to be safe against missing env vars crashing the module, we verify them.

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('Missing STRIPE_SECRET_KEY');
        }
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase Env Vars');
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            // @ts-ignore
            apiVersion: '2024-12-18.acacia',
        });

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { priceId, courseId, userEmail, upsellIds = [], promoCode } = req.body;

        if (!priceId || !courseId) {
            res.status(400).json({ error: 'Missing priceId or courseId' });
            return;
        }

        // Build line items (main product + upsells)
        const lineItems = [
            {
                price: priceId,
                quantity: 1,
            },
        ];

        // Add upsells if selected
        if (upsellIds.length > 0) {
            const { data: upsells } = await supabase
                .from('upsell_products')
                .select('*')
                .in('id', upsellIds)
                .eq('active', true);

            if (upsells) {
                upsells.forEach((upsell) => {
                    if (upsell.stripe_price_id) {
                        lineItems.push({
                            price: upsell.stripe_price_id,
                            quantity: 1,
                        });
                    }
                });
            }
        }

        // Validate promo code if provided
        let discounts = undefined;

        if (promoCode) {
            const { data: promo } = await supabase
                .from('promo_codes')
                .select('*')
                .eq('code', promoCode.toUpperCase())
                .eq('active', true)
                .single();

            if (promo && new Date(promo.valid_until) > new Date()) {
                // Create Stripe coupon on-the-fly
                const stripeCoupon = await stripe.coupons.create({
                    percent_off: promo.discount_type === 'percentage' ? promo.discount_value : undefined,
                    amount_off: promo.discount_type === 'fixed_amount' ? promo.discount_value : undefined,
                    currency: 'eur',
                    duration: 'once',
                });

                discounts = [{ coupon: stripeCoupon.id }];
            }
        }

        const origin = req.headers.origin || 'https://vox-lux.vercel.app';

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/`,
            customer_email: userEmail,
            discounts,
            metadata: {
                courseId,
                bonusEligible: 'true',
                promoCode: promoCode || '',
            },
            // Allow promo codes in checkout UI
            allow_promotion_codes: true,
        });

        res.status(200).json({ sessionId: session.id, url: session.url });

    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
}
