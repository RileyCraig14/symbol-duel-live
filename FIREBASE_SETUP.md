# 🔥 Firebase Setup Guide for Symbol Duel

## Quick Production Setup (30 minutes)

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it "symbol-duel"
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Services
1. **Authentication**: Go to Authentication > Sign-in method > Enable Email/Password
2. **Firestore**: Go to Firestore Database > Create database > Start in test mode
3. **Hosting**: Go to Hosting > Get started

### Step 3: Add Firebase to Your HTML
Add this to your `index.html` before the closing `</body>` tag:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>

<script>
// Your Firebase config (get from Project Settings > General > Your apps)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
</script>
```

### Step 4: Update Your Game Code
Replace the mock multiplayer functions with real Firebase calls:

```javascript
// Real Firebase Functions
async function createRoom(roomData) {
    const docRef = await db.collection('rooms').add({
        ...roomData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'waiting'
    });
    return docRef.id;
}

async function joinRoom(roomId, playerData) {
    await db.collection('rooms').doc(roomId).collection('players').add({
        ...playerData,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

async function updatePlayerScore(roomId, playerId, score) {
    await db.collection('rooms').doc(roomId).collection('players').doc(playerId).update({
        score: score,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Real-time listeners
function listenToRoomUpdates(roomId, callback) {
    db.collection('rooms').doc(roomId).collection('players')
        .onSnapshot((snapshot) => {
            const players = [];
            snapshot.forEach((doc) => {
                players.push({ id: doc.id, ...doc.data() });
            });
            callback(players);
        });
}
```

### Step 5: Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Deploy
firebase deploy
```

## Database Schema

### Rooms Collection
```javascript
rooms: {
    roomId: {
        name: "Pro League",
        maxPlayers: 4,
        currentPlayers: 2,
        status: "waiting", // waiting, playing, finished
        betAmount: 100,
        host: "playerId",
        createdAt: timestamp,
        players: {
            playerId1: {
                name: "Player1",
                score: 0,
                bet: 50,
                isReady: false
            }
        }
    }
}
```

### Users Collection
```javascript
users: {
    userId: {
        username: "Player1",
        email: "player@email.com",
        totalGames: 0,
        gamesWon: 0,
        totalEarnings: 0,
        balance: 1000,
        createdAt: timestamp
    }
}
```

## Security Rules

Add these to Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Rooms are readable by authenticated users
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      
      // Players subcollection
      match /players/{playerId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

## Production Checklist

### ✅ Firebase Setup
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Hosting configured
- [ ] Security rules set

### ✅ Code Updates
- [ ] Firebase SDK added
- [ ] Real authentication implemented
- [ ] Real-time database listeners added
- [ ] Error handling added

### ✅ Deployment
- [ ] Firebase CLI installed
- [ ] Project initialized
- [ ] Deployed to Firebase Hosting
- [ ] Custom domain configured (optional)

## Cost Estimate

### Firebase Free Tier (Perfect for MVP)
- **Authentication**: 10,000 users/month
- **Firestore**: 1GB storage, 50,000 reads/day
- **Hosting**: 10GB storage, 10GB transfer/month
- **Functions**: 125,000 invocations/month

### Paid Plans (When you scale)
- **Blaze Plan**: Pay as you go
- **Authentication**: $0.0055 per verification
- **Firestore**: $0.18 per 100K reads
- **Hosting**: $0.026 per GB transfer

## Next Steps After Firebase Setup

1. **Add Real-time Features**: Implement WebSocket-like functionality
2. **Add Payment Integration**: Stripe for real money betting
3. **Add Analytics**: Track user behavior
4. **Add Admin Panel**: Manage users and games
5. **Add More Puzzles**: Expand the puzzle database

## Support Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Firebase Console**: https://console.firebase.google.com/
- **Firebase Support**: https://firebase.google.com/support

---

**This setup will get you from MVP to production-ready in under 1 hour!** 🚀
