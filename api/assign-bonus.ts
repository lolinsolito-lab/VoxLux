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
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

        // ADMIN CHECK
        if (user.email !== 'jaramichael@hotmail.com') {
            res.status(403).json({ error: 'Forbidden - Admin only' });
            return;
        }

        const { bonus_id, user_ids } = req.body;

        if (!bonus_id || !user_ids || !Array.isArray(user_ids)) {
            res.status(400).json({ error: 'Missing bonus_id or user_ids array' });
            return;
        }

        // Verify bonus exists and is not purchasable
        const { data: bonus } = await supabase
            .from('bonus_content')
            .select('is_purchasable')
            .eq('id', bonus_id)
            .single();

        if (!bonus) {
            res.status(404).json({ error: 'Bonus not found' });
            return;
        }

        if (bonus.is_purchasable) {
            res.status(400).json({ error: 'Cannot manually assign purchasable extras' });
            return;
        }

        // Create access records
        const accessRecords = user_ids.map((userId: string) => ({
            user_id: userId,
            bonus_id: bonus_id,
            granted_by: user.id,
            purchase_amount_cents: 0 // Free bonus
        }));

        const { data, error } = await supabase
            .from('user_bonus_access')
            .upsert(accessRecords, { onConflict: 'user_id,bonus_id' })
            .select();

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        res.status(200).json({ success: true, assigned: data.length });

    } catch (error: any) {
        console.error('Assign bonus error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
