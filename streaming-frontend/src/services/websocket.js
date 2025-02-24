import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; // Change this for production

const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
});

// Function to join a video room
export const joinVideoRoom = (videoId, userId) => {
  socket.emit("join-video", { videoId, userId });
};

// Function to sync playback
export const syncPlayback = (videoId, action, currentTime) => {
  socket.emit("sync-playback", { videoId, action, currentTime });
};

// Listen for playback updates
export const onPlaybackUpdate = (callback) => {
  socket.on("update-playback", callback);
};

// Disconnect socket on unmount
export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
