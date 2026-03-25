import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.AUTH_SECRET || "dev-secret";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN.split(","),
    methods: ["GET", "POST"],
  },
});

// 認證 middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("未提供認證 token"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.data.userId = decoded.id || decoded.sub;
    next();
  } catch {
    next(new Error("認證失敗"));
  }
});

// 追蹤用戶所在的對話房間
const userSockets = new Map(); // userId -> Set<socketId>

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  console.log(`User connected: ${userId}`);

  // 追蹤用戶連線
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId).add(socket.id);

  // 加入對話房間
  socket.on("join-conversation", (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`User ${userId} joined conversation:${conversationId}`);
  });

  // 離開對話房間
  socket.on("leave-conversation", (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // 發送訊息（廣播給同一對話的其他人）
  socket.on("send-message", (data) => {
    const { conversationId, message } = data;
    // 廣播給同一對話房間的其他成員（不包括發送者）
    socket.to(`conversation:${conversationId}`).emit("new-message", {
      conversationId,
      message,
    });
  });

  // 正在輸入狀態
  socket.on("typing", (data) => {
    const { conversationId } = data;
    socket.to(`conversation:${conversationId}`).emit("user-typing", {
      conversationId,
      userId,
    });
  });

  socket.on("stop-typing", (data) => {
    const { conversationId } = data;
    socket.to(`conversation:${conversationId}`).emit("user-stop-typing", {
      conversationId,
      userId,
    });
  });

  // 斷線
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    const sockets = userSockets.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        userSockets.delete(userId);
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
