import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import handleLiveChat from './socket/liveChat.js';
import handlePlaybackSync from './socket/playbackSync.js';

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST"]
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

// Create HTTP server for WebSocket support
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// WebSocket Handlers
io.on("connection", (socket) => {
  console.log(`🔗 New client connected: ${socket.id}`);
  handlePlaybackSync(io, socket);
  handleLiveChat(io, socket);

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Basic route to check if the backend is up
app.get('/', (req, res) => {
  res.send('Welcome to the Online Streaming Application Backend!');
});

// Start the server with WebSocket support
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});