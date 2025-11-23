import dotenv from 'dotenv';

dotenv.config();

const numberFromEnv = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: numberFromEnv(process.env.PORT, 3000),
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  MONGODB_URI: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/webdev'
};
