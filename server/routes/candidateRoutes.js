import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  getCandidateById,
} from "../controllers/candidateController.js";

const router = express.Router();

router.get(
  "/candidates/:candidateId",
  authMiddleware,
  getCandidateById
);

export default router;