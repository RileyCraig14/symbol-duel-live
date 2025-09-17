// Modern Symbol Duel Server - Production Ready
// Clean, maintainable, and scalable implementation

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO with modern configuration
const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : "*"),
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket'],
    pingTimeout: 60000,
    pingInterval: 25000
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://cdn.socket.io", "https://www.gstatic.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "wss:", "ws:", "https://*.firebaseapp.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
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

// Load puzzles
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
    console.log(`✅ Loaded ${puzzles.length} puzzles`);
} catch (error) {
    console.error('❌ Error loading puzzles:', error);
    puzzles = [
        { symbols: '🎵 + 🏠', answer: 'music house', alternatives: ['musichouse', 'music house'], difficulty: 'easy', points: 10 },
        { symbols: '☀️ + 🌊', answer: 'sun water', alternatives: ['sunwater', 'sun water'], difficulty: 'easy', points: 10 },
        { symbols: '🚗 + 🏠', answer: 'car house', alternatives: ['carhouse', 'car house', 'garage'], difficulty: 'easy', points: 10 }
    ];
}

// Game state management
class GameManager {
    constructor() {
        this.rooms = new Map();
        this.players = new Map();
        this.leaderboard = new Map();
        this.gameHistory = [];
        this.userBalances = new Map();
    }

    // Room management
    createRoom(roomId, roomData) {
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
            createdAt: new Date()
        };
        
        this.rooms.set(roomId, room);
        return room;
    }

    joinRoom(roomId, playerId, playerName) {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        if (room.status !== 'waiting' || room.players.length >= room.maxPlayers) {
            return null;
        }

        room.players.push(playerId);
        room.playerNames.push(playerName);
        room.scores[playerId] = 0;
        room.prizePool += (room.entryFee * 100);

        return room;
    }

    startGame(roomId) {
        const room = this.rooms.get(roomId);
        if (!room || room.players.length < 2) return null;

        room.status = 'playing';
        room.gameStarted = true;
        room.currentRound = 1;
        room.answers = {};

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
        if (!room || room.status !== 'playing') return null;

        const playerName = this.players.get(playerId)?.name || 'Unknown';
        const isCorrect = room.currentPuzzle?.alternatives.includes(answer.toLowerCase());

        if (!room.answers[playerId]) {
            room.answers[playerId] = {
                attempts: [],
                correct: false,
                points: 0,
                playerName: playerName
            };
        }

        room.answers[playerId].attempts.push({
            answer: answer,
            correct: isCorrect,
            timestamp: new Date().toISOString()
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
            correctAnswer: room.currentPuzzle.answer
        };
    }

    endRound(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        room.currentRound++;
        
        if (room.currentRound > room.totalRounds) {
            return this.endGame(roomId);
        }

        return room;
    }

    endGame(roomId) {
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
        
        const results = {
            winner: rankings[0].playerName,
            finalScores: room.scores,
            rankings: rankings,
            payoutStructure: payoutStructure,
            totalPot: payoutStructure.totalPot,
            houseTake: payoutStructure.houseTake,
            playerPot: payoutStructure.playerPot
        };

        // Update leaderboard
        this.updateLeaderboard(rankings, room.entryFee);

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

// Initialize game manager
const gameManager = new GameManager();

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

    // Create room
    socket.on('create_room', (data) => {
        const player = gameManager.players.get(socket.id);
        if (!player) return;

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
        console.log(`🏠 Room created: ${roomId} by ${player.name}`);
    });

    // Join room
    socket.on('join_room', (data) => {
        const player = gameManager.players.get(socket.id);
        if (!player) return;

        const room = gameManager.joinRoom(data.roomId, socket.id, player.name);
        if (!room) {
            socket.emit('error', { message: 'Cannot join room' });
            return;
        }

        socket.join(data.roomId);
        player.roomId = data.roomId;

        io.to(data.roomId).emit('room_updated', room);
        socket.emit('room_joined', { roomId: data.roomId, room });
        console.log(`🚪 Player joined room: ${player.name} -> ${data.roomId}`);
    });

    // Start game
    socket.on('start_game', (data) => {
        const room = gameManager.startGame(data.roomId);
        if (!room) {
            socket.emit('error', { message: 'Cannot start game' });
            return;
        }

        io.to(data.roomId).emit('game_started', room);
        console.log(`🎮 Game started in room: ${data.roomId}`);
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

    // Time up
    socket.on('time_up', (data) => {
        const room = gameManager.endRound(data.roomId);
        if (room) {
            if (room.currentRound > room.totalRounds) {
                const results = gameManager.endGame(data.roomId);
                io.to(data.roomId).emit('game_ended', results);
            } else {
                // Start next round
                setTimeout(() => {
                    const difficultyPuzzles = gameManager.getPuzzleByDifficulty(room.currentRound);
                    const puzzle = difficultyPuzzles[Math.floor(Math.random() * difficultyPuzzles.length)];
                    room.currentPuzzle = puzzle;
                    
                    io.to(data.roomId).emit('question_updated', {
                        ...puzzle,
                        round: room.currentRound,
                        timeLimit: 30
                    });
                }, 3000);
            }
        }
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
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Symbol Duel server running on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} to play`);
    console.log(`📊 Loaded ${puzzles.length} puzzles`);
});

module.exports = { app, server, io };
