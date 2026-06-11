import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';

import { generalLimiter } from './middlewares/rateLimitMiddleware.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));

// Apply general rate limiter to all routes
app.use('/api', generalLimiter);

app.use('/api', authRoutes);
app.use('/api', resumeRoutes);
app.use('/api', jobRoutes);
app.use('/api', candidateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Accepting requests from: ${process.env.CLIENT_URL}`);
});