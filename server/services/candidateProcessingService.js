import Candidate from '../models/Candidate.js';
import { parseResume } from './resumeParserService.js';
import { analyzeResume } from './aiService.js';

export const processCandidate = async (candidateId) => {
  try {
    const candidate = await Candidate
      .findById(candidateId)
      .populate("job");

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    if (!candidate.job) {
      throw new Error("Job not found");
    }

    const resumeText = await parseResume({
      path: candidate.resumeUrl,
      mimetype: candidate.resumeMimeType,
    });

    const analysis = await analyzeResume({
      text: resumeText,
      job: candidate.job,
    });

    candidate.firstName = analysis.firstName;
    candidate.lastName = analysis.lastName;
    candidate.email = analysis.email;
    candidate.summary = analysis.summary;
    candidate.skills = analysis.skills;
    candidate.matchScore = analysis.matchScore;
    candidate.missingSkills = analysis.missingSkills;
    candidate.strengths = analysis.strengths;
    candidate.weaknesses = analysis.weaknesses;
    candidate.recommendation = analysis.recommendation;
    candidate.interviewRecommendation = analysis.interviewRecommendation;
    candidate.reasoning = analysis.reasoning;
    candidate.status = "completed";

    await candidate.save();

  } catch (error) {
    console.error(error);

    const candidate = await Candidate.findById(candidateId);

    if (candidate) {
      candidate.status = "failed";
      await candidate.save();
    }
  }

};
