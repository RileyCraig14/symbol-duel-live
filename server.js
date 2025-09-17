// Production-Ready Trivia Gambling Server
// Based on proven FanDuel/DraftKings patterns and Socket.IO best practices

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

// Initialize Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : "*"),
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'", "https://js.stripe.com", "https://cdn.socket.io", "https://www.gstatic.com", "https://apis.google.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.stripe.com", "wss:", "ws:", "https://*.firebaseapp.com", "https://*.googleapis.com"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", "https://js.stripe.com", "https://symbol-duel.firebaseapp.com"],
        }
    }
}));

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || process.env.NODE_ENV === 'production' ? false : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Load custom rebus puzzles from JSON file
let puzzles = [];
try {
    const puzzlesData = fs.readFileSync(path.join(__dirname, 'rebus-puzzles.json'), 'utf8');
    const puzzlesJson = JSON.parse(puzzlesData);
    puzzles = puzzlesJson.map(puzzle => ({
        symbols: puzzle.symbols,
        answer: puzzle.answer.toLowerCase(),
        alternatives: [
            puzzle.answer.toLowerCase(),
            puzzle.answer.toLowerCase().replace(/\s+/g, ''),
            puzzle.answer.toLowerCase().replace(/\s+/g, '-')
        ],
        difficulty: puzzle.difficulty || 'easy',
        points: puzzle.difficulty === 'easy' ? 10 : puzzle.difficulty === 'medium' ? 15 : 20
    }));
    console.log(`Loaded ${puzzles.length} custom rebus puzzles`);
} catch (error) {
    console.error('Error loading rebus puzzles:', error);
    // Fallback to default puzzles
    puzzles = [
        { symbols: '🎵 + 🏠', answer: 'music house', alternatives: ['musichouse', 'music house', 'house music'], difficulty: 'easy', points: 10 },
        { symbols: '☀️ + 🌊', answer: 'sun water', alternatives: ['sunwater', 'sun water', 'solar water'], difficulty: 'easy', points: 10 },
        { symbols: '🚗 + 🏠', answer: 'car house', alternatives: ['carhouse', 'car house', 'garage'], difficulty: 'easy', points: 10 }
    ];
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input validation middleware
const validateInput = (req, res, next) => {
    // Sanitize string inputs
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim().substring(0, 1000); // Limit length
            }
        });
    }
    next();
};
app.use(validateInput);

app.use(express.static(path.join(__dirname)));

// API endpoints for leaderboard and statistics (proven pattern from gambling platforms)
app.get('/api/leaderboard', (req, res) => {
    const topPlayers = Array.from(leaderboard.values())
        .sort((a, b) => b.totalWinnings - a.totalWinnings)
        .slice(0, 10);
    res.json(topPlayers);
});

app.get('/api/stats', (req, res) => {
    const stats = {
        totalGames: gameHistory.length,
        totalPlayers: leaderboard.size,
        totalVolume: gameHistory.reduce((sum, game) => sum + game.totalPot, 0),
        averageGameSize: gameHistory.length > 0 ? gameHistory.reduce((sum, game) => sum + game.playerCount, 0) / gameHistory.length : 0
    };
    res.json(stats);
});

// Stripe Payment Endpoints
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', gameId } = req.body;
        
        // Enhanced validation
        if (!amount || typeof amount !== 'number' || amount < 50 || amount > 100000) { // $0.50 to $1000
            return res.status(400).json({ error: 'Invalid amount. Must be between $0.50 and $1000.' });
        }

        if (!['usd', 'eur', 'gbp'].includes(currency)) {
            return res.status(400).json({ error: 'Invalid currency' });
        }

        if (gameId && typeof gameId !== 'string') {
            return res.status(400).json({ error: 'Invalid game ID' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Convert to cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                gameId: gameId || 'symbol-duel',
                type: 'entry-fee',
                timestamp: new Date().toISOString()
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Payment processing failed. Please try again.' });
    }
});

app.post('/api/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            res.json({ 
                success: true, 
                amount: paymentIntent.amount,
                status: paymentIntent.status 
            });
        } else {
            res.json({ 
                success: false, 
                status: paymentIntent.status 
            });
        }
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// User Balance Management Endpoints
app.get('/api/user-balance/:userId', (req, res) => {
    const userId = req.params.userId;
    const balance = userBalances.get(userId) || 0;
    res.json({ balance: balance / 100 }); // Return in dollars
});

