import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config";
import { JWTPayload } from "../types";

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// JWT token generation
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiry,
  };
  return jwt.sign(payload, config.jwtSecret as string, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: config.refreshTokenExpiry,
  };
  return jwt.sign({ id: userId }, config.refreshTokenSecret as string, options);
};

// Token verification
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwtSecret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): { id: string } => {
  return jwt.verify(token, config.refreshTokenSecret) as { id: string };
};
