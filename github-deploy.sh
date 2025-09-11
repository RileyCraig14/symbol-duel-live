#!/bin/bash
echo "🚀 Setting up GitHub repository..."

# Create a simple repository creation script
cat > create-repo.sh << 'INNER_EOF'
#!/bin/bash
echo "📋 GitHub Repository Setup Instructions:"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Repository name: SymbolDuel2.0_Complete"
echo "3. Description: Production-ready multiplayer trivia game with Firebase Auth and Stripe payments"
echo "4. Make it Public"
echo "5. Don't initialize with README (we already have one)"
echo "6. Click 'Create repository'"
echo ""
echo "7. After creating, run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/SymbolDuel2.0_Complete.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "8. Then deploy to Render:"
echo "   https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/SymbolDuel2.0_Complete"
INNER_EOF

chmod +x create-repo.sh
