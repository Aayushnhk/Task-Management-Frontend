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

// LOGIN: Calls API, stores Access Token (FIXED to include credentials)
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Must send cookie for Refresh Token
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

// LOGOUT: Clears local token and calls backend to clear cookie (NEW)
export const logout = async () => {
    // 1. Clear tokens locally (Access Token)
    clearTokens();

    // 2. Call the backend logout endpoint to clear the HTTP-Only Refresh Token cookie
    const response = await fetch(`${API_BASE_URL}auth/logout`, {
        method: 'POST',
        credentials: 'include', // Needed to send the cookie back for clearing
    });
    
    // We don't throw an error here, as we want the local session cleared regardless.
    return;
};