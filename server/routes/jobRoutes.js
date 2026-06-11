import express from "express";
import { createJob, getJobs, getJobById, getCandidatesByJob } from "../controllers/jobController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createJobValidation } from "../middlewares/jobValidation.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post(
  "/jobs",
  authMiddleware,
  createJobValidation,
  validateRequest,
  createJob
);

router.get("/jobs", authMiddleware, getJobs);

router.get("/jobs/:jobId", authMiddleware, getJobById);

router.get("/jobs/:jobId/candidates", authMiddleware, getCandidatesByJob);

export default router;