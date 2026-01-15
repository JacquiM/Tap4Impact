# PayFast Integration - Code Examples

## Frontend Usage Examples

### 1. Creating a Recurring Payment

```typescript
import { payFastService } from '@/services/payfast';

// Prepare donor information
const donorInfo = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '0821234567' // Optional
};

// Create recurring payment form data
const formData = await payFastService.createRecurringPayment(
  315.00,          // Amount in ZAR
  'monthly',       // Frequency: 'monthly' | 'quarterly' | 'biannually' | 'annual'
  donorInfo,
  'Monthly donation to Tap4Impact' // Description
);

// Submit to PayFast
payFastService.submitPayment(formData);
// User will be redirected to PayFast payment page
```

### 2. Checking Subscription Status

```typescript
import { payFastService } from '@/services/payfast';

// Get subscription details
const status = await payFastService.getSubscriptionStatus('subscription_token_here');

console.log(status);
// {
//   subscriptionId: "abc123",
//   status: "active",
//   amount: "315.00",
//   frequency: "monthly",
//   nextPaymentDate: "2025-11-22T00:00:00.000Z",
//   donorName: "John Doe",
//   donorEmail: "john@example.com"
// }
```

### 3. Cancelling a Subscription

```typescript
import { payFastService } from '@/services/payfast';

const success = await payFastService.cancelSubscription('subscription_token_here');

if (success) {
  console.log('Subscription cancelled successfully');
} else {
  console.error('Failed to cancel subscription');
}
```

---

## Backend Usage Examples

### 1. Generating PayFast Signature

```typescript
import { generatePayFastSignature } from './payfast-utils';

const data = {
  merchant_id: '10000100',
  merchant_key: '46f0cd694581a',
  amount: '315.00',
  item_name: 'Recurring Donation',
  subscription_type: '1'
};

const passphrase = 'your_secret_passphrase'; // Optional

const signature = generatePayFastSignature(data, passphrase);
console.log('Signature:', signature);
```

### 2. Validating ITN Signature

```typescript
import { validatePayFastSignature } from './payfast-utils';

// Data received from PayFast ITN
const itnData = {
  merchant_id: '10000100',
  merchant_key: '46f0cd694581a',
  amount_gross: '315.00',
  signature: 'received_signature_from_payfast',
  // ... other fields
};

const isValid = validatePayFastSignature(itnData, passphrase);

if (isValid) {
  // Process payment
  console.log('Valid PayFast ITN');
} else {
  console.error('Invalid signature - possible fraud attempt');
}
```

### 3. Processing ITN Callback

```typescript
app.post('/api/payfast/notify', async (req, res) => {
  try {
    const pfData = req.body;
    
    // 1. Validate signature
    if (!validatePayFastSignature(pfData, process.env.PAYFAST_PASSPHRASE)) {
      return res.status(400).send('Invalid signature');
    }
    
    // 2. Validate IP
    if (!validatePayFastIP(req.ip)) {
      return res.status(403).send('Invalid IP');
    }
    
    // 3. Process payment
    if (pfData.payment_status === 'COMPLETE') {
      await storage.createDonation({
        amount: pfData.amount_gross,
        currency: 'ZAR',
        donorEmail: pfData.email_address,
        isRecurring: true,
        subscriptionId: pfData.token,
        // ... other fields
      });
    }
    
    // 4. Acknowledge receipt
    res.status(200).send('OK');
  } catch (error) {
    console.error('ITN processing error:', error);
    res.status(500).send('Error');
  }
});
```

### 4. Creating Donation with Recurring Info

```typescript
import { storage } from './storage';

// Create a recurring donation record
const donation = await storage.createDonation({
  amount: '315.00',
  currency: 'ZAR',
  donorName: 'John Doe',
  donorEmail: 'john@example.com',
  paymentMethod: 'payfast',
  isRecurring: true,
  subscriptionId: 'payfast_token_abc123',
  frequency: 'monthly',
  nextPaymentDate: new Date('2025-11-22'),
  subscriptionStatus: 'active'
});
```

### 5. Calculating Next Payment Date

