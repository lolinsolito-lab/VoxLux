// Supabase Edge Function: activate-purchase
// Activates pending purchase when user signs up

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
    try {
        const { email, userId } = await req.json()

        if (!email || !userId) {
            return new Response('Missing email or userId', { status: 400 })
        }

        console.log(`🔍 Looking for pending purchases for: ${email}`)

        // Find pending purchases by email
        const { data: purchases, error: fetchError } = await supabase
            .from('purchases')
            .select('*')
            .eq('email', email)
            .eq('status', 'pending_registration')

        if (fetchError) {
            throw fetchError
        }

        if (!purchases || purchases.length === 0) {
            console.log('ℹ️ No pending purchases found')
            return new Response(JSON.stringify({ activated: 0 }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        console.log(`📦 Found ${purchases.length} pending purchase(s)`)

        // Activate all pending purchases
        const activatedPurchaseIds: string[] = []

        for (const purchase of purchases) {
            // Update purchase status
            const { error: updateError } = await supabase
                .from('purchases')
                .update({
                    user_id: userId,
                    status: 'active',
                    activated_at: new Date().toISOString(),
                })
                .eq('id', purchase.id)

            if (updateError) {
                console.error(`❌ Error activating purchase ${purchase.id}:`, updateError)
                continue
            }

            activatedPurchaseIds.push(purchase.id)
            console.log(`✅ Activated purchase: ${purchase.id} (${purchase.course_id})`)

            // Grant bonuses if eligible
            if (purchase.bonus_eligible && !purchase.bonus_granted) {
                const now = new Date()
                const expiresAt = new Date(purchase.bonus_expires_at)

                if (now <= expiresAt) {
                    await grantBonuses(userId, purchase.id, purchase.course_id)
                } else {
                    console.log(`⏰ Bonus expired for purchase ${purchase.id}`)
                }
            }
        }

        // Send welcome email with course access info
        if (activatedPurchaseIds.length > 0) {
            try {
                await sendWelcomeEmail(email, purchases[0].course_id)
            } catch (emailError: any) {
                console.error('❌ Error sending welcome email:', emailError.message)
            }
        }

        return new Response(
            JSON.stringify({
                activated: activatedPurchaseIds.length,
                purchaseIds: activatedPurchaseIds,
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (err: any) {
        console.error('❌ Error:', err.message)
        return new Response(`Error: ${err.message}`, { status: 500 })
    }
})

async function grantBonuses(userId: string, purchaseId: string, courseId: string) {
    // Find applicable bonuses for this tier
    const { data: bonuses, error } = await supabase
        .from('bonus_products')
        .select('*')
        .contains('tier_applicable', [courseId])
        .eq('active', true)

    if (error || !bonuses || bonuses.length === 0) {
        console.log('ℹ️ No bonuses to grant')
        return
    }

    console.log(`🎁 Granting ${bonuses.length} bonus(es)...`)

    for (const bonus of bonuses) {
        const { error: grantError } = await supabase.from('user_bonuses').insert({
            user_id: userId,
            bonus_id: bonus.id,
            purchase_id: purchaseId,
        })

        if (grantError) {
            // Ignore duplicate key errors (bonus already granted)
            if (grantError.code !== '23505') {
                console.error(`❌ Error granting bonus ${bonus.id}:`, grantError)
            }
        } else {
            console.log(`✅ Granted bonus: ${bonus.name}`)
        }
    }

    // Mark purchase as bonus granted
    await supabase.from('purchases').update({ bonus_granted: true }).eq('id', purchaseId)
}

async function sendWelcomeEmail(email: string, courseId: string) {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!resendApiKey) {
        console.warn('⚠️ RESEND_API_KEY not set, skipping welcome email')
        return
    }

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
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
            <a href="https://voxlux.com/dashboard" 
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
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Resend API error: ${error}`)
    }

    console.log('📧 Welcome email sent')
}
