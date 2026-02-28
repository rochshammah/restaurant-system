import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { config } from "./config";
import { errorHandler } from "./utils/errors";
import WebSocketServer from "./websocket";

// Import routes
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import menuRoutes from "./routes/menu.routes";

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer(server);

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    environment: config.env,
  });
});

// ============================================================================
// API ROUTES
// ============================================================================

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);

// ============================================================================
// 404 Handler
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: "NOT_FOUND",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// ERROR HANDLER
// ============================================================================

app.use(errorHandler);

// ============================================================================
// SERVER START
// ============================================================================

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`🚀 Restaurant System API running on port ${PORT}`);
  console.log(`Environment: ${config.env}`);
  console.log(`Database: ${config.databaseUrl ? "Connected" : "Not configured"}`);
  console.log(`WebSocket: Listening on :${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

export default app;
