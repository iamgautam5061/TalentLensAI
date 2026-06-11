import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { registerValidation, loginValidation } from '../middlewares/authValidation.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import { loginLimiter, registerLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  registerLimiter,
  registerValidation,
  validateRequest,
  register
);

router.post(
  '/login',
  loginLimiter,
  loginValidation,
  validateRequest,
  login
);

export default router;