```typescript
import { calculateNextPaymentDate } from './payfast-utils';

const today = new Date();

// Monthly
const nextMonthly = calculateNextPaymentDate(today, 'monthly');
console.log('Next monthly payment:', nextMonthly);

// Quarterly (3 months)
const nextQuarterly = calculateNextPaymentDate(today, 'quarterly');
console.log('Next quarterly payment:', nextQuarterly);

// Annual
const nextAnnual = calculateNextPaymentDate(today, 'annual');
console.log('Next annual payment:', nextAnnual);
```

---

## Component Integration Examples

### 1. Donation Button with Conditional Logic

```tsx
import { payFastService } from '@/services/payfast';

const DonationButton = () => {
  const [donationType, setDonationType] = useState<'monthly' | 'once'>('monthly');
  const [amount, setAmount] = useState(315);

  const handleDonate = async () => {
    const donorInfo = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    if (donationType === 'monthly') {
      // Use PayFast for recurring
      const formData = await payFastService.createRecurringPayment(
        amount,
        'monthly',
        donorInfo
      );
      payFastService.submitPayment(formData);
    } else {
      // Use PayFast for one-time
      await payFastService.processSinglePayment(
        amount,
        donorInfo,
        'Tap4Impact Once-off Donation'
      );
      console.log('Redirected to PayFast for single payment!');
    }
  };

  return (
    <div>
      <button onClick={() => setDonationType('monthly')}>
        Give Monthly (PayFast)
      </button>
      <button onClick={() => setDonationType('once')}>
        Give Once (PayFast)
      </button>
      
      <button onClick={handleDonate}>
        Donate {donationType === 'monthly' ? 'Monthly' : 'Now'}
      </button>
    </div>
  );
};
```

### 2. Subscription Management Component

```tsx
import { useState, useEffect } from 'react';
import { payFastService } from '@/services/payfast';

const SubscriptionManager = ({ subscriptionToken }: { subscriptionToken: string }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await payFastService.getSubscriptionStatus(subscriptionToken);
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [subscriptionToken]);

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      const success = await payFastService.cancelSubscription(subscriptionToken);
      
      if (success) {
        alert('Subscription cancelled successfully');
        setStatus({ ...status, subscriptionStatus: 'cancelled' });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!status) return <div>No subscription found</div>;

  return (
    <div className="p-4 border rounded">
      <h3>Your Subscription</h3>
      <p>Amount: R{status.amount}</p>
      <p>Frequency: {status.frequency}</p>
      <p>Status: {status.subscriptionStatus}</p>
      <p>Next Payment: {new Date(status.nextPaymentDate).toLocaleDateString()}</p>
      
      {status.subscriptionStatus === 'active' && (
        <button onClick={handleCancel} className="mt-4 btn-danger">
          Cancel Subscription
        </button>
      )}
    </div>
  );
};
```

---

## Testing Examples

### 1. Unit Test - Signature Generation

```typescript
import { generatePayFastSignature } from '../payfast-utils';

describe('PayFast Signature Generation', () => {
  it('should generate correct MD5 signature', () => {
    const data = {
      merchant_id: '10000100',
      merchant_key: '46f0cd694581a',
      amount: '100.00',
      item_name: 'Test Product'
    };
    
    const signature = generatePayFastSignature(data);
    
    expect(signature).toBeTruthy();
    expect(signature).toHaveLength(32); // MD5 hash length
  });

  it('should exclude signature field from calculation', () => {
    const data = {
      merchant_id: '10000100',
      amount: '100.00',
      signature: 'old_signature'
    };
    
    const signature = generatePayFastSignature(data);
    
    expect(signature).not.toBe('old_signature');
  });
});
```

### 2. Integration Test - ITN Processing

```typescript
import request from 'supertest';
import { app } from '../index';

describe('PayFast ITN Endpoint', () => {
  it('should process valid ITN', async () => {
    const itnData = {
      merchant_id: '10000100',
      merchant_key: '46f0cd694581a',
      payment_status: 'COMPLETE',
      amount_gross: '315.00',
      email_address: 'test@example.com',
      token: 'test_token_123'
    };
    
    // Add valid signature
    itnData.signature = generatePayFastSignature(itnData);
    
    const response = await request(app)
      .post('/api/payfast/notify')
      .send(itnData);
    
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });

  it('should reject invalid signature', async () => {
    const itnData = {
      merchant_id: '10000100',
      payment_status: 'COMPLETE',
      signature: 'invalid_signature'
    };
    
    const response = await request(app)
      .post('/api/payfast/notify')
      .send(itnData);
    
    expect(response.status).toBe(400);
  });
});
```

