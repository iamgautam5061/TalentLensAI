import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJobs } from "../api/jobsApi";
import { useAuth } from "../hooks/useAuth";

// Employment type badge colors
const typeBadgeStyles = {
  "Full-Time": "bg-success-light text-success",
  "Part-Time": "bg-warning-light text-warning",
  "Contract": "bg-primary-light text-primary",
  "Internship": "bg-danger-light text-danger",
};

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-surface rounded-xl border border-border p-6 animate-pulse">
    <div className="h-5 bg-border rounded w-2/3 mb-3" />
    <div className="h-3.5 bg-border rounded w-1/3 mb-2" />
    <div className="h-3.5 bg-border rounded w-1/4" />
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs(token);
        setJobs(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-7 bg-border rounded w-36 mb-2 animate-pulse" />
            <div className="h-4 bg-border rounded w-56 animate-pulse" />
          </div>
          <div className="h-10 bg-border rounded-md w-28 animate-pulse" />
        </div>
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-danger-light border border-danger/20 rounded-xl p-6 text-center">
          <p className="text-danger font-medium mb-1">
            Failed to load jobs
          </p>
          <p className="text-sm text-text-secondary">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {jobs.length === 0
              ? "No jobs yet"
              : `${jobs.length} job${jobs.length > 1 ? "s" : ""} posted`
            }
          </p>
        </div>

        <button
          onClick={() => navigate("/create-job")}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
        >
          + New Job
        </button>
      </div>

      {/* Empty state */}
      {jobs.length === 0 ? (
        <div
          className="bg-surface rounded-xl border border-border p-16 text-center"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            No jobs posted yet
          </h2>
          <p className="text-sm text-text-secondary mb-6 max-w-xs mx-auto">
            Create your first job posting and start screening candidates with AI.
          </p>
          <button
            onClick={() => navigate("/create-job")}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
          >
            Create your first job
          </button>
        </div>
      ) : (

        // Job cards
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="bg-surface rounded-xl border border-border p-6 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {job.title}
                </h3>

                {job.employmentType && (
                  <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${typeBadgeStyles[job.employmentType] || "bg-primary-light text-primary"}`}>
                    {job.employmentType}
                  </span>
                )}
              </div>

              {/* Card meta */}
              <div className="flex items-center gap-4 mt-3">
                {job.location && (
                  <span className="text-sm text-text-secondary">
                    📍 {job.location}
                  </span>
                )}
                {job.experienceRequired && (
                  <span className="text-sm text-text-secondary">
                    💼 {job.experienceRequired} yrs exp
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      )}
    </div>
  );
};

export default Dashboard;