import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
  }
}

// Global error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  console.error("Error:", err);

  // Handle API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.code,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: err.message,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: "INVALID_TOKEN",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      success: false,
      message: "Database error",
      error: err.message,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Default error
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Async wrapper for error handling
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Success response helper
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  } as ApiResponse<T>);
};
