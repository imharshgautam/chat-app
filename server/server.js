import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// create express app
const app = express();

// middleware setup
app.use(express.json({ limit: "4mb" }));

// CORS configuration - allow all origins
app.use(cors({
    origin: true,  // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,  // End preflight requests immediately
    optionsSuccessStatus: 200  // Return 200 for OPTIONS
}));

// Database connection promise
let dbConnected = false;

// Middleware to ensure DB is connected before handling requests (skip for OPTIONS)
app.use(async (req, res, next) => {
    // Skip database connection for OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') {
        return next();
    }

    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error) {
            console.error("Database connection failed:", error);
            return res.status(503).json({ error: "Service temporarily unavailable" });
        }
    }
    next();
});

// routes setup
app.get("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Socket.IO variables (exported for messageController)
export let io = null;
export let userSocketMap = {};

// Initialize HTTP server and Socket.IO
const http = await import("http");
const { Server } = await import("socket.io");

const server = http.default.createServer(app);

// Initialize socket.io server with CORS
io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store online users
userSocketMap = {}; // {userId: socketId}

// Socket.IO connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected:", userId);

    if (userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected:", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
});