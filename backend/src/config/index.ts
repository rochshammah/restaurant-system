import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Environment
  env: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Server
  port: parseInt(process.env.PORT || "5000"),
  apiUrl: process.env.API_URL || "http://localhost:5000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Database
  databaseUrl: process.env.DATABASE_URL || "",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key",
  jwtExpiry: process.env.JWT_EXPIRY || "24h",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",

  // WebSocket
  wsPort: parseInt(process.env.WS_PORT || "5001"),
  wsCorOrigin: process.env.WS_CORS_ORIGIN || "http://localhost:3000",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",

  // Security
  corsOrigin: process.env.FRONTEND_URL || "http://localhost:3000",
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100, // requests per window

  // AWS/S3 (for future image uploads)
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "us-east-1",
    s3Bucket: process.env.AWS_S3_BUCKET || "",
  },

  // Stripe (for future payments)
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.STRIPE_PUBLIC_KEY || "",
  },
};

export default config;
