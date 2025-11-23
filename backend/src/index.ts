import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { CONFIG } from './config/env.js';
import { connect_db } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import workRoutes from './routes/workRoutes.js';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Rate Limiting (Prevent Brute Force / DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Standard Middleware
app.use(cors());
app.use(express.json());

// Static Files (Serve Uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/works', workRoutes);

// Database & Server Start
const startServer = async () => {
  await connect_db();
  
  app.listen(CONFIG.PORT, () => {
    console.log(`🚀 Server running securely on http://localhost:${CONFIG.PORT}`);
  });
};

startServer();