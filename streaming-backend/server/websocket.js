const { Server } = require("socket.io");

const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*", // Secure CORS configuration
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ New client connected: ${socket.id}`);

    // Join a specific video room
    socket.on("join-video", ({ videoId, userId }) => {
      socket.join(videoId);
      console.log(`👤 User ${userId} joined room ${videoId}`);

      // Broadcast updated user count in the room
      const usersInRoom = io.sockets.adapter.rooms.get(videoId)?.size || 0;
      io.to(videoId).emit("room-user-count", usersInRoom);
    });

    // Handle playback sync (play, pause, seek)
    socket.on("sync-playback", ({ videoId, action, currentTime, userId }) => {
      console.log(`🎬 Syncing ${action} at ${currentTime}s for video ${videoId} (User: ${userId})`);
      socket.to(videoId).emit("update-playback", { action, currentTime });
    });

    // Handle users leaving a video room
    socket.on("leave-video", ({ videoId, userId }) => {
      socket.leave(videoId);
      console.log(`🚪 User ${userId} left room ${videoId}`);

      // Broadcast updated user count in the room
      const usersInRoom = io.sockets.adapter.rooms.get(videoId)?.size || 0;
      io.to(videoId).emit("room-user-count", usersInRoom);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = setupWebSocket;
