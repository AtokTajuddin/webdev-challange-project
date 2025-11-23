import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/env.js';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, CONFIG.JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, CONFIG.JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
};
