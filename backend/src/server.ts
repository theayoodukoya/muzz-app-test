import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import messageRoutes from './routes/messages.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/messages', messageRoutes);

// Simple ID counter for messages
let messageIdCounter = 1000;

// Track users in conversations
const conversationUsers = new Map<string, Set<string>>();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-conversation', (conversationId) => {
    console.log(
      `[Backend] Socket ${socket.id} joining conversation ${conversationId}`
    );

    // Leave any previous conversations
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        console.log(`[Backend] Socket ${socket.id} leaving room ${room}`);
        socket.leave(room);
        // Remove from conversation tracking
        if (conversationUsers.has(room)) {
          conversationUsers.get(room)?.delete(socket.id);
          if (conversationUsers.get(room)?.size === 0) {
            conversationUsers.delete(room);
          }
        }
      }
    });

    // Join new conversation
    socket.join(conversationId);

    // Track user in conversation
    if (!conversationUsers.has(conversationId)) {
      conversationUsers.set(conversationId, new Set());
    }
    conversationUsers.get(conversationId)?.add(socket.id);

    console.log(
      `[Backend] Socket ${socket.id} joined conversation ${conversationId}`
    );
    console.log(
      `[Backend] Conversation ${conversationId} now has ${
        conversationUsers.get(conversationId)?.size
      } users`
    );
    console.log(
      `[Backend] Socket ${socket.id} is now in rooms:`,
      Array.from(socket.rooms)
    );
  });

  socket.on('send-message', (messageData) => {
    // Create proper message with unique ID and valid timestamp
    const message = {
      id: ++messageIdCounter, // Unique incrementing ID
      senderId: Number(messageData.senderId),
      recipientId: Number(messageData.recipientId),
      content: String(messageData.content),
      timestamp: new Date().toISOString(), // Valid ISO timestamp
    };

    console.log('Broadcasting message:', message);

    // Broadcast to all users in the conversation
    const conversationId = `${Math.min(
      message.senderId,
      message.recipientId
    )}-${Math.max(message.senderId, message.recipientId)}`;
    socket.to(conversationId).emit('new-message', message);
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);

    // Clean up conversation tracking
    conversationUsers.forEach((users, conversationId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        if (users.size === 0) {
          conversationUsers.delete(conversationId);
        }
        console.log(`Removed ${socket.id} from conversation ${conversationId}`);
      }
    });
  });
});

// Start the server on port 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
