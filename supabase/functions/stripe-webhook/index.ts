// Supabase Edge Function: stripe-webhook
// Handles Stripe webhooks for automated purchase flow

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2024-12-18.acacia',
    httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return new Response('No signature', { status: 400 })
    }

    try {
        // Get raw body for signature verification
        const body = await req.text()

        // Verify webhook signature
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

        console.log('📨 Webhook received:', event.type)

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
                break
            }

            case 'payment_intent.succeeded': {
                console.log('💰 Payment succeeded:', event.data.object.id)
                break
            }

            case 'customer.created': {
                console.log('👤 Customer created:', event.data.object.id)
                break
            }

            default:
                console.log('🔔 Unhandled event type:', event.type)
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err: any) {
        console.error('❌ Webhook error:', err.message)
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log('🎉 Checkout completed:', session.id)

    // Extract data from session
    const email = session.customer_details?.email
    const courseId = session.metadata?.courseId
    const amount = session.amount_total || 0
    const paymentIntentId = session.payment_intent as string
    const customerId = session.customer as string

    if (!email || !courseId) {
        console.error('❌ Missing required data:', { email, courseId })
        return
    }

    // Calculate 24h bonus eligibility window
    const now = new Date()
    const bonusExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

    // Extract upsells from line items (if any)
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const upsells = lineItems.data.slice(1).map((item) => ({
        name: item.description,
        amount: item.amount_total,
        quantity: item.quantity,
    }))

    // Save purchase to database
    const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
            email,
            course_id: courseId,
            stripe_payment_id: paymentIntentId,
            stripe_customer_id: customerId,
            amount,
            currency: session.currency || 'eur',
            status: 'pending_registration',
            bonus_eligible: true,
            bonus_expires_at: bonusExpiresAt.toISOString(),
            upsells: upsells.length > 0 ? upsells : [],
            purchase_timestamp: new Date().toISOString(),
        })
        .select()
        .single()

    if (purchaseError) {
        console.error('❌ Error saving purchase:', purchaseError)
        return
    }

    console.log('✅ Purchase saved:', purchase.id)

    // Send purchase confirmation email
    try {
        await sendPurchaseConfirmation(email, courseId, purchase.id, true)
        console.log('📧 Confirmation email sent to:', email)
    } catch (emailError: any) {
        console.error('❌ Error sending email:', emailError.message)
        // Don't fail the webhook if email fails
    }
}

async function sendPurchaseConfirmation(
    email: string,
    courseId: string,
    purchaseId: string,
    bonusEligible: boolean
) {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!resendApiKey) {
        console.warn('⚠️ RESEND_API_KEY not set, skipping email')
        return
    }

    // Get tier info
    const tierInfo = getTierInfo(courseId)

    // Personalized message
    const message = getPersonalizedMessage(courseId, bonusEligible)

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'VOX LUX Strategy <noreply@voxlux.com>',
            to: email,
            subject: `✅ Pagamento Confermato - ${tierInfo.name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d4af37;">🎉 Benvenuto in VOX LUX!</h1>
          
          <p>Ciao!</p>
          
          <p>${message}</p>
          
          ${bonusEligible
                    ? `
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 20px 0;">
              <strong>🎁 BONUS 24H ATTIVO!</strong><br>
              Hai 24 ore per creare il tuo account e ricevere: <strong>${tierInfo.bonus}</strong>
            </div>
          `
                    : ''
                }
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📝 Prossimi Passi:</h3>
            <ol>
              <li>Crea il tuo account su <a href="https://voxlux.com/signup?email=${encodeURIComponent(email)}">voxlux.com/signup</a></li>
              <li>Accedi alla tua Dashboard personale</li>
              <li>Inizia il tuo percorso di ascensione!</li>
            </ol>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Riepilogo Acquisto:<br>
            <strong>${tierInfo.name}</strong> - ${tierInfo.price}<br>
            ID Acquisto: ${purchaseId}
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

    const result = await response.json()
    console.log('📧 Email sent:', result.id)
}

function getTierInfo(courseId: string) {
    const tiers: Record<string, { name: string; price: string; bonus: string }> = {
        'matrice-1': {
            name: 'MATRICE I: Storytelling Strategy Master',
            price: '€597',
            bonus: '20 Template Storytelling Esclusivi',
        },
        'matrice-2': {
            name: 'MATRICE II: Vox Podcast Master',
            price: '€597',
            bonus: '10 Script AI Podcast Pronti all\'Uso',
        },
        'ascension-box': {
            name: 'ASCENSION BOX: The Singularity',
            price: '€997',
            bonus: 'Sessione 1-on-1 VIP + Contenuti Esclusivi',
        },
    }

    return tiers[courseId] || { name: 'VOX LUX Course', price: '€---', bonus: 'Bonus Speciale' }
}

function getPersonalizedMessage(courseId: string, bonusEligible: boolean): string {
    const messages: Record<string, string> = {
        'matrice-1': `
      <strong>🎨 Congratulazioni per aver sbloccato MATRICE I!</strong><br><br>
      
      Hai appena iniziato il percorso più trasformativo per padroneggiare lo <strong>storytelling strategico</strong>.
      Non stai solo acquistando un corso, stai acquisendo un <strong>superpotere</strong>: la capacità di influenzare,
      ispirare e trasformare attraverso le parole.<br><br>
      
      I 10 Mondi della Matrice ti aspettano. Preparati a scoprire una nuova dimensione della comunicazione.
    `,
        'matrice-2': `
      <strong>🎙️ Congratulazioni per aver sbloccato MATRICE II!</strong><br><br>
      
      Hai scelto il percorso per diventare un <strong>Podcast Master</strong> con l'AI Voice Cloning.
      Questa è una skill <strong>monetizzabile immediatamente</strong> e che ti distinguerà nel mercato.<br><br>
      
      Preparati a clonare la tua voce, creare contenuti professionali e scalare la tua presenza vocale
      senza limiti di tempo o produzione.
    `,
        'ascension-box': `
      <strong>👑 Congratulazioni per aver sbloccato la SINGOLARITÀ!</strong><br><br>
      
      Hai scelto il massimo. L'<strong>ASCENSION BOX</strong> ti garantisce accesso completo a TUTTE le risorse
      VOX LUX, più contenuti esclusivi che nessun altro potrà mai vedere.<br><br>
      
      Sei ora parte dell'<strong>elite</strong>. Preparati per un'esperienza che va oltre ogni corso tradizionale.
      La tua ascensione inizia oggi.
    `,
    }

    return messages[courseId] || 'Benvenuto in VOX LUX Strategy! Il tuo percorso inizia ora.'
}
