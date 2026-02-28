import { Request, Response, NextFunction } from "express";
import { ApiError, asyncHandler } from "../utils/errors";
import { verifyToken } from "../utils/auth";
import { UserRole } from "../types";

// Authentication middleware
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "No token provided", "NO_TOKEN");
    }

    try {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token", "INVALID_TOKEN");
    }
  }
);

// Authorization middleware - checks user role
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated", "NOT_AUTHENTICATED");
    }

    if (!roles.includes(req.user.role as UserRole)) {
      throw new ApiError(
        403,
        "Insufficient permissions",
        "INSUFFICIENT_PERMISSIONS"
      );
    }

    next();
  };
};

// Check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated", "NOT_AUTHENTICATED");
  }

  if (req.user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Admin access required", "ADMIN_REQUIRED");
  }

  next();
};

// Check if user is kitchen staff
export const isKitchen = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated", "NOT_AUTHENTICATED");
  }

  if (req.user.role !== UserRole.KITCHEN) {
    throw new ApiError(403, "Kitchen access required", "KITCHEN_REQUIRED");
  }

  next();
};
