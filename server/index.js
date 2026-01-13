import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Send message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log("Message:", data);
  });

  // Typing
  socket.on("typing", ({ username, room }) => {
    socket.to(room).emit("user_typing", username);
  });

  // Stop typing (optional but professional)
  socket.on("stop_typing", (room) => {
    socket.to(room).emit("stop_typing");
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("Socket server running on port 3001");
});
