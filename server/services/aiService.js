import { GoogleGenAI } from '@google/genai';

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export const analyzeResume = async ({ text, job }) => {

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });


  const prompt = `
You are an ATS screening assistant.

Compare the candidate resume against the job requirements.

Return ONLY valid JSON.

Do not return markdown.
Do not return code fences.
Do not return explanations.

Required JSON structure:

{
  "firstName": "",
  "lastName": "",
  "email": "",
  "summary": "",
  "skills": [],
  "matchScore": 0,
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "recommendation": "",
  "interviewRecommendation": "",
  "reasoning": ""
}

Rules:

- matchScore must be between 0 and 100
- skills must be an array of strings
- missingSkills must be an array of strings
- strengths must be an array of strings
- weaknesses must be an array of strings
- recommendation should be concise
- interviewRecommendation should be YES or NO
- reasoning should explain the decision

Evaluation Priorities:

1. Required Skills Match (50%)
2. Relevant Experience (20%)
3. Transferable Technical Skills (15%)
4. Education and Certifications (10%)
5. Overall Profile Strength (5%)

Scoring Guidelines:

90-100:
Excellent match. Candidate meets nearly all requirements.

70-89:
Strong match. Missing only a few non-critical skills.

50-69:
Moderate match. Has some relevant skills but important gaps exist.

30-49:
Weak match. Limited overlap with job requirements but possesses transferable technical skills.

1-29:
Very poor match. Few relevant skills but has some professional or technical background.

0:
Only use 0 when the resume is completely unrelated to the role or cannot be evaluated.

JOB TITLE:
${job.title}

JOB DESCRIPTION:
${job.description}

REQUIRED SKILLS:
${job.requiredSkills.join(", ")}

EXPERIENCE REQUIRED:
${job.experienceRequired}

RESUME:

${text}
`;


  let response;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      break;

    } catch (error) {

      const status = error?.status;

      const shouldRetry =
        status === 429 ||
        status === 503;

      const isLastAttempt =
        attempt === 3;

      if (!shouldRetry || isLastAttempt) {
        throw error;
      }

      const delay =
        Math.pow(2, attempt) * 1000;

      console.log(
        `Gemini retry ${attempt}/3 in ${delay}ms`
      );

      await sleep(delay);
    }
  }

  let cleanedResponse = response.text.trim();

  cleanedResponse = cleanedResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  const analysis = JSON.parse(cleanedResponse);

  return analysis;

};
