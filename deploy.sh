#!/bin/bash

# Quick Render Deployment Script
echo "🚀 Deploying Symbol Duel to Render..."

# Commit any changes
git add .
git commit -m "Deploy fixes $(date)"

# Push to trigger Render deployment
git push origin main

echo "✅ Code pushed to GitHub"
echo "🔄 Render will automatically redeploy"
echo "⏳ Wait 2-3 minutes for deployment to complete"
echo ""
echo "🔗 Check your Render dashboard for the live URL"
echo "📊 Monitor deployment logs in Render dashboard"
echo ""
echo "🎯 Your Symbol Duel game will be live soon!"