---

## Environment Setup Examples

### 1. Development Environment

```bash
# .env.development
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_MODE=sandbox
PAYFAST_PASSPHRASE=

# Yoco
YOCO_PUBLIC_KEY=pk_test_5d0d5f771WOYrd3899d4
YOCO_SECRET_KEY=sk_test_your_key

# URLs
SITE_URL=http://localhost:5173
API_BASE_URL=http://localhost:3000/api
```

### 2. Production Environment

```bash
# .env.production
PAYFAST_MERCHANT_ID=your_live_merchant_id
PAYFAST_MERCHANT_KEY=your_live_merchant_key
PAYFAST_MODE=live
PAYFAST_PASSPHRASE=your_secure_passphrase

# Yoco
YOCO_PUBLIC_KEY=pk_live_your_live_key
YOCO_SECRET_KEY=sk_live_your_secret_key

# URLs
SITE_URL=https://yourdomain.com
API_BASE_URL=https://api.yourdomain.com/api
```

---

## Webhook/ITN Payload Examples

### PayFast ITN Payload

```json
{
  "m_payment_id": "unique_payment_id",
  "pf_payment_id": "123456",
  "payment_status": "COMPLETE",
  "item_name": "Recurring Donation",
  "item_description": "Monthly donation to Tap4Impact",
  "amount_gross": "315.00",
  "amount_fee": "-7.25",
  "amount_net": "307.75",
  "custom_str1": "",
  "custom_str2": "",
  "custom_str3": "",
  "custom_str4": "",
  "custom_str5": "",
  "custom_int1": "",
  "custom_int2": "",
  "custom_int3": "",
  "custom_int4": "",
  "custom_int5": "",
  "name_first": "John",
  "name_last": "Doe",
  "email_address": "john@example.com",
  "merchant_id": "10000100",
  "token": "subscription_token_abc123",
  "billing_date": "2025-11-22",
  "signature": "generated_md5_signature"
}
```

### Expected Response

```
OK
```

---

## Error Handling Examples

### 1. PayFast Service Error Handling

```typescript
try {
  const formData = await payFastService.createRecurringPayment(
    amount,
    'monthly',
    donorInfo
  );
  payFastService.submitPayment(formData);
} catch (error) {
  if (error instanceof Error) {
    console.error('PayFast error:', error.message);
    
    // Show user-friendly message
    toast({
      title: 'Payment Error',
      description: 'Unable to process your payment. Please try again.',
      variant: 'destructive'
    });
  }
}
```

### 2. Backend ITN Error Handling

```typescript
app.post('/api/payfast/notify', async (req, res) => {
  try {
    // Process ITN
    const result = await processPayFastITN(req.body);
    res.status(200).send('OK');
  } catch (error) {
    // Log error but still acknowledge receipt
    console.error('ITN processing error:', error);
    
    // Store failed ITN for manual review
    await storeFailedITN(req.body, error);
    
    // Still acknowledge to prevent retries
    res.status(200).send('OK');
  }
});
```

---

## Monitoring Examples

### 1. Log Successful Payments

```typescript
console.log('💰 Payment received:', {
  type: 'recurring',
  amount: data.amount_gross,
  donor: data.email_address,
  token: data.token,
  timestamp: new Date().toISOString()
});
```

### 2. Track Subscription Metrics

```typescript
// Get active subscriptions count
const activeCount = await db
  .select({ count: sql<number>`count(*)` })
  .from(donations)
  .where(eq(donations.subscriptionStatus, 'active'));

console.log('📊 Active subscriptions:', activeCount);
```

---

## Best Practices

1. **Always validate signatures** - Never trust payment data without verification
2. **Use HTTPS in production** - Required for secure payment processing
3. **Log all ITN callbacks** - Essential for debugging and auditing
4. **Handle duplicates gracefully** - PayFast may send multiple ITN notifications
5. **Test thoroughly** - Use sandbox environment extensively before going live
6. **Monitor payment failures** - Set up alerts for failed transactions
7. **Keep credentials secure** - Never commit secrets to version control
8. **Provide user feedback** - Keep users informed throughout payment process
