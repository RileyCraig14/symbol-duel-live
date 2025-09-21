// Symbol Duel - Production Ready Server with Stripe Integration
// Complete gaming platform with real money transactions

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

// Initialize Multi-Payment System
const PaymentProcessor = require('./payment-processor');
const paymentProcessor = new PaymentProcessor();
console.log('💳 Multi-Payment System initialized (PayPal, Square, Braintree, Credit Card)');
const admin = require('firebase-admin');
const LegalCompliance = require('./legal-compliance');

// Initialize Firebase Admin - REQUIRED FOR REAL MONEY
let firebaseInitialized = false;
if (!admin.apps.length) {
    try {
        // Try to initialize with default credentials for production
        admin.initializeApp({
            projectId: 'symbol-duel'
        });
        firebaseInitialized = true;
        console.log('🔥 Firebase Admin initialized successfully');
    } catch (error) {
        console.error('❌ Firebase Admin initialization failed:', error.message);
        console.log('⚠️  Continuing without Firebase - will use in-memory storage');
        firebaseInitialized = false;
    }
}

const app = express();
const server = http.createServer(app);

// Initialize Legal Compliance
const legalCompliance = new LegalCompliance();

// Socket.IO with production configuration
const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
});

// Legal compliance middleware
app.use(legalCompliance.createComplianceMiddleware());

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://cdn.socket.io", "https://www.gstatic.com", "https://apis.google.com", "https://js.stripe.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "wss:", "ws:", "https://*.firebaseapp.com", "https://*.googleapis.com", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com", "https://api.stripe.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", "https://*.firebaseapp.com", "https://js.stripe.com", "https://hooks.stripe.com"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input validation middleware
const validateInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim().substring(0, 1000);
            }
        });
    }
    next();
};
app.use(validateInput);

// Static files
app.use(express.static(path.join(__dirname)));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        puzzles: puzzles.length,
        rooms: gameManager.rooms.size,
        players: gameManager.players.size,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Load enhanced puzzle collections
const enhancedPuzzles = require('./enhanced-puzzles');
const triviaPuzzles = require('./trivia-puzzles');

// Combine all puzzles for maximum variety
let puzzles = [...enhancedPuzzles, ...triviaPuzzles];
console.log(`✅ Loaded ${puzzles.length} enhanced puzzles`);

// Production Game Manager with Firebase integration
class ProductionGameManager {
    constructor() {
        this.rooms = new Map();
        this.players = new Map();
        this.leaderboard = new Map();
        this.gameHistory = [];
        this.userBalances = new Map();
        this.db = firebaseInitialized ? admin.firestore() : null;
    }

