import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { getCandidateById } from "../api/candidatesApi";

// Score color utility
const getScoreColor = (score) => {
  if (score >= 70) return "bg-success";
  if (score >= 40) return "bg-warning";
  return "bg-danger";
};

const getScoreLabel = (score) => {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-danger";
};

// Skeleton loader
const SkeletonCandidate = () => (
  <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
    <div className="h-4 bg-border rounded w-32 mb-6" />
    <div className="bg-surface rounded-xl border border-border p-6 mb-6">
      <div className="h-7 bg-border rounded w-48 mb-3" />
      <div className="h-4 bg-border rounded w-32 mb-6" />
      <div className="h-3 bg-border rounded-full w-full mb-2" />
      <div className="h-3 bg-border rounded-full w-full" />
    </div>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="h-4 bg-border rounded w-24 mb-4" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-border rounded-full w-16" />
          <div className="h-6 bg-border rounded-full w-20" />
          <div className="h-6 bg-border rounded-full w-14" />
        </div>
      </div>
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="h-4 bg-border rounded w-24 mb-4" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-border rounded-full w-16" />
          <div className="h-6 bg-border rounded-full w-20" />
        </div>
      </div>
    </div>
  </div>
);

const CandidateDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const data = await getCandidateById(id, token);
        setCandidate(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, token]);

  // Loading state
  if (loading) return <SkeletonCandidate />;

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-danger-light border border-danger/20 rounded-xl p-6 text-center">
          <p className="text-danger font-medium mb-1">
            Failed to load candidate
          </p>
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  const isInterview = candidate.interviewRecommendation === "YES";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 min-h-[calc(100vh-4rem)]">

      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 flex items-center gap-1 cursor-pointer"
      >
        ← Back
      </button>

      {/* Hero card */}
      <div className="bg-surface rounded-xl border border-border p-6 mb-6 shadow-sm">

        <div className="flex items-start justify-between gap-4 mb-6">

          {/* Name + email */}
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              {candidate.firstName} {candidate.lastName}
            </h1>
            <p className="text-sm text-text-secondary">
              {candidate.email}
            </p>
          </div>

          {/* Interview badge */}
          <span className={`shrink-0 text-sm font-semibold px-4 py-1.5 rounded-full ${isInterview ? "bg-success-light text-success" : "bg-danger-light text-danger"}`}>
            {isInterview ? "✓ Recommended for Interview" : "✗ Not Recommended"}
          </span>

        </div>

        {/* Match score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">
              Match Score
            </span>
            <span className={`text-lg font-bold ${getScoreLabel(candidate.matchScore)}`}>
              {candidate.matchScore}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getScoreColor(candidate.matchScore)}`}
              style={{ width: `${candidate.matchScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-text-muted">0%</span>
            <span className="text-xs text-text-muted">100%</span>
          </div>
        </div>

      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {/* Skills */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Skills
          </h2>
          {candidate.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-success-light text-success"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">No skills listed</p>
          )}
        </div>

        {/* Missing skills */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Missing Skills
          </h2>
          {candidate.missingSkills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {candidate.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-danger-light text-danger"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">No missing skills</p>
          )}
        </div>

      </div>

      {/* Recommendation */}
      <div className="bg-surface rounded-xl border border-border p-6 mb-6 shadow-sm border-l-4 border-l-primary">
        <h2 className="text-sm font-semibold text-text-primary mb-2">
          Recommendation
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {candidate.recommendation}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-surface rounded-xl border border-border p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-text-primary mb-2">
          Summary
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {candidate.summary}
        </p>
      </div>

      {/* Strengths + Weaknesses grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {/* Strengths */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Strengths
          </h2>
          {candidate.strengths?.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {candidate.strengths.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">None listed</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Weaknesses
          </h2>
          {candidate.weaknesses?.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {candidate.weaknesses.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <span className="text-danger mt-0.5 shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">None listed</p>
          )}
        </div>

      </div>

      {/* Reasoning */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-text-primary mb-2">
          AI Reasoning
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {candidate.reasoning}
        </p>
      </div>

    </div>
  );
};

export default CandidateDetails;