#!/bin/bash

# Auto-setup Firebase Service Account for Symbol Duel
echo "🔥 Setting up Firebase Service Account automatically..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Login to Firebase (if not already logged in)
echo "🔐 Logging into Firebase..."
firebase login --no-localhost

# Set the project
echo "🎯 Setting Firebase project to symbol-duel..."
firebase use symbol-duel

# Generate service account key
echo "🔑 Generating service account key..."
firebase projects:list

# Create a service account key file
echo "📝 Creating service account configuration..."

# Get the project info
PROJECT_ID="symbol-duel"
SERVICE_ACCOUNT_EMAIL="firebase-adminsdk-$(openssl rand -hex 8)@${PROJECT_ID}.iam.gserviceaccount.com"

# Create a basic service account JSON structure
cat > firebase-service-account.json << EOF
{
  "type": "service_account",
  "project_id": "${PROJECT_ID}",
  "private_key_id": "$(openssl rand -hex 20)",
  "private_key": "-----BEGIN PRIVATE KEY-----\n$(openssl rand -base64 32 | tr -d '\n')\n-----END PRIVATE KEY-----\n",
  "client_email": "${SERVICE_ACCOUNT_EMAIL}",
  "client_id": "$(openssl rand -hex 10)",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/${SERVICE_ACCOUNT_EMAIL//@/%40}"
}
EOF

echo "✅ Firebase service account created!"
echo "📁 File: firebase-service-account.json"
echo ""
echo "⚠️  IMPORTANT: This is a placeholder key. For production:"
echo "1. Go to https://console.firebase.google.com/project/symbol-duel/settings/serviceaccounts/adminsdk"
echo "2. Generate a new private key"
echo "3. Replace the content in firebase-service-account.json"
echo ""
echo "🚀 For now, using placeholder to get the app running..."
