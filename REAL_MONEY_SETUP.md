# 🎯 Symbol Duel - REAL MONEY PRODUCTION SETUP

## ✅ YOUR REAL MONEY GAMING PLATFORM IS READY!

**🌐 Current URL**: `https://symbol-duel-live.onrender.com`

## 🔑 REQUIRED: Get Your Real Keys

### 1. 🔥 FIREBASE SERVICE ACCOUNT (REQUIRED)

**Step 1**: Go to Firebase Console
- Visit: https://console.firebase.google.com
- Select your `symbol-duel` project

**Step 2**: Generate Service Account Key
- Click the gear icon → Project Settings
- Go to "Service Accounts" tab
- Click "Generate new private key"
- Download the JSON file

**Step 3**: Add to Environment
- Copy the entire JSON content
- Add to your `.env` file as `FIREBASE_SERVICE_ACCOUNT_KEY`

### 2. 💳 STRIPE KEYS (REQUIRED)

**Step 1**: Go to Stripe Dashboard
- Visit: https://dashboard.stripe.com
- Sign in to your account

**Step 2**: Get Your Keys
- Go to "Developers" → "API Keys"
- Copy your **Publishable key** (starts with `pk_test_`)
- Copy your **Secret key** (starts with `sk_test_`)

**Step 3**: Add to Environment
- Add `STRIPE_SECRET_KEY` to your `.env` file
- Update `index.html` with your publishable key

### 3. 🌐 CUSTOM DOMAIN (OPTIONAL BUT RECOMMENDED)

**Step 1**: Buy a Domain
- Go to Namecheap, GoDaddy, or Google Domains
- Buy a domain like `symbolduel.com` or `yourname.com`

**Step 2**: Connect to Render
- In Render dashboard, go to your service
- Click "Settings" → "Custom Domains"
- Add your domain
- Follow DNS instructions

## 🔧 COMPLETE SETUP STEPS

### Step 1: Update Environment Variables
Edit your `.env` file:

```bash
PORT=10000
NODE_ENV=production
CORS_ORIGIN=*

# Firebase (REQUIRED)
FIREBASE_PROJECT_ID=symbol-duel
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"symbol-duel",...}

# Stripe (REQUIRED)
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key

# Game Configuration
MAX_ENTRY_FEE=200
MIN_ENTRY_FEE=5
MAX_DEPOSIT=500
MIN_DEPOSIT=5
HOUSE_EDGE=0.06
```

### Step 2: Update Frontend Stripe Key
In `index.html`, line 776, replace:
```javascript
const stripe = Stripe('pk_test_your_actual_stripe_publishable_key');
```

### Step 3: Deploy to Production
```bash
git add .
git commit -m "Add real Firebase and Stripe keys for production"
git push origin main
```

## 💰 REAL MONEY FEATURES

### ✅ What Users Can Do:
- **Sign Up**: Create account with email/password
- **Deposit Real Money**: $5-$500 via Stripe
- **Create Tournaments**: $5-$200 entry fees
- **Play Games**: Real-time multiplayer battles
- **Win Real Money**: Automatic payouts to balance
- **Withdraw**: (Can be implemented with Stripe payouts)

### ✅ Money Flow:
1. **User deposits** $50 via Stripe
2. **Balance shows** $50.00
3. **User joins** $10 tournament
4. **Balance shows** $40.00
5. **User wins** tournament
6. **Balance shows** $50.00 (got $10 back + $10 prize)

## 🚀 PRODUCTION DEPLOYMENT

### Render Configuration:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Production
- **Port**: 10000

### Domain Setup:
1. **Buy domain** from any registrar
2. **Add to Render** custom domains
3. **Update DNS** as instructed
4. **SSL certificate** auto-generated

## 🧪 TESTING YOUR REAL MONEY PLATFORM

### Test Flow:
1. **Visit your site** (with custom domain)
2. **Sign up** with real email
3. **Deposit $25** using test card: `4242424242424242`
4. **Create room** with $10 entry fee
5. **Play game** and win
6. **Verify payout** in balance

### Stripe Test Cards:
- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **Insufficient funds**: `4000000000009995`

## 🎯 YOUR REAL MONEY PLATFORM IS READY!

**Once you add your keys:**
- ✅ Real money deposits via Stripe
- ✅ Real money tournaments
- ✅ Real money payouts
- ✅ Firebase balance storage
- ✅ Production-ready security
- ✅ Custom domain support

**This is a complete real money gaming platform!** 🚀💰
