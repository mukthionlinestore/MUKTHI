# Razorpay Integration Setup Guide

## 🚀 Overview
This guide will help you set up Razorpay payment gateway integration in your e-commerce application.

## 📋 Prerequisites
1. A Razorpay account (sign up at https://razorpay.com)
2. Node.js and npm installed
3. Your e-commerce application running

## 🔧 Setup Steps

### 1. Create Razorpay Account
1. Go to https://razorpay.com
2. Sign up for a new account
3. Complete the verification process
4. Access your Razorpay Dashboard

### 2. Get API Keys
1. In your Razorpay Dashboard, go to **Settings** → **API Keys**
2. Generate a new API key pair
3. Copy the **Key ID** and **Key Secret**

### 3. Update Environment Variables
Add the following to your `backend/config.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

Replace `your_razorpay_key_id_here` and `your_razorpay_key_secret_here` with your actual Razorpay API keys.

### 4. Install Dependencies
The required packages have already been installed:
- Backend: `razorpay` package
- Frontend: `razorpay` package

### 5. Test the Integration

#### Test Mode
- Use Razorpay's test mode for development
- Test cards are available in the Razorpay documentation

#### Test Cards
Use these test cards for testing:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## 🔄 How It Works

### 1. Payment Flow
1. User selects "Razorpay" as payment method
2. Clicks "Place Order"
3. Razorpay payment modal opens
4. User enters payment details
5. Payment is processed and verified
6. Order is created and cart is cleared
7. User is redirected to order confirmation

### 2. Backend API Endpoints
- `POST /api/payment/create-razorpay-order` - Creates Razorpay order
- `POST /api/payment/verify-razorpay-payment` - Verifies payment signature

### 3. Frontend Components
- `RazorpayPayment.js` - Handles Razorpay integration
- Updated `Checkout.js` - Includes Razorpay as payment option

## 🛡️ Security Features

### 1. Payment Verification
- All payments are verified using HMAC SHA256 signature
- Prevents payment tampering and fraud

### 2. Server-Side Validation
- Payment verification happens on the backend
- Client-side data is validated before processing

### 3. Error Handling
- Comprehensive error handling for failed payments
- User-friendly error messages

## 🎨 Customization

### 1. Styling
The Razorpay modal can be customized by modifying the `options` object in `RazorpayPayment.js`:

```javascript
theme: {
  color: '#10B981' // Change to your brand color
}
```

### 2. Currency
Default currency is INR. To change, modify the `currency` prop:

```javascript
<RazorpayPayment
  currency="USD" // Change currency here
  // ... other props
/>
```

### 3. Payment Methods
Razorpay supports multiple payment methods:
- Credit/Debit Cards
- UPI
- Net Banking
- Wallets
- EMI

## 🚨 Important Notes

### 1. Production Setup
- Switch to live mode in Razorpay Dashboard
- Update API keys to live keys
- Test thoroughly before going live

### 2. Webhook Setup (Recommended)
For production, set up webhooks to handle payment status updates:
1. Go to Razorpay Dashboard → Webhooks
2. Add your webhook URL
3. Select events: `payment.captured`, `payment.failed`

### 3. Error Handling
- Always handle payment failures gracefully
- Provide clear error messages to users
- Log payment errors for debugging

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to load Razorpay"**
   - Check internet connection
   - Verify Razorpay script is loading

2. **"Payment verification failed"**
   - Check API keys are correct
   - Verify signature verification logic

3. **"Order creation failed"**
   - Check Razorpay account status
   - Verify API key permissions

### Debug Mode
Enable debug logging by adding to your backend:

```javascript
console.log('Razorpay order creation:', order);
console.log('Payment verification:', verificationResponse);
```

## 📞 Support

- **Razorpay Documentation**: https://razorpay.com/docs/
- **Razorpay Support**: support@razorpay.com
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-mode/

## ✅ Checklist

- [ ] Razorpay account created
- [ ] API keys generated
- [ ] Environment variables updated
- [ ] Dependencies installed
- [ ] Test payments working
- [ ] Error handling tested
- [ ] Production keys ready (when going live)

---

**Note**: Keep your API keys secure and never commit them to version control. Use environment variables for all sensitive data.
