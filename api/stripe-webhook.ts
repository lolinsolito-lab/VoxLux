import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    api: {
        bodyParser: false, // Need raw body for webhook signature verification
    },
};

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('Missing STRIPE_SECRET_KEY');
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            // @ts-ignore
            apiVersion: '2024-12-18.acacia',
        });

        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];

        if (!sig) {
            res.status(400).json({ error: 'Missing stripe-signature header' });
            return;
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            res.status(400).json({ error: `Webhook Error: ${err.message}` });
            return;
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata;

                if (!metadata) break;

                if (metadata.type === 'bonus_purchase') {
                    await handleBonusPurchase(session, metadata, supabase);
                } else if (metadata.type === 'course_purchase') {
                    // Handle course purchases (existing logic)
                    await handleCoursePurchase(session, metadata, supabase);
                }

                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

// Handle bonus purchase webhook
async function handleBonusPurchase(
    session: Stripe.Checkout.Session,
    metadata: any,
    supabase: any
) {
    const { bonus_id, user_id } = metadata;

    console.log(`Processing bonus purchase: ${bonus_id} for user ${user_id}`);

    try {
        // 1. Grant access to user
        const { error: accessError } = await supabase
            .from('user_bonus_access')
            .insert({
                user_id: user_id,
                bonus_id: bonus_id,
                granted_by: null, // NULL = self-purchase
                purchase_amount_cents: session.amount_total,
                stripe_session_id: session.id
            });

        if (accessError) {
            console.error('Error granting bonus access:', accessError);
            throw accessError;
        }

        // 2. Update bonus stats (using stored function)
        const { error: statsError } = await supabase.rpc('increment_bonus_stats', {
            p_bonus_id: bonus_id,
            p_revenue: session.amount_total
        });

        if (statsError) {
            console.error('Error updating bonus stats:', statsError);
        }

        // 3. Log analytics event
        const { error: analyticsError } = await supabase
            .from('bonus_analytics')
            .insert({
                bonus_id: bonus_id,
                user_id: user_id,
                event_type: 'purchase',
                session_data: {
                    amount_total: session.amount_total,
                    stripe_session_id: session.id
                }
            });

        if (analyticsError) {
            console.error('Error logging analytics:', analyticsError);
        }

        console.log(`✅ Bonus ${bonus_id} successfully unlocked for user ${user_id}`);

    } catch (error) {
        console.error('Failed to process bonus purchase:', error);
        throw error;
    }
}

// Handle course purchase webhook (existing logic placeholder)
async function handleCoursePurchase(
    session: Stripe.Checkout.Session,
    metadata: any,
    supabase: any
) {
    const { course_id, user_id } = metadata;

    console.log(`Processing course purchase: ${course_id} for user ${user_id}`);

    // Insert into purchases table (existing logic)
    const { error } = await supabase
        .from('purchases')
        .upsert({
            user_id: user_id,
            course_id: course_id,
            status: 'active',
            stripe_session_id: session.id,
            purchase_date: new Date().toISOString()
        }, { onConflict: 'user_id,course_id' });

    if (error) {
        console.error('Error activating purchase:', error);
        throw error;
    }

    console.log(`✅ Course ${course_id} successfully activated for user ${user_id}`);
}
