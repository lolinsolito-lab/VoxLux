import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Force dynamic execution (no caching)
export const config = {
    api: {
        bodyParser: true,
    },
};

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
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        // MUST use service role key to update other users' data (purchases)
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase Environment Variables');
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { email, userId } = req.body;

        if (!email || !userId) {
            res.status(400).json({ error: 'Missing email or userId' });
            return;
        }

        console.log(`🔍 Looking for pending purchases for: ${email}`);

        // Find pending purchases by email
        const { data: purchases, error: fetchError } = await supabase
            .from('purchases')
            .select('*')
            .eq('email', email)
            .eq('status', 'pending_registration');

        if (fetchError) {
            throw fetchError;
        }

        if (!purchases || purchases.length === 0) {
            console.log('ℹ️ No pending purchases found');
            res.status(200).json({ activated: 0 });
            return;
        }

        console.log(`📦 Found ${purchases.length} pending purchase(s)`);

        // Activate all pending purchases
        const activatedPurchaseIds: string[] = [];

        for (const purchase of purchases) {
            // Update purchase status
            const { error: updateError } = await supabase
                .from('purchases')
                .update({
                    user_id: userId,
                    status: 'active',
                    activated_at: new Date().toISOString(),
                })
                .eq('id', purchase.id);

            if (updateError) {
                console.error(`❌ Error activating purchase ${purchase.id}:`, updateError);
                continue;
            }

            activatedPurchaseIds.push(purchase.id);
            console.log(`✅ Activated purchase: ${purchase.id} (${purchase.course_id})`);

            // Grant bonuses if eligible
            if (purchase.bonus_eligible && !purchase.bonus_granted) {
                const now = new Date();
                const expiresAt = new Date(purchase.bonus_expires_at);

                if (now <= expiresAt) {
                    await grantBonuses(supabase, userId, purchase.id, purchase.course_id);
                } else {
                    console.log(`⏰ Bonus expired for purchase ${purchase.id}`);
                }
            }
        }

        // Send welcome email with course access info
        if (activatedPurchaseIds.length > 0 && resendApiKey) {
            try {
                await sendWelcomeEmail(resendApiKey, email, purchases[0].course_id);
            } catch (emailError: any) {
                console.error('❌ Error sending welcome email:', emailError.message);
            }
        }

        res.status(200).json({
            activated: activatedPurchaseIds.length,
            purchaseIds: activatedPurchaseIds,
        });

    } catch (error: any) {
        console.error('Error activating purchase:', error);
        res.status(500).json({ error: error.message });
    }
}

async function grantBonuses(supabase: any, userId: string, purchaseId: string, courseId: string) {
    // Find applicable bonuses for this tier
    const { data: bonuses, error } = await supabase
        .from('bonus_products')
        .select('*')
        .contains('tier_applicable', [courseId])
        .eq('active', true);

    if (error || !bonuses || bonuses.length === 0) {
        console.log('ℹ️ No bonuses to grant');
        return;
    }

    console.log(`🎁 Granting ${bonuses.length} bonus(es)...`);

    for (const bonus of bonuses) {
        const { error: grantError } = await supabase.from('user_bonuses').insert({
            user_id: userId,
            bonus_id: bonus.id,
            purchase_id: purchaseId,
        });

        if (grantError) {
            // Ignore duplicate key errors (bonus already granted)
            if (grantError.code !== '23505') {
                console.error(`❌ Error granting bonus ${bonus.id}:`, grantError);
            }
        } else {
            console.log(`✅ Granted bonus: ${bonus.name}`);
        }
    }

    // Mark purchase as bonus granted
    await supabase.from('purchases').update({ bonus_granted: true }).eq('id', purchaseId);
}

async function sendWelcomeEmail(apiKey: string, email: string, courseId: string) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'VOX LUX Strategy <noreply@voxlux.com>',
            to: email,
            subject: '🚀 Il Tuo Account è Attivo - Inizia Ora!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d4af37;">👋 Benvenuto in VOX LUX!</h1>
          
          <p>Il tuo account è stato <strong>attivato con successo</strong>!</p>
          
          <p>Puoi ora accedere alla tua Dashboard personale e iniziare il tuo percorso di ascensione.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://vox-lux.vercel.app/dashboard" 
               style="background: linear-gradient(90deg, #d4af37, #f5d76e); 
                      color: #000; 
                      padding: 16px 32px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold;
                      display: inline-block;">
              🎯 VAI ALLA DASHBOARD
            </a>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>💡 Suggerimenti per Iniziare:</h3>
            <ul>
              <li>Esplora i Mondi disponibili nella tua Galassia</li>
              <li>Completa i Masterminds in ordine per massimizzare l'apprendimento</li>
              <li>Monitora il tuo progresso nella Dashboard</li>
              <li>Scarica i tuoi bonus dalla sezione Risorse</li>
            </ul>
          </div>
          
          <p style="color: #666;">
            Ricorda: Questo è un <strong>percorso di trasformazione</strong>, non una semplice formazione. 
            Dedica tempo e impegno per ottenere risultati straordinari.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            Hai domande? Rispondi a questa email o contattaci su support@voxlux.com
          </p>
        </div>
      `,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend API error: ${error}`);
    }

    console.log('📧 Welcome email sent');
}
