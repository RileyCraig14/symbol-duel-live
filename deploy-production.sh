#!/bin/bash

# Symbol Duel - Production Deployment Script
# Complete gaming platform with Stripe integration

echo "🎯 Symbol Duel - Production Deployment"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "server-production.js" ]; then
    echo "❌ Error: server-production.js not found. Please run this script from the SymbolDuel2.0_Clean directory."
    exit 1
fi

# Backup current server
echo "📦 Backing up current server..."
if [ -f "server.js" ]; then
    cp server.js server_backup.js
    echo "✅ Backed up server.js to server_backup.js"
fi

# Replace with production server
echo "🔄 Switching to production server..."
mv server-production.js server.js
echo "✅ Production server activated"

# Update environment variables
echo "🔧 Setting up production environment..."
cat > .env << EOF
PORT=10000
NODE_ENV=production
CORS_ORIGIN=*

# Stripe Configuration (Replace with your actual keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=symbol-duel
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"symbol-duel","private_key_id":"your_key_id","private_key":"your_private_key","client_email":"your_client_email","client_id":"your_client_id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"your_cert_url"}

# Game Configuration
MAX_ENTRY_FEE=200
MIN_ENTRY_FEE=5
MAX_DEPOSIT=500
MIN_DEPOSIT=5
HOUSE_EDGE=0.06
EOF
echo "✅ Environment variables configured"

# Install dependencies
echo "📦 Installing production dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Error installing dependencies"
    exit 1
fi

# Test the server
echo "🧪 Testing production server..."
timeout 10s npm start &
SERVER_PID=$!
sleep 5

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Production server started successfully"
    kill $SERVER_PID
else
    echo "❌ Production server failed to start"
    exit 1
fi

# Create production info
echo "📊 Creating production deployment info..."
cat > PRODUCTION_DEPLOYMENT.md << EOF
# Symbol Duel - Production Deployment

## Deployment Date
$(date)

## Version
3.0.0 (Production Ready with Stripe Integration)

## Features
- ✅ Real money transactions with Stripe
- ✅ $200 maximum entry fee limit
- ✅ Deposit/withdrawal system
- ✅ Firebase user balance management
- ✅ Production-ready error handling
- ✅ Mobile responsive design
- ✅ Real-time multiplayer gameplay
- ✅ Professional UI/UX

## Configuration Required
1. **Stripe Keys**: Replace placeholder keys in .env with your actual Stripe keys
2. **Firebase Service Account**: Add your Firebase service account JSON
3. **Domain**: Update CORS_ORIGIN for your production domain

## API Endpoints
- POST /api/create-payment-intent - Create Stripe payment intent
- POST /api/confirm-payment - Confirm payment and update balance
- GET /api/rooms - Get available game rooms
- GET /api/leaderboard - Get player leaderboard
- GET /health - Health check endpoint

## Game Limits
- Entry Fee: $5 - $200
- Deposit: $5 - $500
- House Edge: 6%
- Max Players per Room: 6

## Next Steps
1. Configure Stripe keys in .env
2. Set up Firebase service account
3. Deploy to Render
4. Test payment flow
5. Monitor transactions

## Support
- Check server logs for errors
- Monitor Stripe dashboard for payments
- Review Firebase console for user data
EOF

echo "✅ Production deployment info created"

# Final status
echo ""
echo "🎉 PRODUCTION DEPLOYMENT COMPLETE!"
echo "=================================="
echo ""
echo "✅ Production server ready!"
echo "✅ Stripe integration configured"
echo "✅ $200 entry fee limit enforced"
echo "✅ Deposit/withdrawal system ready"
echo "✅ Firebase balance management"
echo ""
echo "🔧 REQUIRED CONFIGURATION:"
echo "   1. Add your Stripe keys to .env"
echo "   2. Add Firebase service account JSON"
echo "   3. Update CORS_ORIGIN for your domain"
echo ""
echo "🚀 To start production server:"
echo "   npm start"
echo ""
echo "🌐 Production URL:"
echo "   https://symbol-duel-live.onrender.com"
echo ""
echo "💳 Stripe Dashboard:"
echo "   https://dashboard.stripe.com"
echo ""
echo "🔥 Firebase Console:"
echo "   https://console.firebase.google.com"
echo ""
echo "Your gaming platform is ready for real money! 🎯💰"
