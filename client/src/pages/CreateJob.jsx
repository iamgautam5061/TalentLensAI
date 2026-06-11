import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuthContext } from "../context/AuthContext";
import { createJob } from "../api/jobsApi";

const CreateJob = () => {
  const navigate = useNavigate();
  const { token } = useAuthContext();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    experienceRequired: "",
    location: "",
    employmentType: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      title: formData.title,
      description: formData.description,
      requiredSkills: formData.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      experienceRequired: formData.experienceRequired,
      location: formData.location,
      employmentType: formData.employmentType,
    };

    try {
      setLoading(true);

      await createJob(jobData, token);

      toast.success("Job created successfully");
      navigate("/dashboard");

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm rounded-md border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 min-h-[calc(100vh-4rem)]">

      {/* Page header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors mb-4 flex items-center gap-1 cursor-pointer"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-semibold text-text-primary">
          Create New Job
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Create a job posting and start screening candidates with AI.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-surface rounded-xl border border-border p-8 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Job Title */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="title"
              className="text-sm font-medium text-text-primary"
            >
              Job Title <span className="text-danger">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Job Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-text-primary"
            >
              Job Description <span className="text-danger">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Required Skills */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="requiredSkills"
              className="text-sm font-medium text-text-primary"
            >
              Required Skills <span className="text-danger">*</span>
            </label>
            <input
              id="requiredSkills"
              type="text"
              name="requiredSkills"
              placeholder="React, Node.js, MongoDB, TypeScript"
              value={formData.requiredSkills}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <p className="text-xs text-text-muted">
              Separate skills with commas. These are used by AI to score candidates.
            </p>
          </div>

          {/* Location + Employment Type */}
          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="location"
                className="text-sm font-medium text-text-primary"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="e.g. Pune, India"
                value={formData.location}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="employmentType"
                className="text-sm font-medium text-text-primary"
              >
                Employment Type
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

          </div>

          {/* Experience Required */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="experienceRequired"
              className="text-sm font-medium text-text-primary"
            >
              Experience Required (Years)
            </label>
            <input
              id="experienceRequired"
              type="number"
              name="experienceRequired"
              placeholder="e.g. 3"
              min="0"
              value={formData.experienceRequired}
              onChange={handleChange}
              className={`${inputClass} max-w-xs`}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateJob;