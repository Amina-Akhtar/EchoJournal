const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/messageModel");
const dotenv = require('dotenv');
dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors:
  {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};

io.on("connect", (socket) => {
  console.log("User connected ", socket.id);
  socket.on("send-message", async (data) => {
    try {
      const { sender, content } = data;
      const message = new Message({
        sender: sender,
        content: content,
      });
      await message.save();
      // Emit to everyone 
      io.emit("emit-message", message);
    } catch (error) {
      console.error("Error saving message", error);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("User disconnected:", socket.id, reason);
  });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const userRoutes = require('./routes/userRoutes');
app.use("/api/user", userRoutes);

const postRoutes = require('./routes/postRoutes')
app.use("/api/posts", postRoutes)

const notificationRoutes = require('./routes/notificationRoutes')
app.use("/api/notifications", notificationRoutes)

const messageRoutes = require('./routes/messageRoutes')
app.use("/api/messages", messageRoutes)

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
});