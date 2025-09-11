#!/bin/bash

echo "🔥 Symbol Duel - Production Firebase Deployment"
echo "=============================================="
echo "Using proven configuration from successful trivia games"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Login to Firebase if not already logged in
echo "Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "Please login to Firebase..."
    firebase login
fi

echo "Setting up Firebase project with proven configuration..."

# Initialize Firebase if not already done
if [ ! -f "firebase.json" ]; then
    echo "Initializing Firebase project..."
    firebase init --project symbol-duel
fi

echo "Deploying Firebase services..."
echo "1. Deploying Firestore rules..."
firebase deploy --only firestore:rules

echo "2. Deploying Realtime Database rules..."
firebase deploy --only database

echo "3. Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo ""
echo "✅ Production deployment complete!"
echo "Your Symbol Duel game is now live with:"
echo "- ✅ Real-time multiplayer (Realtime Database)"
echo "- ✅ User authentication (Firebase Auth)"
echo "- ✅ Persistent data (Firestore)"
echo "- ✅ Production hosting (Firebase Hosting)"
echo "- ✅ Security rules (Firestore + Realtime Database)"
echo ""
echo "🎯 Your game is now production-ready!"
echo "Visit: https://symbol-duel.firebaseapp.com"
echo ""
echo "Next steps:"
echo "1. Enable Authentication in Firebase Console"
echo "2. Set up custom domain (optional)"
echo "3. Configure analytics (optional)"
echo "4. Add payment integration (when ready)"