app.post('/api/add-balance', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const currentBalance = userBalances.get(userId) || 0;
        const newBalance = currentBalance + amount;
        userBalances.set(userId, newBalance);
        
        res.json({ 
            success: true, 
            newBalance: newBalance / 100,
            message: `Added $${amount/100} to your account`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/deduct-balance', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const currentBalance = userBalances.get(userId) || 0;
        
        if (currentBalance < amount) {
            return res.status(400).json({ 
                success: false, 
                error: 'Insufficient balance' 
            });
        }
        
        const newBalance = currentBalance - amount;
        userBalances.set(userId, newBalance);
        
        res.json({ 
            success: true, 
            newBalance: newBalance / 100,
            message: `Deducted $${amount/100} from your account`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Game state management (proven pattern from successful gambling platforms)
const rooms = new Map();
const players = new Map();
const leaderboard = new Map(); // Track player statistics
const gameHistory = []; // Track game history for analytics
const userBalances = new Map(); // Track user balances

// Proven payout configuration (based on FanDuel/DraftKings models)
const PAYOUT_CONFIG = {
    HOUSE_EDGE: 0.06, // 6% house edge (industry standard)
    PLAYER_PAYOUT: 0.94, // 94% to players
    MINIMUM_PAYOUT: 1.00, // $1 minimum payout
    PROCESSING_FEE: 0.029, // 2.9% Stripe fee
    FIXED_FEE: 0.30 // $0.30 fixed fee
};

// Proven tournament payout calculation (based on FanDuel/DraftKings models)
function calculateTournamentPayouts(prizePool, playerCount) {
    const houseTake = prizePool * PAYOUT_CONFIG.HOUSE_EDGE;
    const playerPot = prizePool * PAYOUT_CONFIG.PLAYER_PAYOUT;
    
    console.log('Payout calculation - Prize Pool:', prizePool, 'Player Count:', playerCount, 'Player Pot:', playerPot);
    
    // Tournament payout structure (proven from successful platforms)
    const payouts = {};
    
    if (playerCount === 2) {
        // Head-to-head: Winner takes all
        payouts[1] = playerPot;
    } else if (playerCount === 3) {
        // 3 players: 70% winner, 30% runner-up
        payouts[1] = playerPot * 0.70;
        payouts[2] = playerPot * 0.30;
    } else if (playerCount === 4) {
        // 4 players: 50% winner, 30% runner-up, 20% third
        payouts[1] = playerPot * 0.50;
        payouts[2] = playerPot * 0.30;
        payouts[3] = playerPot * 0.20;
    } else if (playerCount === 5) {
        // 5 players: 40% winner, 25% runner-up, 20% third, 15% fourth
        payouts[1] = playerPot * 0.40;
        payouts[2] = playerPot * 0.25;
        payouts[3] = playerPot * 0.20;
        payouts[4] = playerPot * 0.15;
    } else if (playerCount === 6) {
        // 6 players: 35% winner, 25% runner-up, 20% third, 12% fourth, 8% fifth
        payouts[1] = playerPot * 0.35;
        payouts[2] = playerPot * 0.25;
        payouts[3] = playerPot * 0.20;
        payouts[4] = playerPot * 0.12;
        payouts[5] = playerPot * 0.08;
    }
    
    return {
        totalPot: totalPot,
        houseTake: houseTake,
        playerPot: playerPot,
        payouts: payouts,
        breakdown: {
            entryFee: entryFee,
            playerCount: playerCount,
            houseEdge: PAYOUT_CONFIG.HOUSE_EDGE,
            playerPayout: PAYOUT_CONFIG.PLAYER_PAYOUT
        }
    };
}

// Get puzzles by difficulty (proven pattern)
function getPuzzlesByDifficulty(round) {
    if (round <= 2) {
        return puzzles.filter(p => p.difficulty === 'easy');
    } else if (round <= 4) {
        return puzzles.filter(p => p.difficulty === 'medium');
    } else {
        return puzzles.filter(p => p.difficulty === 'hard');
    }
}

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    const playerName = 'Player' + Math.floor(Math.random() * 1000);
    
    players.set(socket.id, {
        id: socket.id,
        name: playerName,
        roomId: null,
        score: 0,
        userId: null // Will be set when user authenticates
    });
    
    // Register player with custom name
    socket.on('register_player', (data) => {
        if (data.name && data.name.trim()) {
            players.get(socket.id).name = data.name.trim();
            console.log('Player registered as:', data.name.trim());
            
            // Send test event to verify connection
            socket.emit('test_event', {
                message: 'Connection working! Player: ' + data.name.trim()
            });
        }
    });
    
    // Set user ID for authenticated users
    socket.on('set_user_id', (data) => {
        if (data.userId) {
            const player = players.get(socket.id);
            if (player) {
                player.userId = data.userId;
                console.log('User ID set for player:', player.name, 'Socket ID:', socket.id, 'User ID:', data.userId);
                console.log('Current balance for user:', userBalances.get(data.userId) || 0);
            } else {
                console.log('ERROR: Player not found for socket:', socket.id);
            }
        }
    });
    
    // Initialize leaderboard entry if not exists
    if (!leaderboard.has(playerName)) {
        leaderboard.set(playerName, {
            name: playerName,
            gamesPlayed: 0,
            gamesWon: 0,
            totalWinnings: 0,
            totalSpent: 0,
            winRate: 0,
            averageScore: 0
        });
    }
    
    // Create room
    socket.on('create_room', (data) => {
        const roomId = 'room_' + Date.now();
        const player = players.get(socket.id);
        
        console.log('Create room request - Socket ID:', socket.id, 'Player:', player);
        
        if (!player) {
            socket.emit('error', { message: 'Player not found. Please refresh and try again.' });
            return;
        }
        
        const entryFeeCents = (data.entryFee || 10) * 100; // Convert to cents
        
        console.log('Player user ID:', player.userId, 'Entry fee cents:', entryFeeCents);
        
        // Check if player has enough balance
        const currentBalance = userBalances.get(player.userId) || 0;
        console.log('Current balance for user:', currentBalance);
        
        if (currentBalance < entryFeeCents) {
            socket.emit('error', { 
                message: `Insufficient balance. Need $${(data.entryFee || 10).toFixed(2)} to create room. Current balance: $${(currentBalance/100).toFixed(2)}` 
            });
            return;
        }
        
        // Deduct entry fee from player balance
        const newBalance = currentBalance - entryFeeCents;
        userBalances.set(player.userId, newBalance);
        
        const room = {
            id: roomId,
            name: data.roomName || 'Game Room',
            entryFee: data.entryFee || 10,
            prizePool: (data.entryFee || 10) * 100, // Initialize prize pool with entry fee in cents
            hostId: socket.id,
            hostName: players.get(socket.id).name,
            players: [socket.id],
            playerNames: [players.get(socket.id).name],
            status: 'waiting',
            maxPlayers: 6,
            currentRound: 1,
            totalRounds: 5,
            scores: {},
            answers: {},
            gameStarted: false,
            currentPuzzle: null
        };
        
        rooms.set(roomId, room);
        socket.join(roomId);
        players.get(socket.id).roomId = roomId;
        
        // Notify player of balance update
        socket.emit('balance_updated', { 
            newBalance: newBalance / 100, 
            message: `Entry fee of $${(entryFeeCents/100).toFixed(2)} deducted for room creation` 
        });
        
        socket.emit('room_created', { roomId, room });
        console.log('Room created:', roomId, 'by', players.get(socket.id).name, 'Prize pool:', room.prizePool);
    });
    
    // Join room
    socket.on('join_room', (data) => {
        const room = rooms.get(data.roomId);
        if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
        }
        
        if (room.status !== 'waiting') {
            socket.emit('error', { message: 'Room is not accepting new players' });
            return;
        }
        
        if (room.players.length >= room.maxPlayers) {
            socket.emit('error', { message: 'Room is full' });
            return;
        }
        
        if (room.players.includes(socket.id)) {
            socket.emit('error', { message: 'You are already in this room' });
            return;
        }
        
        // Check and deduct entry fee from player balance
        const player = players.get(socket.id);
        const entryFeeCents = room.entryFee * 100; // Convert to cents
        const currentBalance = userBalances.get(player.userId) || 0;
        
        console.log('Join room check - Player:', player.name, 'UserID:', player.userId, 'Balance:', currentBalance, 'Entry fee:', entryFeeCents);
        
        if (currentBalance < entryFeeCents) {
            socket.emit('error', { 
                message: `Insufficient balance. Need $${room.entryFee.toFixed(2)} to join. Current balance: $${(currentBalance/100).toFixed(2)}` 
            });
            return;
        }
        
        // Deduct entry fee
        const newBalance = currentBalance - entryFeeCents;
        userBalances.set(player.userId, newBalance);
        
        // Add entry fee to prize pool (in cents)
        room.prizePool += (room.entryFee * 100);
        
        room.players.push(socket.id);
        room.playerNames.push(player.name);
        room.scores[socket.id] = 0;
        
        socket.join(data.roomId);
        player.roomId = data.roomId;
        
        // Notify player of balance update
        socket.emit('balance_updated', { 
            newBalance: newBalance / 100,
            deducted: room.entryFee,
            message: `Entry fee of $${room.entryFee.toFixed(2)} deducted from your balance`
        });
        
        // Broadcast to all players in room
        io.to(data.roomId).emit('room_updated', room);
        socket.emit('room_joined', { roomId: data.roomId, room: room });
        console.log('Player joined room:', players.get(socket.id).name, 'joined', data.roomId);
    });
    
    // Start game
    socket.on('start_game', (data) => {
        const room = rooms.get(data.roomId);
        if (!room || room.hostId !== socket.id) {
            socket.emit('error', { message: 'Only room host can start the game' });
            return;
        }
        
        if (room.players.length < 2) {
            socket.emit('error', { message: 'Need at least 2 players to start' });
            return;
        }
        
        room.status = 'playing';
        room.gameStarted = true;
        room.currentRound = 1;
        
        // Start first round
        startRound(room);
        
        // Send game started event and room update to keep all players synchronized
        io.to(data.roomId).emit('game_started', room);
        io.to(data.roomId).emit('room_updated', room);
        console.log('Game started in room:', data.roomId);
    });
    
    // Submit answer
    socket.on('submit_answer', (data, callback) => {
        console.log('Answer submitted - Socket ID:', socket.id, 'Answer:', data.answer, 'Room:', data.roomId);
        
        const room = rooms.get(data.roomId);
        if (!room || room.status !== 'playing') {
            const error = { message: 'Game is not active' };
            if (callback) callback(error);
            return;
        }
        
        if (!room.currentPuzzle) {
            const error = { message: 'No active puzzle' };
            if (callback) callback(error);
            return;
        }
        
        // Check answer
        const isCorrect = room.currentPuzzle.alternatives.includes(data.answer.toLowerCase());
        const playerName = players.get(socket.id).name;
        
        // Initialize player attempts if not exists
        if (!room.answers[socket.id]) {
            room.answers[socket.id] = {
                attempts: [],
                correct: false,
                points: 0,
                playerName: playerName
            };
        }
        
        // Add this attempt
        room.answers[socket.id].attempts.push({
            answer: data.answer,
            correct: isCorrect,
            timestamp: new Date().toISOString()
        });
        
        // If correct, mark as correct and award points
        if (isCorrect && !room.answers[socket.id].correct) {
            room.answers[socket.id].correct = true;
            room.answers[socket.id].points = room.currentPuzzle.points;
            room.scores[socket.id] = (room.scores[socket.id] || 0) + room.currentPuzzle.points;
        }
        
        const response = { 
            success: true, 
            correct: isCorrect, 
            points: isCorrect ? room.currentPuzzle.points : 0,
            message: isCorrect ? 'Correct! +' + room.currentPuzzle.points + ' points' : 'Try again!',
            attempts: room.answers[socket.id].attempts.length,
            isFirstCorrect: isCorrect && room.answers[socket.id].attempts.length === 1
        };
        
        console.log('Sending response to player:', players.get(socket.id).name, response);
        
        // Send direct response to the player who answered
        socket.emit('answer_result', {
            success: true,
            correct: isCorrect,
            points: isCorrect ? room.currentPuzzle.points : 0,
            message: isCorrect ? 'Correct! +' + room.currentPuzzle.points + ' points' : 'Try again!',
            correctAnswer: room.currentPuzzle.answer,
            yourAnswer: data.answer,
            attempts: room.answers[socket.id].attempts.length,
            isFirstCorrect: isCorrect && room.answers[socket.id].attempts.length === 1
        });
        
        if (callback) {
            callback(response);
        } else {
            console.log('No callback function provided');
        }
        
        // Broadcast to all players with full answer details
        io.to(data.roomId).emit('player_answered', {
            playerId: socket.id,
            playerName: players.get(socket.id).name,
            answer: data.answer,
            correct: isCorrect,
            points: isCorrect ? room.currentPuzzle.points : 0,
            correctAnswer: room.currentPuzzle.answer,
            message: isCorrect ? 'Correct! +' + room.currentPuzzle.points + ' points' : 'Incorrect answer'
        });
        
        console.log('Answer submitted:', players.get(socket.id).name, 'answered', data.answer, 'correct:', isCorrect);
        
        // Check if all players have answered (but don't auto-end round - let timer handle it)
        // This is just for logging purposes now
        const answeredPlayers = Object.keys(room.answers).length;
        const correctPlayers = Object.values(room.answers).filter(answer => answer.correct).length;
        console.log(`Round ${room.currentRound}: ${answeredPlayers}/${room.players.length} players answered, ${correctPlayers} correct`);
    });
    
    // Handle time up event from client
    socket.on('time_up', (data) => {
        const room = rooms.get(data.roomId);
        if (!room || room.status !== 'playing') {
            return;
        }
        
        console.log('Time up for round', room.currentRound, 'in room', room.id);
        
        // End the round after a short delay to show final results
        setTimeout(() => {
            endRound(room);
        }, 3000);
    });
    
    // Get rooms
    socket.on('get_rooms', () => {
        const availableRooms = Array.from(rooms.values())
            .filter(room => room.status === 'waiting' && room.players.length < room.maxPlayers)
            .map(room => ({
                id: room.id,
                name: room.name,
                entryFee: room.entryFee,
                playerCount: room.players.length,
                maxPlayers: room.maxPlayers
            }));
        
        socket.emit('rooms_list', availableRooms);
    });
    
    // Ping handler for connection keep-alive
    socket.on('ping', () => {
        socket.emit('pong');
    });
    
    // Disconnect
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        
        const player = players.get(socket.id);
        if (player && player.roomId) {
            const room = rooms.get(player.roomId);
            if (room) {
                const playerIndex = room.players.indexOf(socket.id);
                if (playerIndex > -1) {
                    room.players.splice(playerIndex, 1);
                    room.playerNames.splice(playerIndex, 1);
                    delete room.scores[socket.id];
                    delete room.answers[socket.id];
                }
                
                if (room.hostId === socket.id) {
                    if (room.players.length > 0) {
                        room.hostId = room.players[0];
                        room.hostName = room.playerNames[0];
                    } else {
                        rooms.delete(player.roomId);
                        return;
                    }
                }
                
                io.to(player.roomId).emit('room_updated', room);
            }
        }
        
        players.delete(socket.id);
    });
});

