import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  transports: ["websocket"],
});

const LiveChat = () => {
  const { videoId } = useParams(); // Get the video ID from URL
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Join the chat room based on the videoId
    socket.emit("joinRoom", videoId);

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.emit("leaveRoom", videoId); // Leave the room on unmount
      socket.off("receiveMessage");
    };
  }, [videoId]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const chatMessage = {
        user: "User123", // Replace with actual username from auth
        text: message,
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", { videoId, chatMessage });
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="live-chat-container">
      <h3>Live Chat</h3>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default LiveChat;
