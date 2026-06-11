import Candidate from "../models/Candidate.js";

export const getCandidateById = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findOne({
      _id: candidateId,
      recruiter: req.user.recruiterId,
    });

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    return res.status(200).json(candidate);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch candidate",
    });
  }
};