function startRound(room) {
    console.log('Starting round', room.currentRound, 'in room', room.id);
    
    room.answers = {};
    const difficultyPuzzles = getPuzzlesByDifficulty(room.currentRound);
    const currentPuzzle = difficultyPuzzles[Math.floor(Math.random() * difficultyPuzzles.length)];
    room.currentPuzzle = currentPuzzle;
    
    // Add round and timer info to the puzzle data
    const questionData = {
        ...currentPuzzle,
        round: room.currentRound,
        totalRounds: room.totalRounds,
        timeLimit: 30
    };
    
    io.to(room.id).emit('question_updated', questionData);
    console.log('Question sent:', currentPuzzle.symbols, 'Difficulty:', currentPuzzle.difficulty);
    
    // Timer for round (30 seconds)
    setTimeout(() => {
        if (room.status === 'playing') {
            endRound(room);
        }
    }, 30000);
}

function endRound(room) {
    console.log('Ending round', room.currentRound, 'in room', room.id);
    
    room.currentRound++;
    
    if (room.currentRound > room.totalRounds) {
        endGame(room);
    } else {
        setTimeout(() => {
            startRound(room);
        }, 3000);
    }
}

function endGame(room) {
    console.log('Ending game in room', room.id);
    
    room.status = 'finished';
    
    // Create player rankings based on scores
    const playerRankings = [];
    Object.keys(room.scores).forEach(playerId => {
        const playerIndex = room.players.indexOf(playerId);
        if (playerIndex >= 0) {
            playerRankings.push({
                playerId: playerId,
                playerName: room.playerNames[playerIndex],
                score: room.scores[playerId] || 0,
                position: 0 // Will be calculated
            });
        }
    });
    
    // Sort by score (highest first)
    playerRankings.sort((a, b) => b.score - a.score);
    
    // Assign positions
    playerRankings.forEach((player, index) => {
        player.position = index + 1;
    });
    
    // Calculate tournament payouts using actual prize pool
    const payoutStructure = calculateTournamentPayouts(room.prizePool, room.players.length);
    
    // Process payouts
    const payoutResults = {
        tournamentId: room.id,
        timestamp: new Date().toISOString(),
        payouts: [],
        totalPaid: 0
    };
    
    // Process each player payout
    playerRankings.forEach(async (player, index) => {
        const position = player.position;
        const payoutAmount = payoutStructure.payouts[position];
        
        if (payoutAmount && payoutAmount >= (PAYOUT_CONFIG.MINIMUM_PAYOUT * 100)) {
            // Add real money to player's balance
            try {
                // Get the Firebase user ID for this player
                const playerObj = players.get(player.playerId);
                const userId = playerObj ? playerObj.userId : null;
                
                if (!userId) {
                    console.error(`No user ID found for player ${player.playerName} (socket: ${player.playerId})`);
                    payoutResults.payouts.push({
                        playerId: player.playerId,
                        playerName: player.playerName,
                        position: position,
                        amount: payoutAmount,
                        payoutId: 'po_' + Date.now() + '_' + index,
                        status: 'error',
                        error: 'No user ID found for player'
                    });
                    return;
                }
                
                const currentBalance = userBalances.get(userId) || 0;
                const newBalance = currentBalance + payoutAmount; // Prize pool already in cents
                userBalances.set(userId, newBalance);
                
                payoutResults.payouts.push({
                    playerId: player.playerId,
                    userId: userId,
                    playerName: player.playerName,
                    position: position,
                    amount: payoutAmount,
                    payoutId: 'po_' + Date.now() + '_' + index,
                    status: 'success',
                    newBalance: newBalance / 100 // Return balance in dollars
                });
                
                payoutResults.totalPaid += payoutAmount;
                
                console.log(`Payout: ${player.playerName} won $${payoutAmount.toFixed(2)} (Position ${position})`);
            } catch (error) {
                console.error(`Error processing payout for ${player.playerName}:`, error);
                payoutResults.payouts.push({
                    playerId: player.playerId,
                    playerName: player.playerName,
                    position: position,
                    amount: payoutAmount,
                    payoutId: 'po_' + Date.now() + '_' + index,
                    status: 'error',
                    error: error.message
                });
            }
        }
    });
    
    const results = {
        winner: playerRankings[0].playerName,
        finalScores: room.scores,
        playerRankings: playerRankings,
        payoutStructure: payoutStructure,
        payoutResults: payoutResults,
        totalPot: payoutStructure.totalPot,
        houseTake: payoutStructure.houseTake,
        playerPot: payoutStructure.playerPot
    };
    
    // Update leaderboard statistics (proven pattern from gambling platforms)
    playerRankings.forEach((player, index) => {
        const playerStats = leaderboard.get(player.playerName);
        if (playerStats) {
            playerStats.gamesPlayed++;
            playerStats.totalSpent += room.entryFee;
            
            if (index === 0) { // Winner
                playerStats.gamesWon++;
                const winnings = payoutResults.payouts.find(p => p.playerName === player.playerName)?.amount || 0;
                playerStats.totalWinnings += winnings;
            }
            
            playerStats.winRate = (playerStats.gamesWon / playerStats.gamesPlayed) * 100;
            playerStats.averageScore = (playerStats.averageScore * (playerStats.gamesPlayed - 1) + player.score) / playerStats.gamesPlayed;
        }
    });
    
    // Record game history for analytics
    gameHistory.push({
        roomId: room.id,
        timestamp: new Date().toISOString(),
        playerCount: room.players.length,
        totalPot: payoutStructure.totalPot,
        houseTake: payoutStructure.houseTake,
        winner: playerRankings[0].playerName,
        winnerAmount: payoutResults.payouts[0]?.amount || 0
    });
    
    // Keep only last 1000 games for performance
    if (gameHistory.length > 1000) {
        gameHistory.shift();
    }
    
    io.to(room.id).emit('game_ended', results);
    console.log('Game ended. Winner:', playerRankings[0].playerName, 'Amount:', payoutResults.payouts[0]?.amount?.toFixed(2) || 0);
    
    // Remove room from lobby after game ends (no longer available to join)
    setTimeout(() => {
        removeFinishedRoom(room);
    }, 10000);
}

function resetRoomForNextGame(room) {
    console.log('Resetting room for next game:', room.id);
    
    // Reset game state but keep players
    room.status = 'waiting';
    room.currentRound = 0;
    room.currentPuzzle = null;
    room.answers = {};
    room.scores = {};
    room.playerNames.forEach((name, index) => {
        room.scores[room.players[index]] = 0;
    });
    
    // Notify players that they can start a new game
    io.to(room.id).emit('room_ready_for_next_game', {
        message: 'Ready for another round! Click "Start Game" to begin.',
        roomId: room.id
    });
    
    // Update room status
    io.to(room.id).emit('room_updated', room);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Symbol Duel server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to play`);
});
