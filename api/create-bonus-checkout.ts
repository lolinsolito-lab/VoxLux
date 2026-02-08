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
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('Missing STRIPE_SECRET_KEY');
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            // @ts-ignore
            apiVersion: '2024-12-18.acacia',
        });

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get user from auth header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { bonus_id } = req.body;

        if (!bonus_id) {
            res.status(400).json({ error: 'Missing bonus_id' });
            return;
        }

        // Fetch bonus details
        const { data: bonus, error: bonusError } = await supabase
            .from('bonus_content')
            .select('*')
            .eq('id', bonus_id)
            .single();

        if (bonusError || !bonus) {
            res.status(404).json({ error: 'Bonus not found' });
            return;
        }

        if (!bonus.is_purchasable) {
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
            res.status(400).json({ error: 'You already have access to this bonus' });
            return;
        }

        // Create Stripe Checkout Session
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

        res.status(200).json({ url: session.url, session_id: session.id });

    } catch (error: any) {
        console.error('Bonus checkout error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
