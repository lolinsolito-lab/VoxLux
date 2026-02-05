# Stripe Webhook Edge Function

Handles Stripe webhook events for automated purchase processing.

## Deploy

```bash
supabase functions deploy stripe-webhook --no-verify-jwt
```

## Environment Variables

Set in Supabase Dashboard > Edge Functions > Secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Webhook URL

After deployment, use this URL in Stripe Dashboard:

```
https://[YOUR_PROJECT_REF].supabase.co/functions/v1/stripe-webhook
```

## Events Handled

- `checkout.session.completed` → Save purchase + send email
- `payment_intent.succeeded` → Log payment
- `customer.created` → Log customer

## Testing

```bash
stripe trigger checkout.session.completed
```
