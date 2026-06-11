import { apiClient } from './apiClient.js';

export const getJobs = async (token) => {
  return apiClient('/jobs', { token });
};

export const getJobById = async (jobId, token) => {
  return apiClient(`/jobs/${jobId}`, { token });
};

export const getJobCandidates = async (jobId, token) => {
  return apiClient(`/jobs/${jobId}/candidates`, { token });
};

export const createJob = async (jobData, token) => {
  return apiClient('/jobs', {
    method: 'POST',
    body: jobData,
    token,
  });
};