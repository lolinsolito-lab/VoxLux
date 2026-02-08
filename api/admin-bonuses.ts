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

        // Handle different methods
        switch (req.method) {
            case 'GET':
                await handleGet(req, res, supabase);
                break;
            case 'POST':
                await handlePost(req, res, supabase);
                break;
            case 'PUT':
                await handlePut(req, res, supabase);
                break;
            case 'DELETE':
                await handleDelete(req, res, supabase);
                break;
            default:
                res.status(405).json({ error: 'Method Not Allowed' });
        }

    } catch (error: any) {
        console.error('Bonuses API error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

// GET - Fetch all bonuses
async function handleGet(req: VercelRequest, res: VercelResponse, supabase: any) {
    const { filter } = req.query;

    let query = supabase.from('bonus_content').select('*');

    if (filter === 'bonus') query = query.eq('is_purchasable', false);
    if (filter === 'extra') query = query.eq('is_purchasable', true);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(200).json(data);
}

// POST - Create new bonus
async function handlePost(req: VercelRequest, res: VercelResponse, supabase: any) {
    const {
        title,
        description,
        icon,
        delivery_type,
        content_url,
        action_label,
        is_purchasable,
        price_cents,
        order_index,
        assigned_users // Array di user_ids per bonus gratuiti
    } = req.body;

    if (!title || !content_url) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    // Create bonus
    const { data: bonus, error: insertError } = await supabase
        .from('bonus_content')
        .insert({
            title,
            description: description || '',
            icon: icon || '🎁',
            delivery_type: delivery_type || 'video',
            content_url,
            action_label: action_label || 'ACCEDI',
            is_purchasable: is_purchasable || false,
            price_cents: price_cents || 0,
            order_index: order_index || 0,
            is_visible: true
        })
        .select()
        .single();

    if (insertError) {
        res.status(500).json({ error: insertError.message });
        return;
    }

    // If bonus and has assigned users, create access records
    if (!is_purchasable && assigned_users && assigned_users.length > 0) {
        const accessRecords = assigned_users.map((userId: string) => ({
            user_id: userId,
            bonus_id: bonus.id,
            granted_by: req.body.admin_id || null
        }));

        await supabase.from('user_bonus_access').insert(accessRecords);
    }

    res.status(201).json(bonus);
}

// PUT - Update bonus
async function handlePut(req: VercelRequest, res: VercelResponse, supabase: any) {
    const { id, ...updates } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Missing bonus id' });
        return;
    }

    const { data, error } = await supabase
        .from('bonus_content')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(200).json(data);
}

// DELETE - Soft delete bonus (set is_visible = false)
async function handleDelete(req: VercelRequest, res: VercelResponse, supabase: any) {
    const { id } = req.query;

    if (!id) {
        res.status(400).json({ error: 'Missing bonus id' });
        return;
    }

    // Soft delete
    const { error } = await supabase
        .from('bonus_content')
        .update({ is_visible: false })
        .eq('id', id);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(200).json({ success: true });
}
