import { apiClient } from './apiClient.js';

export const registerUser = async (userData) => {
  return apiClient('/register', {
    method: 'POST',
    body: userData,
  });
};

export const loginUser = async (credentials) => {
  return apiClient('/login', {
    method: 'POST',
    body: credentials,
  });
};