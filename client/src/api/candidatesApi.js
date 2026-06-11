import { apiClient } from './apiClient.js';

export const getCandidateById = async (candidateId, token) => {
  return apiClient(`/candidates/${candidateId}`, { token });
};