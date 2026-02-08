import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    api: {
        bodyParser: true,
    },
};

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
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
        // Enhanced env vars check
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('❌ STRIPE_SECRET_KEY is missing');
            res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
            return;
        }

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('❌ Supabase env vars missing:', {
                hasUrl: !!supabaseUrl,
                hasServiceKey: !!supabaseServiceKey
            });
            res.status(500).json({ error: 'Supabase configuration missing' });
            return;
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            // @ts-ignore
            apiVersion: '2024-12-18.acacia',
        });

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get user from auth header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error('❌ No authorization header');
            res.status(401).json({ error: 'Unauthorized - No auth header' });
            return;
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError) {
            console.error('❌ Auth error:', authError);
            res.status(401).json({ error: `Auth failed: ${authError.message}` });
            return;
        }

        if (!user) {
            console.error('❌ No user found');
            res.status(401).json({ error: 'User not found' });
            return;
        }

        console.log('✅ User authenticated:', user.email);

        const { bonus_id } = req.body;

        if (!bonus_id) {
            res.status(400).json({ error: 'Missing bonus_id' });
            return;
        }

        // Fetch bonus details
        console.log('🔍 Fetching bonus:', bonus_id);
        const { data: bonus, error: bonusError } = await supabase
            .from('bonus_content')
            .select('*')
            .eq('id', bonus_id)
            .single();

        if (bonusError) {
            console.error('❌ Bonus fetch error:', bonusError);
            res.status(404).json({ error: `Bonus not found: ${bonusError.message}` });
            return;
        }

        if (!bonus) {
            console.error('❌ Bonus not found in DB');
            res.status(404).json({ error: 'Bonus not found' });
            return;
        }

        console.log('✅ Bonus found:', bonus.title, '- Price:', bonus.price_cents);

        if (!bonus.is_purchasable) {
            console.error('❌ Bonus not purchasable');
            res.status(400).json({ error: 'This bonus is not purchasable' });
            return;
        }

        // Check if user already has this bonus
        const { data: existingAccess } = await supabase
            .from('user_bonus_access')
            .select('id')
            .eq('user_id', user.id)
            .eq('bonus_id', bonus_id)
            .single();

        if (existingAccess) {
            console.error('❌ User already has access');
            res.status(400).json({ error: 'You already have access to this bonus' });
            return;
        }

        // Create Stripe Checkout Session
        console.log('💳 Creating Stripe session...');
        try {
            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'eur',
                        unit_amount: bonus.price_cents,
                        product_data: {
                            name: bonus.title,
                            description: bonus.description || 'Contenuto Bonus Premium',
                        }
                    },
                    quantity: 1
                }],
                metadata: {
                    type: 'bonus_purchase',
                    bonus_id: bonus.id,
                    user_id: user.id,
                    user_email: user.email || ''
                },
                customer_email: user.email,
                success_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/dashboard?bonus_unlocked=${bonus.id}`,
                cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/dashboard`
            });

            console.log('✅ Stripe session created:', session.id);
            res.status(200).json({ url: session.url, session_id: session.id });

        } catch (stripeError: any) {
            console.error('❌ Stripe session creation failed:', stripeError);
            res.status(500).json({ error: `Stripe error: ${stripeError.message}` });
            return;
        }

    } catch (error: any) {
        console.error('❌ Bonus checkout error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
