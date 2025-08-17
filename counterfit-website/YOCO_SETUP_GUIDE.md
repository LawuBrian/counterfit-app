# YOCO Checkout API Integration Setup Guide

This guide will help you set up the YOCO Checkout API with webhooks for secure payment processing in your Counterfit app.

## Prerequisites

- YOCO merchant account
- YOCO API keys (public and secret)
- Deployed webhook endpoint (HTTPS required)

## Step 1: Environment Configuration

Add the following environment variables to your `.env.local` file:

```bash
# YOCO Payment Configuration
NEXT_PUBLIC_YOCO_PUBLIC_KEY=pk_test_your_public_key_here
YOCO_SECRET_KEY=sk_test_your_secret_key_here
YOCO_WEBHOOK_SECRET=whsec_your_webhook_secret_here
YOCO_WEBHOOK_URL=https://your-domain.com/api/webhooks/yoco
```

**Important Notes:**
- `NEXT_PUBLIC_YOCO_PUBLIC_KEY`: Used in frontend (safe to expose)
- `YOCO_SECRET_KEY`: Used in backend (keep secret)
- `YOCO_WEBHOOK_SECRET`: Will be provided after webhook registration
- `YOCO_WEBHOOK_URL`: Your deployed webhook endpoint

## Step 2: Deploy Your Webhook Endpoint

Your webhook endpoint is already implemented at `/api/webhooks/yoco/route.ts`. Deploy your application to make this endpoint accessible via HTTPS.

**Local Testing with ngrok:**
```bash
# Install ngrok
npm install -g ngrok

# Start your Next.js app
npm run dev

# In another terminal, expose your local server
ngrok http 3000

# Use the HTTPS URL provided by ngrok for testing
```

## Step 3: Register Your Webhook

After deploying your webhook endpoint, register it with YOCO:

### Option A: Use the Registration Script

```bash
# Set environment variables
export YOCO_SECRET_KEY=sk_test_your_secret_key_here
export YOCO_WEBHOOK_URL=https://your-domain.com/api/webhooks/yoco

# Run the registration script
node scripts/register-yoco-webhook.js
```

### Option B: Manual Registration

Make a POST request to `https://payments.yoco.com/api/webhooks`:

```bash
curl -X POST https://payments.yoco.com/api/webhooks \
  -H "Authorization: Bearer sk_test_your_secret_key_here" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/webhooks/yoco"}'
```

**Save the webhook secret** from the response and add it to your environment variables as `YOCO_WEBHOOK_SECRET`.

## Step 4: Payment Flow Implementation

### Frontend Checkout Process

1. **Create Order**: Use `/api/checkout` to create an order
2. **Create YOCO Checkout**: Use `/api/checkout/create-yoco` to create a YOCO checkout
3. **Redirect Customer**: Use the `redirectUrl` from the response to redirect to YOCO
4. **Handle Success/Cancel**: Configure success and cancel URLs

### Example Frontend Implementation

```typescript
// Create order first
const orderResponse = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});

const order = await orderResponse.json();

// Create YOCO checkout
const checkoutResponse = await fetch('/api/checkout/create-yoco', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: order.order.id,
    amount: order.order.totalAmount,
    customerEmail: user.email,
    customerName: user.name
  })
});

const checkout = await checkoutResponse.json();

// Redirect to YOCO
window.location.href = checkout.checkout.redirectUrl;
```

## Step 5: Webhook Event Handling

Your webhook endpoint automatically handles these events:

- `payment.succeeded`: Payment completed successfully
- `payment.failed`: Payment failed
- `checkout.completed`: Checkout completed (payment may still be processing)
- `refund.succeeded`: Refund completed successfully
- `refund.failed`: Refund failed

### Webhook Security Features

- **Signature Verification**: HMAC SHA256 with webhook secret
- **Timestamp Validation**: Prevents replay attacks (3-minute threshold)
- **Event Filtering**: Only processes events for your orders

## Step 6: Testing

### Test Mode
- Use test API keys (`pk_test_...`, `sk_test_...`)
- Test payments won't charge real money
- Webhooks will fire with test data

### Live Mode
- Use live API keys (`pk_live_...`, `sk_live_...`)
- Real payments will be processed
- Webhooks will fire with live data

## Step 7: Refund Processing

To process refunds, make a POST request to the refund endpoint:

```typescript
const refundResponse = await fetch(`https://payments.yoco.com/api/checkouts/${checkoutId}/refund`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOCO_CONFIG.secretKey}`,
    'Content-Type': 'application/json',
    'Idempotency-Key': `refund-${checkoutId}-${Date.now()}`
  },
  body: JSON.stringify({
    amount: refundAmount,
    reason: 'Customer request'
  })
});
```

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**
   - Verify webhook URL is accessible via HTTPS
   - Check webhook registration status
   - Ensure webhook secret is correctly set

2. **Signature Verification Fails**
   - Verify `YOCO_WEBHOOK_SECRET` is correct
   - Check webhook secret format (should start with `whsec_`)
   - Ensure raw request body is used for verification

3. **Payment Not Processing**
   - Verify API keys are correct
   - Check amount format (should be in cents for ZAR)
   - Ensure currency is supported

### Debug Logging

All API endpoints include comprehensive logging. Check your server logs for:
- Webhook events received
- Signature verification results
- Order status updates
- API call responses

## Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify webhook signatures** before processing events
3. **Use HTTPS** for all webhook endpoints
4. **Validate webhook timestamps** to prevent replay attacks
5. **Implement idempotency** for refund requests
6. **Log all webhook events** for debugging and audit

## Support

- YOCO API Documentation: [https://docs.yoco.com/](https://docs.yoco.com/)
- YOCO Support: [support@yoco.com](mailto:support@yoco.com)
- Check server logs for detailed error information

## Next Steps

After completing this setup:

1. Test the complete payment flow in test mode
2. Verify webhook events are being received
3. Test refund functionality
4. Switch to live mode when ready for production
5. Monitor webhook events and payment processing
6. Implement additional error handling as needed
