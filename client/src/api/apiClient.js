import { API_BASE_URL } from './config.js';

export const apiClient = async (endpoint, options = {}) => {
  const {
    token,
    body,
    method = 'GET',
    ...rest
  } = options;

  // Build headers
  const headers = {
    ...(body && !(body instanceof FormData) && {
      'Content-Type': 'application/json',
    }),
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };

  // Build request config
  const config = {
    method,
    headers,
    ...(body && {
      body: body instanceof FormData
        ? body
        : JSON.stringify(body),
    }),
    ...rest,
  };

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    config
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};