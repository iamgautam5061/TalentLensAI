import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { uploadResume } from "../api/uploadApi";
import { useAuth } from "../hooks/useAuth";
import { getJobById, getJobCandidates } from "../api/jobsApi";
import { exportCandidatesToCSV } from "../utils/csvExport";

// Match score color
const getScoreColor = (score) => {
  if (score >= 70) return "bg-success";
  if (score >= 40) return "bg-warning";
  return "bg-danger";
};

// Interview badge
const InterviewBadge = ({ value }) => {
  const isYes = value === "YES";
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isYes ? "bg-success-light text-success" : "bg-danger-light text-danger"}`}>
      {isYes ? "✓ Interview" : "✗ No Interview"}
    </span>
  );
};

// Skeleton loader
const SkeletonJobDetails = () => (
  <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
    <div className="h-4 bg-border rounded w-32 mb-6" />
    <div className="h-8 bg-border rounded w-64 mb-3" />
    <div className="h-4 bg-border rounded w-48 mb-8" />
    <div className="bg-surface rounded-xl border border-border p-6 mb-4">
      <div className="h-4 bg-border rounded w-full mb-3" />
      <div className="h-4 bg-border rounded w-3/4" />
    </div>
  </div>
);

const JobDetails = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [candidateCountBeforeUpload, setCandidateCountBeforeUpload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { jobId } = useParams();
  const { token } = useAuth();

  const filteredCandidates = candidates.filter((candidate) => {
    const fullName = `${candidate.firstName} ${candidate.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchCandidates = async () => {
    const candidateData = await getJobCandidates(jobId, token);
    setCandidates(candidateData);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("jobId", jobId);

      setCandidateCountBeforeUpload(candidates.length);

      await uploadResume(formData, token);

      setIsPolling(true);
      setSelectedFile(null);

      toast.success("Resume uploaded successfully");
      toast.loading("AI analysis in progress...", {
        id: "candidate-processing",
      });

      await fetchCandidates();

    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobData, candidateData] = await Promise.all([
          getJobById(jobId, token),
          getJobCandidates(jobId, token),
        ]);
        setJob(jobData);
        setCandidates(candidateData);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, token]);

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      fetchCandidates();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPolling]);

  useEffect(() => {
    if (!isPolling) return;

    if (candidates.length > candidateCountBeforeUpload) {
      setIsPolling(false);
      toast.success("Candidate analysis completed", {
        id: "candidate-processing",
      });
    }
  }, [candidates, isPolling, candidateCountBeforeUpload]);

  // Loading state
  if (loading) return <SkeletonJobDetails />;

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-danger-light border border-danger/20 rounded-xl p-6 text-center">
          <p className="text-danger font-medium mb-1">Something went wrong</p>
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  // Job not found
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <p className="text-lg font-semibold text-text-primary mb-2">Job not found</p>
          <p className="text-sm text-text-secondary mb-6">This job may have been removed.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 min-h-[calc(100vh-4rem)]">

      {/* Back navigation */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 flex items-center gap-1 cursor-pointer"
      >
        ← Back to Dashboard
      </button>

      {/* Job header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          {job.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {job.location && (
            <span className="text-sm text-text-secondary bg-surface border border-border px-3 py-1 rounded-full">
              📍 {job.location}
            </span>
          )}
          {job.employmentType && (
            <span className="text-sm text-text-secondary bg-surface border border-border px-3 py-1 rounded-full">
              💼 {job.employmentType}
            </span>
          )}
          {job.experienceRequired && (
            <span className="text-sm text-text-secondary bg-surface border border-border px-3 py-1 rounded-full">
              🕒 {job.experienceRequired} yrs exp
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          {job.description}
        </p>

        {/* Required skills */}
        {job.requiredSkills?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-2">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-primary-light text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload section */}
      <div
        className="bg-surface rounded-xl border border-border p-6 mb-8 shadow-sm"
      >
        <h2 className="text-base font-semibold text-text-primary mb-4">
          Upload Resume
        </h2>

        <div className="flex items-center gap-4">

          {/* File input */}
          <label className="flex-1 flex items-center gap-3 px-4 py-3 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 transition-colors bg-bg">
            <span className="text-lg">📄</span>
            <span className="text-sm text-text-secondary truncate">
              {selectedFile ? selectedFile.name : "Choose a PDF or DOCX file"}
            </span>
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </label>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={uploading || isPolling}
            className="shrink-0 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

        </div>

        {/* Polling indicator */}
        {isPolling && (
          <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            AI is analysing the resume...
          </div>
        )}

      </div>

      {/* Candidates section */}
      <div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">
            Ranked Candidates
            {candidates.length > 0 && (
              <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-primary-light text-primary rounded-full">
                {candidates.length}
              </span>
            )}
          </h2>

          {/* Right side — search + export */}
          {candidates.length > 0 && (
            <div className="flex items-center gap-3">

              {/* Search */}
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 px-3.5 py-2 text-sm rounded-md border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />

              {/* Export CSV button */}
              <button
                onClick={() => exportCandidatesToCSV(candidates, job.title)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md text-text-secondary hover:border-primary hover:text-primary transition-colors cursor-pointer bg-surface"
              >
                ↓ Export CSV
              </button>

            </div>
          )}
        </div>

        {/* Empty state */}
        {candidates.length === 0 ? (
          <div className="bg-surface rounded-xl border border-border p-12 text-center shadow-sm">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-base font-semibold text-text-primary mb-1">
              No candidates yet
            </p>
            <p className="text-sm text-text-secondary">
              Upload a resume above to start screening candidates with AI.
            </p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="bg-surface rounded-xl border border-border p-8 text-center shadow-sm">
            <p className="text-sm text-text-secondary">
              No candidates match "<strong>{searchTerm}</strong>"
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.candidateId}
                onClick={() => navigate(`/candidate/${candidate.candidateId}`)}
                className="bg-surface rounded-xl border border-border p-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">

                  {/* Left: rank + name */}
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary-light text-primary text-xs font-semibold flex items-center justify-center">
                      #{candidate.rank}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {candidate.firstName} {candidate.lastName}
                      </p>
                      <p className="text-xs text-text-muted">
                        {candidate.email}
                      </p>
                    </div>
                  </div>

                  {/* Right: interview badge */}
                  <InterviewBadge
                    value={candidate.interviewRecommendation}
                  />

                </div>

                {/* Match score bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">
                      Match Score
                    </span>
                    <span className="text-xs font-semibold text-text-primary">
                      {candidate.matchScore}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getScoreColor(candidate.matchScore)}`}
                      style={{ width: `${candidate.matchScore}%` }}
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;