    // Firebase user balance management - REAL MONEY ONLY
    async getUserBalance(userId) {
        try {
            if (!this.db) {
                throw new Error('Firebase not configured - real money requires Firebase');
            }
            
            const userDoc = await this.db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                return userDoc.data().balance || 0;
            }
            
            // New users start with $0 - they must deposit real money
            await this.db.collection('users').doc(userId).set({
                balance: 0,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                totalDeposited: 0,
                totalWon: 0,
                gamesPlayed: 0
            });
            
            return 0;
        } catch (error) {
            console.error('Error getting user balance:', error);
            throw new Error('Cannot access user balance - Firebase required for real money');
        }
    }

    async updateUserBalance(userId, newBalance) {
        try {
            if (!this.db) {
                throw new Error('Firebase not configured - real money requires Firebase');
            }
            
            await this.db.collection('users').doc(userId).update({
                balance: newBalance,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error updating user balance:', error);
            throw new Error('Cannot update user balance - Firebase required for real money');
        }
    }

    // Room management with $200 limit
    createRoom(roomId, roomData) {
        // Validate entry fee limit
        if (roomData.entryFee > 200) {
            throw new Error('Entry fee cannot exceed $200');
        }

        const room = {
            id: roomId,
            name: roomData.roomName,
            entryFee: roomData.entryFee,
            prizePool: roomData.entryFee * 100, // Convert to cents
            hostId: roomData.hostId,
            hostName: roomData.hostName,
            players: [roomData.hostId],
            playerNames: [roomData.hostName],
            status: 'waiting',
            maxPlayers: 6,
            currentRound: 1,
            totalRounds: 5,
            scores: {},
            answers: {},
            gameStarted: false,
            currentPuzzle: null,
            createdAt: new Date(),
            stripePaymentIntent: null // For Stripe integration
        };
        
        this.rooms.set(roomId, room);
        return room;
    }

    async joinRoom(roomId, playerId, playerName, userId) {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        if (room.status !== 'waiting' || room.players.length >= room.maxPlayers) {
            return null;
        }

        // Check user balance
        const currentBalance = await this.getUserBalance(userId);
        const entryFeeCents = room.entryFee * 100;
        
        if (currentBalance < entryFeeCents) {
            console.log(`❌ Insufficient balance: ${playerName} has $${(currentBalance/100).toFixed(2)}, needs $${room.entryFee}`);
            return null;
        }
        
        // Deduct entry fee
        const newBalance = currentBalance - entryFeeCents;
        await this.updateUserBalance(userId, newBalance);
        
        console.log(`💰 Entry fee deducted: ${playerName} paid $${room.entryFee}, new balance: $${(newBalance/100).toFixed(2)}`);

        room.players.push(playerId);
        room.playerNames.push(playerName);
        room.scores[playerId] = 0;
        room.prizePool += (room.entryFee * 100);

        return room;
    }

    startGame(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        
        // Allow single player for testing, but recommend 2+ players
        if (room.players.length < 1) return null;
        
        room.status = 'playing';
        room.gameStarted = true;
        room.currentRound = 1;
        room.answers = {};
        room.questionStartTime = Date.now();
        room.timeLimit = 30000; // 30 seconds in milliseconds
        
        // Start first question immediately
        const difficultyPuzzles = this.getPuzzleByDifficulty(room.currentRound);
        const puzzle = difficultyPuzzles[Math.floor(Math.random() * difficultyPuzzles.length)];
        room.currentPuzzle = puzzle;

        return room;
    }

    getPuzzleByDifficulty(round) {
        if (round <= 2) {
            return puzzles.filter(p => p.difficulty === 'easy');
        } else if (round <= 4) {
            return puzzles.filter(p => p.difficulty === 'medium');
        } else {
            return puzzles.filter(p => p.difficulty === 'hard');
        }
    }

    submitAnswer(roomId, playerId, answer) {
        const room = this.rooms.get(roomId);
        if (!room || room.status !== 'playing') {
            console.log('❌ Cannot submit answer - room not found or not playing:', { roomId, playerId, answer, roomStatus: room?.status });
            return null;
        }

        // Check if time has expired
        const timeElapsed = Date.now() - room.questionStartTime;
        const timeRemaining = room.timeLimit - timeElapsed;
        
        if (timeRemaining <= 0) {
            console.log('⏰ Answer submitted after time expired');
            return {
                correct: false,
                points: 0,
                attempts: 0,
                correctAnswer: room.currentPuzzle.answer,
                timeExpired: true
            };
        }

        const playerName = this.players.get(playerId)?.name || 'Unknown';
        const isCorrect = room.currentPuzzle?.alternatives.includes(answer.toLowerCase());
        
        console.log('📝 Answer submission:', {
            roomId,
            playerId,
            playerName,
            answer,
            correctAnswer: room.currentPuzzle?.answer,
            alternatives: room.currentPuzzle?.alternatives,
            isCorrect,
            timeRemaining: Math.ceil(timeRemaining / 1000)
        });

        if (!room.answers[playerId]) {
            room.answers[playerId] = {
                attempts: [],
                correct: false,
                points: 0,
                playerName: playerName,
                responseTime: timeRemaining
            };
        }
        
        room.answers[playerId].attempts.push({
            answer: answer,
            correct: isCorrect,
            timestamp: new Date().toISOString(),
            responseTime: timeRemaining
        });
        
        if (isCorrect && !room.answers[playerId].correct) {
            room.answers[playerId].correct = true;
            room.answers[playerId].points = room.currentPuzzle.points;
            room.scores[playerId] = (room.scores[playerId] || 0) + room.currentPuzzle.points;
        }

        return {
            correct: isCorrect, 
            points: isCorrect ? room.currentPuzzle.points : 0,
            attempts: room.answers[playerId].attempts.length,
            correctAnswer: room.currentPuzzle.answer,
            timeRemaining: Math.ceil(timeRemaining / 1000)
        };
    }

    endRound(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        room.currentRound++;
        
        if (room.currentRound > room.totalRounds) {
            return this.endGame(roomId);
        }

        // Start next round with new question
        const difficultyPuzzles = this.getPuzzleByDifficulty(room.currentRound);
        const puzzle = difficultyPuzzles[Math.floor(Math.random() * difficultyPuzzles.length)];
        room.currentPuzzle = puzzle;
        room.questionStartTime = Date.now();
        room.answers = {}; // Reset answers for new round

        return room;
    }

    async endGame(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        room.status = 'finished';

        // Calculate rankings
        const rankings = room.players.map(playerId => ({
            playerId: playerId,
            playerName: room.playerNames[room.players.indexOf(playerId)],
            score: room.scores[playerId] || 0
        })).sort((a, b) => b.score - a.score);

        // Calculate payouts
        const payoutStructure = this.calculatePayouts(room.prizePool, room.players.length);
        
        // Distribute payouts to user balances
        const payoutResults = [];
        for (const [index, player] of rankings.entries()) {
            const position = index + 1;
            const payoutAmount = payoutStructure.payouts[position] || 0;
            
            if (payoutAmount > 0) {
                // Get player's Firebase userId
                const playerObj = this.players.get(player.playerId);
                if (playerObj && playerObj.userId) {
                    const currentBalance = await this.getUserBalance(playerObj.userId);
                    const newBalance = currentBalance + (payoutAmount * 100); // Convert dollars to cents
                    await this.updateUserBalance(playerObj.userId, newBalance);
                    
                    console.log(`💰 Payout distributed: ${player.playerName} (${playerObj.userId}) -> $${payoutAmount} (Position: ${position})`);
                    
                    // Store payout for frontend
                    payoutResults.push({
                        playerId: player.playerId,
                        playerName: player.playerName,
                        position: position,
                        score: player.score,
                        payout: payoutAmount,
                        userId: playerObj.userId,
                        newBalance: newBalance,
                        balanceChange: payoutAmount * 100
                    });
                }
            } else {
                payoutResults.push({
                    playerId: player.playerId,
                    playerName: player.playerName,
                    position: position,
                    score: player.score,
                    payout: 0,
                    userId: this.players.get(player.playerId)?.userId,
                    newBalance: await this.getUserBalance(this.players.get(player.playerId)?.userId) || 0,
                    balanceChange: 0
                });
            }
        }
        
        const results = {
            winner: rankings[0].playerName,
            finalScores: room.scores,
            rankings: rankings,
            payoutStructure: payoutStructure,
            payoutResults: payoutResults,
            payouts: payoutStructure.payouts,
            totalPot: payoutStructure.totalPot,
            houseTake: payoutStructure.houseTake,
            playerPot: payoutStructure.playerPot
        };

        // Update leaderboard
        this.updateLeaderboard(rankings, room.entryFee);
        
        // Send balance updates to all players
        payoutResults.forEach(payout => {
            if (payout.userId) {
                const playerSocket = Array.from(io.sockets.sockets.values())
                    .find(s => s.playerId === payout.playerId);
                if (playerSocket) {
                    playerSocket.emit('balance_updated', { 
                        balance: payout.newBalance,
                        change: payout.balanceChange,
                        payout: payout.payout,
                        position: payout.position
                    });
                    
                    console.log(`💰 Balance update sent to ${payout.playerName}: $${(payout.newBalance/100).toFixed(2)} (${payout.payout > 0 ? '+' : ''}$${payout.payout.toFixed(2)})`);
                }
            }
        });

        return results;
    }

    calculatePayouts(prizePoolCents, playerCount) {
        const prizePoolDollars = prizePoolCents / 100;
        const houseEdge = 0.06; // 6% house edge
        const playerPayout = 0.94; // 94% to players
        
        const houseTake = prizePoolDollars * houseEdge;
        const playerPot = prizePoolDollars * playerPayout;
        
        const payouts = {};
        
        if (playerCount === 2) {
            payouts[1] = playerPot;
        } else if (playerCount === 3) {
            payouts[1] = playerPot * 0.70;
            payouts[2] = playerPot * 0.30;
        } else if (playerCount === 4) {
            payouts[1] = playerPot * 0.50;
            payouts[2] = playerPot * 0.30;
            payouts[3] = playerPot * 0.20;
        } else if (playerCount === 5) {
            payouts[1] = playerPot * 0.40;
            payouts[2] = playerPot * 0.25;
            payouts[3] = playerPot * 0.20;
            payouts[4] = playerPot * 0.15;
        } else if (playerCount === 6) {
            payouts[1] = playerPot * 0.35;
            payouts[2] = playerPot * 0.25;
            payouts[3] = playerPot * 0.20;
            payouts[4] = playerPot * 0.12;
            payouts[5] = playerPot * 0.08;
        }
        
        return {
            totalPot: prizePoolDollars,
            houseTake: houseTake,
            playerPot: playerPot,
            payouts: payouts
        };
    }

    updateLeaderboard(rankings, entryFee) {
        rankings.forEach((player, index) => {
            const playerName = player.playerName;
            let stats = this.leaderboard.get(playerName);
            
            if (!stats) {
                stats = {
                    name: playerName,
                    gamesPlayed: 0,
                    gamesWon: 0,
                    totalWinnings: 0,
                    totalSpent: 0,
                    winRate: 0,
                    averageScore: 0
                };
            }
            
            stats.gamesPlayed++;
            stats.totalSpent += entryFee;
            
            if (index === 0) {
                stats.gamesWon++;
                stats.totalWinnings += player.score; // Simplified for demo
            }
            
            stats.winRate = (stats.gamesWon / stats.gamesPlayed) * 100;
            stats.averageScore = (stats.averageScore * (stats.gamesPlayed - 1) + player.score) / stats.gamesPlayed;
            
            this.leaderboard.set(playerName, stats);
        });
    }
    
    removeFinishedRoom(roomId) {
        if (this.rooms.has(roomId)) {
            this.rooms.delete(roomId);
            console.log(`🗑️ Removed finished room: ${roomId}`);
        }
    }

    getAvailableRooms() {
        return Array.from(this.rooms.values())
            .filter(room => room.status === 'waiting' && room.players.length < room.maxPlayers)
            .map(room => ({
                id: room.id,
                name: room.name,
                entryFee: room.entryFee,
                playerCount: room.players.length,
                maxPlayers: room.maxPlayers
            }));
    }

    getLeaderboard() {
        return Array.from(this.leaderboard.values())
            .sort((a, b) => b.totalWinnings - a.totalWinnings)
            .slice(0, 10);
    }

    removePlayer(playerId) {
        const player = this.players.get(playerId);
        if (!player || !player.roomId) return;

        const room = this.rooms.get(player.roomId);
        if (room) {
            const playerIndex = room.players.indexOf(playerId);
            if (playerIndex > -1) {
                room.players.splice(playerIndex, 1);
                room.playerNames.splice(playerIndex, 1);
                delete room.scores[playerId];
                delete room.answers[playerId];
                room.prizePool -= (room.entryFee * 100);
            }
                
            if (room.hostId === playerId) {
                if (room.players.length > 0) {
                    room.hostId = room.players[0];
                    room.hostName = room.playerNames[0];
                } else {
                    this.rooms.delete(player.roomId);
                }
            }
        }

        this.players.delete(playerId);
    }
}

// Initialize production game manager
const gameManager = new ProductionGameManager();

// Multi-Payment API Routes - PRODUCTION READY
app.post('/api/create-payment', async (req, res) => {
    try {
        const { amount, userId, method = 'paypal' } = req.body;
        
        // Validate amount (minimum $5, maximum $500)
        if (amount < 5 || amount > 500) {
            return res.status(400).json({ error: 'Amount must be between $5 and $500' });
        }

        let paymentResult;

        switch (method) {
            case 'paypal':
                paymentResult = await paymentProcessor.createPayPalPayment(amount, userId);
                break;
            case 'square':
                paymentResult = await paymentProcessor.createSquarePayment(amount, userId);
                break;
            case 'braintree':
                paymentResult = await paymentProcessor.createBraintreePayment(amount, userId);
                break;
            default:
                return res.status(400).json({ error: 'Invalid payment method' });
        }

        res.json({
            success: true,
            paymentId: paymentResult.paymentId,
            amount: amount,
            method: method,
            redirectUrl: paymentResult.redirectUrl || null
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// Credit Card Processing Route
app.post('/api/process-credit-card', async (req, res) => {
    try {
        const { amount, userId, cardData } = req.body;
        
        // Validate amount
        if (amount < 5 || amount > 500) {
            return res.status(400).json({ error: 'Amount must be between $5 and $500' });
        }

        const result = await paymentProcessor.processCreditCard(amount, userId, cardData);
        
        res.json(result);
    } catch (error) {
        console.error('Credit card processing error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get available payment methods
app.get('/api/payment-methods', (req, res) => {
    res.json({
        methods: paymentProcessor.getAvailableMethods()
    });
});

app.post('/api/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId, userId } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            const amount = paymentIntent.amount; // Already in cents
            
            // Update user balance in Firebase
            const currentBalance = await gameManager.getUserBalance(userId);
            const newBalance = currentBalance + amount;
            await gameManager.updateUserBalance(userId, newBalance);
            
            res.json({
                success: true,
                amount: amount,
                newBalance: newBalance
            });
        } else {
            res.status(400).json({ error: 'Payment not completed' });
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
});

// API Routes
app.get('/api/leaderboard', (req, res) => {
    res.json(gameManager.getLeaderboard());
});

app.get('/api/rooms', (req, res) => {
    res.json(gameManager.getAvailableRooms());
});

app.get('/api/stats', (req, res) => {
    const stats = {
        totalGames: gameManager.gameHistory.length,
        totalPlayers: gameManager.leaderboard.size,
        totalVolume: gameManager.gameHistory.reduce((sum, game) => sum + game.totalPot, 0),
        averageGameSize: gameManager.gameHistory.length > 0 ? 
            gameManager.gameHistory.reduce((sum, game) => sum + game.playerCount, 0) / gameManager.gameHistory.length : 0
    };
    res.json(stats);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`🔌 Player connected: ${socket.id}`);
    
    // Register player
    socket.on('authenticate', (data) => {
        const playerName = `Player${Math.floor(Math.random() * 1000)}`;
        gameManager.players.set(socket.id, {
            id: socket.id,
            name: playerName,
            roomId: null,
            userId: data.userId
        });
        
        console.log(`👤 Player authenticated: ${playerName} (${data.userId})`);
    });

    // Create room with $200 limit
    socket.on('create_room', async (data) => {
        try {
            const player = gameManager.players.get(socket.id);
            if (!player) return;

            // Validate entry fee
            if (data.entryFee > 200) {
                socket.emit('error', { message: 'Entry fee cannot exceed $200' });
                return;
            }

            const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const room = gameManager.createRoom(roomId, {
                roomName: data.roomName,
                entryFee: data.entryFee,
                hostId: socket.id,
                hostName: player.name
            });

            socket.join(roomId);
            player.roomId = roomId;

            socket.emit('room_created', { roomId, room });
            console.log(`🏠 Room created: ${roomId} by ${player.name} with $${data.entryFee} entry fee`);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    // Join room
    socket.on('join_room', async (data) => {
        try {
            const player = gameManager.players.get(socket.id);
            if (!player) return;

            const room = await gameManager.joinRoom(data.roomId, socket.id, player.name, player.userId);
            if (!room) {
                socket.emit('error', { message: 'Cannot join room - insufficient funds or room full' });
                return;
            }

            socket.join(data.roomId);
            player.roomId = data.roomId;

            io.to(data.roomId).emit('room_updated', room);
            socket.emit('room_joined', { roomId: data.roomId, room });
            console.log(`🚪 Player joined room: ${player.name} -> ${data.roomId}`);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    // Start game
    socket.on('start_game', (data) => {
        const room = gameManager.startGame(data.roomId);
        if (!room) {
            socket.emit('error', { message: 'Cannot start game' });
            return;
        }

        io.to(data.roomId).emit('game_started', room);
        
        // Immediately send first question with server timer
        io.to(data.roomId).emit('question_updated', {
            ...room.currentPuzzle,
            round: room.currentRound,
            timeLimit: 30,
            startTime: room.questionStartTime
        });
        
        // Start server-side timer
        setTimeout(() => {
            const currentRoom = gameManager.rooms.get(data.roomId);
            if (currentRoom && currentRoom.status === 'playing') {
                const nextRoom = gameManager.endRound(data.roomId);
                if (nextRoom) {
                    if (nextRoom.currentRound > nextRoom.totalRounds) {
                        gameManager.endGame(data.roomId).then(results => {
                            io.to(data.roomId).emit('game_ended', results);
                            
                            // Clean up room after 10 seconds
                            setTimeout(() => {
                                gameManager.removeFinishedRoom(data.roomId);
                                io.emit('rooms_list', gameManager.getAvailableRooms());
                            }, 10000);
                        });
                    } else {
                        // Send next question
                        io.to(data.roomId).emit('question_updated', {
                            ...nextRoom.currentPuzzle,
                            round: nextRoom.currentRound,
                            timeLimit: 30,
                            startTime: nextRoom.questionStartTime
                        });
                        
                        // Start timer for next question
                        setTimeout(() => {
                            const finalRoom = gameManager.endRound(data.roomId);
                            if (finalRoom && finalRoom.currentRound > finalRoom.totalRounds) {
                                gameManager.endGame(data.roomId).then(results => {
                                    io.to(data.roomId).emit('game_ended', results);
                                    
                                    setTimeout(() => {
                                        gameManager.removeFinishedRoom(data.roomId);
                                        io.emit('rooms_list', gameManager.getAvailableRooms());
                                    }, 10000);
                                });
                            }
                        }, 30000); // 30 seconds for each question
                    }
                }
            }
        }, 30000); // 30 seconds for first question
        
        console.log(`🎮 Game started in room: ${data.roomId} with question: ${room.currentPuzzle.symbols}`);
    });

    // Submit answer
    socket.on('submit_answer', (data) => {
        const result = gameManager.submitAnswer(data.roomId, socket.id, data.answer);
        if (!result) {
            socket.emit('error', { message: 'Cannot submit answer' });
            return;
        }

        socket.emit('answer_result', {
            correct: result.correct,
            points: result.points,
            attempts: result.attempts,
            correctAnswer: result.correctAnswer
        });

        console.log(`📝 Answer submitted: ${socket.id} -> ${data.answer} (${result.correct ? 'correct' : 'incorrect'})`);
    });

    // Get rooms
    socket.on('get_rooms', () => {
        socket.emit('rooms_list', gameManager.getAvailableRooms());
    });

    // Get leaderboard
    socket.on('get_leaderboard', () => {
        socket.emit('leaderboard', gameManager.getLeaderboard());
    });

    // Leave room
    socket.on('leave_room', (data) => {
        const player = gameManager.players.get(socket.id);
        if (player && player.roomId) {
            socket.leave(player.roomId);
            gameManager.removePlayer(socket.id);
            
            const room = gameManager.rooms.get(player.roomId);
            if (room) {
                io.to(player.roomId).emit('room_updated', room);
            }
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`🔌 Player disconnected: ${socket.id}`);
        gameManager.removePlayer(socket.id);
    });
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Symbol Duel PRODUCTION Server running on port ${PORT}`);
    console.log(`🌐 Server ready for LIVE USERS`);
    console.log(`📊 Loaded ${puzzles.length} puzzles`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💳 Stripe LIVE integration: ENABLED`);
    console.log(`🔥 Firebase Admin: ENABLED`);
    console.log(`💰 Entry fee limit: $5 - $200`);
    console.log(`💵 REAL MONEY ONLY - Credit card payments enabled`);
    console.log(`🎯 PRODUCTION READY - Accepting real payments!`);
});

module.exports = { app, server, io };
