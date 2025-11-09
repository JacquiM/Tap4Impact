# Yoco Payment Integration Setup

This guide explains how to set up Yoco's JavaScript popup integration in your Tap4Impact project.

## 🚀 What's Been Implemented

✅ **Yoco SDK Integration** - JavaScript popup payments  
✅ **Backend Payment Processing** - Secure payment creation and verification  
✅ **Frontend Payment Form** - Updated donation component with Yoco  
✅ **Environment Configuration** - Proper key management  
✅ **Error Handling** - Comprehensive error states and user feedback  
✅ **Loading States** - User-friendly payment processing indicators  

## 📋 Prerequisites

1. **Yoco Account** - Sign up at [https://developer.yoco.com/](https://developer.yoco.com/)
2. **Database** - PostgreSQL database for storing donations
3. **API Keys** - Yoco public and secret keys

## 🔧 Setup Instructions

### 1. Get Your Yoco API Keys

1. Log into your [Yoco Dashboard](https://dashboard.yoco.com/)
2. Navigate to **Settings** → **API Keys**
3. Copy your **Public Key** (starts with `pk_`)
4. Copy your **Secret Key** (starts with `sk_`)

### 2. Configure Environment Variables

Create a `.env` file in the project root with your actual values:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/tap4impact

# Yoco Payment Integration
YOCO_SECRET_KEY=sk_test_your_actual_secret_key_here
YOCO_PUBLIC_KEY=pk_test_your_actual_public_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Update Environment Configuration

Edit `client/src/config/environment.ts` and replace the Yoco keys:

```typescript
const config: Record<string, EnvironmentConfig> = {
  development: {
    // ... other config
    YOCO_PUBLIC_KEY: 'pk_test_your_actual_public_key_here',
  },
  production: {
    // ... other config
    YOCO_PUBLIC_KEY: 'pk_live_your_actual_live_key_here',
  }
};
```

### 4. Database Setup

The project uses PostgreSQL with Drizzle ORM. You can either:

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database
createdb tap4impact

# Update .env with your local connection string
DATABASE_URL=postgresql://username:password@localhost:5432/tap4impact
```

**Option B: Cloud Database (Recommended)**
- Use services like [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)
- Copy the connection string to your `.env` file

### 5. Run Database Migrations

```bash
npm run db:push
```

### 6. Start the Development Server

```bash
npm run dev
```

## 🧪 Testing Payments

### Test Mode
- Use the test public key: `pk_test_ed3c54a6gOol69qa7f45`
- Use these test card numbers:
  - **Success**: `4242424242424242`
  - **Decline**: `4000000000000002`
  - **Insufficient Funds**: `4000000000009995`

### Test Workflow
1. Fill in donor information
2. Select donation amount
3. Click "Donate Now" or "Donate Monthly"
4. Yoco popup appears
5. Enter test card details
6. Payment processes
7. Success/error feedback displays

## 🔐 Security Notes

- ✅ **Secret keys are server-side only** - Never expose in frontend
- ✅ **Payment verification** - All payments verified on backend
- ✅ **HTTPS required** - Use SSL certificates in production
- ✅ **Input validation** - All payment data validated
- ✅ **Error logging** - Payment errors logged for debugging

## 🏗️ Code Structure

```
├── client/src/
│   ├── services/yoco.ts           # Yoco payment service
│   ├── components/DonationSection.tsx  # Updated donation form
│   └── config/environment.ts     # Environment configuration
├── server/
│   ├── routes.ts                 # Yoco API endpoints
│   └── index.ts                  # Server setup
└── shared/
    └── schema.ts                 # Database schema with donations
```

## 🔀 Payment Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Yoco

    User->>Frontend: Fill donation form
    User->>Frontend: Click "Donate"
    Frontend->>Backend: POST /api/yoco/create-payment
    Backend->>Yoco: Create payment session
    Yoco->>Backend: Return paymentId
    Backend->>Frontend: Return paymentId
    Frontend->>Yoco: Show payment popup
    User->>Yoco: Enter card details
    Yoco->>Frontend: Payment result
    Frontend->>Backend: POST /api/yoco/verify-payment
    Backend->>Yoco: Verify payment status
    Backend->>Backend: Create donation record
    Backend->>Frontend: Confirmation
    Frontend->>User: Success message
```

## 🐛 Troubleshooting

### Common Issues

**1. "Yoco SDK not available"**
- Ensure `<script src="https://js.yoco.com/sdk/v1/yoco-sdk.js"></script>` is in your HTML
- Check browser console for script loading errors

**2. "Failed to create payment"**
- Verify `YOCO_SECRET_KEY` in `.env`
- Check backend logs for API errors
- Ensure amount is in cents (multiply by 100)

**3. Database connection errors**
- Verify `DATABASE_URL` in `.env`
- Ensure database server is running
- Run `npm run db:push` to create tables

**4. CORS errors**
- Check API base URL in environment config
- Ensure backend and frontend are running on correct ports

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=yoco:*
```

## 🚀 Deployment

### Environment Variables for Production

```bash
# Production environment
NODE_ENV=production
DATABASE_URL=your_production_database_url
YOCO_SECRET_KEY=sk_live_your_live_secret_key
YOCO_PUBLIC_KEY=pk_live_your_live_public_key
```

### Deployment Checklist

- [ ] Switch to live Yoco keys
- [ ] Update environment configuration
- [ ] Set up production database
- [ ] Enable HTTPS
- [ ] Configure proper CORS
- [ ] Test payment flow thoroughly

## 📚 Additional Resources

- [Yoco Developer Documentation](https://developer.yoco.com/)
- [Yoco JavaScript SDK Reference](https://developer.yoco.com/docs/js-sdk)
- [Yoco Payment Testing Guide](https://developer.yoco.com/docs/testing)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console and server logs
3. Consult [Yoco's documentation](https://developer.yoco.com/)
4. Contact Yoco support for payment-related issues

---

**Note**: This implementation uses Yoco's JavaScript popup integration, which is their recommended method for secure, PCI-compliant payments without the complexity of full payment forms.
