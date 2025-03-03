import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.PORT || 5000; // Use Render's dynamic port

// Create HTTP Server
const server = http.createServer(app);

// Initialize WebSocket Server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");

  ws.on("message", (message) => {
    console.log("Received:", message);

    // Broadcast message to all clients except sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => console.log("WebSocket disconnected"));
});

app.get("/", (req, res) => res.send("WebSocket Server Running"));

// Start Server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
