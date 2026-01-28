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
app.use(cors());

// Database connection promise
let dbConnected = false;

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
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

// For local development with Socket.IO
if (process.env.NODE_ENV !== "production") {
    const http = await import("http");
    const { Server } = await import("socket.io");

    const server = http.default.createServer(app);

    // Initialize socket.io server
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    // store online users
    const userSocketMap = {}; // {userId: socketId}

    // socket.io connection handler
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        console.log("User Connected", userId);

        if (userId) userSocketMap[userId] = socket.id;

        // emit online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log("User Disconnected", userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => console.log("Server is running on PORT : " + PORT));
} else {
    // Connect to MongoDB for production (Vercel)
    await connectDB();
}

// export app for Vercel serverless functions
export default app;