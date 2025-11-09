# PayFast Integration Guide

## Overview

This project now integrates **PayFast** for recurring donations and **Yoco** for one-time donations. PayFast handles subscription-based payments while Yoco provides a seamless one-time payment experience.

---

## 🔑 Key Components

### Payment Gateways

1. **Yoco** - One-time donations
   - Used for single donations
   - Instant payment processing
   - Credit/debit card payments

2. **PayFast** - Recurring donations
   - Monthly subscription payments
   - Automated recurring billing
   - South African payment gateway

---

## 📁 File Structure

### Frontend

```
client/src/
├── services/
│   ├── yoco.ts              # Yoco payment service (one-time)
│   └── payfast.ts           # PayFast payment service (recurring)
├── pages/
│   ├── DonationSuccess.tsx  # Payment success page
│   └── DonationCancelled.tsx # Payment cancellation page
├── components/
│   └── DonationSection.tsx  # Main donation form
└── config/
    └── environment.ts       # Environment configuration
```

### Backend

```
server/
├── routes.ts                # API endpoints
├── payfast-utils.ts         # PayFast utilities (signature validation)
└── storage.ts               # Database operations
```

---

## ⚙️ Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# PayFast Configuration
PAYFAST_MERCHANT_ID=10000100              # Sandbox: 10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a        # Sandbox: 46f0cd694581a
PAYFAST_PASSPHRASE=your_passphrase        # Optional but recommended
PAYFAST_MODE=sandbox                      # or 'live' for production

# Yoco Configuration (existing)
YOCO_PUBLIC_KEY=pk_test_5d0d5f771WOYrd3899d4
YOCO_SECRET_KEY=sk_test_your_secret_key
```

### Frontend Configuration

Update `client/src/config/environment.ts`:

```typescript
const config = {
  development: {
    PAYFAST_MERCHANT_ID: '10000100',
    PAYFAST_MERCHANT_KEY: '46f0cd694581a',
    PAYFAST_MODE: 'sandbox',
    // ... other config
  },
  production: {
    PAYFAST_MERCHANT_ID: 'your_live_merchant_id',
    PAYFAST_MERCHANT_KEY: 'your_live_merchant_key',
    PAYFAST_MODE: 'live',
    // ... other config
  }
}
```

---

## 🔄 How It Works

### One-Time Donations (Yoco)

1. User selects "Give Once"
2. Enters donation amount and details
3. Clicks "Donate Now"
4. Yoco popup appears for card details
5. Payment processed immediately
6. Success message displayed

### Recurring Donations (PayFast)

1. User selects "Give Monthly"
2. Enters donation amount and details
3. Clicks "Donate Monthly"
4. User redirected to PayFast payment page
5. Completes payment on PayFast
6. Redirected back to success page
7. PayFast sends ITN (Instant Transaction Notification) to backend

---

## 🔌 API Endpoints

### PayFast Endpoints

#### 1. Generate Signature
```
POST /api/payfast/generate-signature
```
Generates MD5 signature for PayFast form submission.

**Request Body:**
```json
{
  "merchant_id": "10000100",
  "merchant_key": "46f0cd694581a",
  "amount": "315.00",
  "item_name": "Recurring Donation",
  // ... other PayFast fields
}
```

**Response:**
```json
{
  "signature": "generated_md5_hash"
}
```

#### 2. ITN Callback (PayFast → Server)
```
POST /api/payfast/notify
```
Receives payment notifications from PayFast.

**PayFast sends:**
- Payment status
- Amount
- Subscription token
- Donor details

**Process:**
1. Validates signature
2. Validates IP address
3. Creates/updates donation record
4. Responds with "OK"

#### 3. Cancel Subscription
```
POST /api/payfast/cancel-subscription
```

**Request Body:**
```json
{
  "token": "subscription_token"
}
```

#### 4. Get Subscription Status
```
GET /api/payfast/subscription-status/:token
```

**Response:**
```json
{
  "subscriptionId": "token",
  "status": "active",
  "amount": "315.00",
  "frequency": "monthly",
  "nextPaymentDate": "2025-11-22T00:00:00.000Z",
  "donorName": "John Doe",
  "donorEmail": "john@example.com"
}
```

---

## 🗄️ Database Schema

### Updated Donations Table

```sql
donations {
  id: uuid
  amount: decimal
  currency: varchar(3)
  donorName: text
  donorEmail: text
  projectId: uuid
  paymentMethod: varchar(50)  -- 'payfast' or 'card'
  status: varchar(20)
  
  -- NEW: Recurring payment fields
  isRecurring: boolean
  subscriptionId: text         -- PayFast token
  frequency: varchar(20)       -- 'monthly', 'quarterly', etc.
  nextPaymentDate: timestamp
  subscriptionStatus: varchar(20)  -- 'active', 'cancelled', etc.
  
  createdAt: timestamp
}
```

---

## 🧪 Testing

### PayFast Sandbox

1. **Merchant ID:** `10000100`
2. **Merchant Key:** `46f0cd694581a`
3. **Test URL:** `https://sandbox.payfast.co.za/eng/process`

### Test Cards

PayFast sandbox accepts any card details. Use:
- **Card Number:** Any valid format (e.g., 4111111111111111)
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### Testing ITN (Instant Transaction Notification)

PayFast will POST to your `notify_url`. To test locally:

1. Use **ngrok** or similar to expose localhost:
   ```bash
   ngrok http 3000
   ```

2. Update `notify_url` in environment config:
   ```typescript
   notify_url: 'https://your-ngrok-url.ngrok.io/api/payfast/notify'
   ```

3. Complete a test payment on PayFast sandbox

4. Monitor server logs for ITN callback

---

## 🔒 Security

### Signature Validation

PayFast uses MD5 signatures to verify authenticity:

```typescript
// Server generates signature
const signature = generatePayFastSignature(data, passphrase);

// Server validates ITN
const isValid = validatePayFastSignature(receivedData, passphrase);
```

### IP Validation

PayFast sends ITN from specific IPs:
- `www.payfast.co.za`
- `sandbox.payfast.co.za`
- `w1w.payfast.co.za`
- `w2w.payfast.co.za`

The backend validates the source IP for additional security.

---

## 🚀 Deployment Checklist

### Before Going Live

- [ ] Replace sandbox credentials with live credentials
- [ ] Update `PAYFAST_MODE` to `'live'`
- [ ] Set up SSL/HTTPS for all callback URLs
- [ ] Test ITN callback with live endpoint
- [ ] Configure passphrase in PayFast merchant account
- [ ] Update return/cancel URLs to production domain
- [ ] Test subscription cancellation flow
- [ ] Set up monitoring for failed payments

### Production URLs

```typescript
// Production environment config
production: {
  PAYFAST_MERCHANT_ID: 'your_live_merchant_id',
  PAYFAST_MERCHANT_KEY: 'your_live_merchant_key',
  PAYFAST_MODE: 'live',
  SITE_URL: 'https://yourdomain.com',
  API_BASE_URL: 'https://api.yourdomain.com/api'
}
```

---

## 📊 Monitoring & Logging

### What to Monitor

1. **Payment Success Rate**
   - Track successful vs failed payments
   - Monitor by payment method

2. **ITN Processing**
   - Log all ITN callbacks
   - Alert on signature validation failures
   - Track response times

3. **Subscription Metrics**
   - Active subscriptions count
   - Churn rate
   - Average donation amount

### Example Logging

```typescript
// Server logs ITN
console.log('📬 Received PayFast ITN:', {
  payment_status: data.payment_status,
  token: data.token,
  amount: data.amount_gross
});

// Log signature validation
console.log(isValid ? '✅ Valid signature' : '❌ Invalid signature');
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Signature Mismatch
**Problem:** PayFast rejects form submission or ITN validation fails

**Solution:**
- Ensure all fields are URL-encoded correctly
- Don't include empty or null values in signature
- Check passphrase matches PayFast dashboard
- Verify field order is alphabetical

#### 2. ITN Not Received
**Problem:** Payment succeeds but server doesn't get notified

**Solution:**
- Check `notify_url` is accessible from internet
- Verify SSL certificate is valid
- Check firewall/security settings
- Test with ngrok in development

#### 3. Duplicate Donations
**Problem:** Same payment creates multiple donation records

**Solution:**
- Check for unique `subscriptionId` before creating
- Use database transactions
- Implement idempotency checks

#### 4. Yoco SDK Not Loading
**Problem:** "Payment system unavailable" error

**Solution:**
- Check Yoco public key is correct
- Verify internet connection
- Check browser console for errors
- Ensure Yoco script is loaded in HTML

---

## 📚 References

- [PayFast Documentation](https://developers.payfast.co.za/documentation/)
- [PayFast Sandbox Testing](https://developers.payfast.co.za/documentation/#sandbox_testing)
- [Yoco Documentation](https://developer.yoco.com/online/getting-started)

---

## 💡 Best Practices

1. **Always use HTTPS** for production
2. **Validate all inputs** on both frontend and backend
3. **Log all payment transactions** for auditing
4. **Test thoroughly** in sandbox before going live
5. **Monitor payment success rates** and set up alerts
6. **Keep credentials secure** using environment variables
7. **Implement retry logic** for failed ITN processing
8. **Provide clear user feedback** for all payment states

---

## 🔄 Migration from Existing System

If you're migrating from another payment system:

1. **Keep old payment method active** during transition
2. **Test new integration** thoroughly in sandbox
3. **Run both systems in parallel** initially
4. **Monitor metrics** closely
5. **Gradually migrate users** to new system
6. **Maintain historical payment records**

---

## Support

For PayFast support:
- Email: support@payfast.co.za
- Phone: +27 21 469 0276

For Yoco support:
- Email: support@yoco.com
- Website: https://support.yoco.com
