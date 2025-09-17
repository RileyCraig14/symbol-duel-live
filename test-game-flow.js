#!/usr/bin/env node

// Simple test script to verify game flow
const io = require('socket.io-client');

console.log('🧪 Testing Symbol Duel Game Flow...\n');

// Test configuration
const SERVER_URL = process.env.SERVER_URL || 'https://symbol-duel-live.onrender.com';
const TEST_USERS = [
    { email: 'test1@example.com', password: 'password123' },
    { email: 'test2@example.com', password: 'password123' }
];

async function testGameFlow() {
    console.log('1. Testing server connection...');
    
    try {
        const socket = io(SERVER_URL, {
            transports: ['websocket'],
            timeout: 10000
        });

        socket.on('connect', () => {
            console.log('✅ Connected to server');
            
            // Test authentication
            socket.emit('authenticate', { userId: 'test-user-1' });
            
            // Test room creation
            socket.emit('create_room', { 
                roomName: 'Test Room', 
                entryFee: 10 
            });
            
            socket.on('room_created', (data) => {
                console.log('✅ Room created:', data.roomId);
                socket.roomId = data.roomId;
                
                // Test starting game (now works with single player)
                socket.emit('start_game', { roomId: data.roomId });
            });
            
            socket.on('game_started', (room) => {
                console.log('✅ Game started with', room.players.length, 'players');
            });
            
            socket.on('question_updated', (question) => {
                console.log('✅ Question received:', question.symbols);
                console.log('   Answer:', question.answer);
                console.log('   Time limit:', question.timeLimit, 'seconds');
                
                // Test answer submission
                setTimeout(() => {
                    socket.emit('submit_answer', {
                        roomId: socket.roomId,
                        answer: question.answer
                    });
                }, 1000);
            });
            
            socket.on('answer_result', (result) => {
                console.log('✅ Answer result:', result.correct ? 'CORRECT' : 'INCORRECT');
                console.log('   Points:', result.points);
            });
            
            socket.on('game_ended', (results) => {
                console.log('✅ Game ended!');
                console.log('   Winner:', results.winner);
                console.log('   Total pot:', results.totalPot);
                console.log('   Payouts:', results.payoutStructure?.payouts);
                
                socket.disconnect();
                console.log('\n🎉 All tests completed successfully!');
                process.exit(0);
            });
            
            socket.on('error', (error) => {
                console.log('❌ Error:', error.message);
            });
        });

        socket.on('connect_error', (error) => {
            console.log('❌ Connection failed:', error.message);
            process.exit(1);
        });

        // Timeout after 30 seconds
        setTimeout(() => {
            console.log('❌ Test timeout');
            process.exit(1);
        }, 30000);

    } catch (error) {
        console.log('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run the test
testGameFlow();
