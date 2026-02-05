import Stripe from 'stripe';
import { supabase } from '../services/supabase';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia',
});

export interface CreateCheckoutRequest {
    priceId: string;
    courseId: string;
    userEmail?: string;
    upsellIds?: string[]; // Optional upsell product IDs
    promoCode?: string; // Optional promo code
}

export async function POST(req: Request) {
    try {
        const { priceId, courseId, userEmail, upsellIds = [], promoCode }: CreateCheckoutRequest =
            await req.json();

        if (!priceId || !courseId) {
            return new Response('Missing priceId or courseId', { status: 400 });
        }

        // Build line items (main product + upsells)
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
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
        let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;

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

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            success_url: `${req.headers.get('origin')}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/pricing`,
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

        return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}
