import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadResume } from "../controllers/resumeController.js";

const router = express.Router();

router.post(
  "/upload-resumes",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

export default router;
