import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      experienceRequired,
      location,
      employmentType,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      requiredSkills,
      experienceRequired,
      location,
      employmentType,
      recruiter: req.user.recruiterId,
    });

    return res.status(201).json(job);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create job",
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.recruiterId,
    })
      .sort({ createdAt: -1 });

    return res.status(200).json(jobs);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch job",
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({
      _id: jobId,
      recruiter: req.user.recruiterId,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json(job);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch job",
    });
  }
};

export const getCandidatesByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({
      _id: jobId,
      recruiter: req.user.recruiterId,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const candidates = await Candidate.find({
      job: jobId,
      status: "completed",
    })
      .sort({ matchScore: -1 });

    const rankedCandidates = candidates.map((candidate, index) => ({
      rank: index + 1,
      candidateId: candidate._id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      matchScore: candidate.matchScore,
      interviewRecommendation: candidate.interviewRecommendation,
      recommendation: candidate.recommendation,
      status: candidate.status,
    }));

    return res.status(200).json(rankedCandidates);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch candidates",
    });
  }
};
