#!/bin/bash

# Symbol Duel - Modern Deployment Script
# Deploys the clean, modern version of Symbol Duel

echo "🎯 Symbol Duel - Modern Deployment Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "index_new.html" ]; then
    echo "❌ Error: index_new.html not found. Please run this script from the SymbolDuel2.0_Clean directory."
    exit 1
fi

# Backup old files
echo "📦 Backing up old files..."
if [ -f "index.html" ]; then
    cp index.html index_old_backup.html
    echo "✅ Backed up index.html to index_old_backup.html"
fi

if [ -f "server.js" ]; then
    cp server.js server_old_backup.js
    echo "✅ Backed up server.js to server_old_backup.js"
fi

if [ -f "package.json" ]; then
    cp package.json package_old_backup.json
    echo "✅ Backed up package.json to package_old_backup.json"
fi

# Replace with new files
echo "🔄 Replacing with modern files..."
mv index_new.html index.html
mv server_new.js server.js
mv package_new.json package.json
echo "✅ Files replaced successfully"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Error installing dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
PORT=3000
NODE_ENV=production
CORS_ORIGIN=*
EOF
    echo "✅ Created .env file"
fi

# Test the server
echo "🧪 Testing server startup..."
timeout 10s npm start &
SERVER_PID=$!
sleep 5

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server started successfully"
    kill $SERVER_PID
else
    echo "❌ Server failed to start"
    exit 1
fi

# Create deployment info
echo "📊 Creating deployment info..."
cat > DEPLOYMENT_INFO.md << EOF
# Symbol Duel - Deployment Information

## Deployment Date
$(date)

## Version
3.0.0 (Modern Clean Version)

## Files Deployed
- index.html (Modern frontend)
- server.js (Clean server implementation)
- package.json (Updated dependencies)

## Backup Files Created
- index_old_backup.html
- server_old_backup.js
- package_old_backup.json

## Next Steps
1. Test the application: npm start
2. Deploy to production platform
3. Update environment variables
4. Monitor performance

## Features
- ✅ Modern UI/UX design
- ✅ Clean, maintainable code
- ✅ Stable Socket.IO connections
- ✅ Responsive mobile design
- ✅ Comprehensive error handling
- ✅ Security best practices

## Support
- Check README_NEW.md for documentation
- Review code comments for implementation details
- Test all features before production deployment
EOF

echo "✅ Deployment info created"

# Final status
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "✅ Modern Symbol Duel is ready!"
echo "✅ All old files backed up"
echo "✅ Dependencies installed"
echo "✅ Server tested successfully"
echo ""
echo "🚀 To start the server:"
echo "   npm start"
echo ""
echo "🌐 To test locally:"
echo "   http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   README_NEW.md"
echo ""
echo "🔄 To rollback if needed:"
echo "   mv index_old_backup.html index.html"
echo "   mv server_old_backup.js server.js"
echo "   mv package_old_backup.json package.json"
echo ""
echo "May the best puzzle solver win! 🎯✨"
