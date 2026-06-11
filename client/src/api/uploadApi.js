import { apiClient } from './apiClient.js';

export const uploadResume = async (formData, token) => {
  return apiClient('/upload-resumes', {
    method: 'POST',
    body: formData,
    token,
  });
};