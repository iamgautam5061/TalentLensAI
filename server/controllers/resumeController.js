import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import { processCandidate } from "../services/candidateProcessingService.js";

export const uploadResume = async (req, res) => {
  try {

    const { jobId } = req.body;

    const job = await Job.findOne({
      _id: jobId,
      recruiter: req.user.recruiterId,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    const candidate = await Candidate.create({
      _id: req.candidateId,
      recruiter: req.user.recruiterId,
      job: jobId,
      resumeUrl: req.file.path,
      resumeMimeType: req.file.mimetype,
    });

    processCandidate(candidate._id);

    return res.status(201).json({
      message: "Resume uploaded successfully",
      candidateId: candidate._id,
      status: candidate.status,
    });

  } catch (error) {
    console.error(error);
  }
  return res.status(500).json({
    message: "Failed to upload resume file",
  });
}
