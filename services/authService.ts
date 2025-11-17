// services/authService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ACCESS_TOKEN_KEY = 'accessToken';

// Helper function to handle token storage
const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

// Helper function to handle token retrieval
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
};

// Helper function to clear tokens (used for logout)
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const register = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to register.');
  }
  
  return data;
};

// LOGIN: Calls API, stores Access Token
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Throws error for 401 Unauthorized or 400 Bad Request
    throw new Error(data.message || 'Login failed.');
  }

  // Handle the logic for storing the Access Token
  if (data.accessToken) {
    setAccessToken(data.accessToken);
  }

  return data;
};