// services/apiClient.ts

import { getAccessToken, clearTokens } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Flag to prevent multiple concurrent token refresh requests
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: Error) => void }[] = [];

/**
 * Adds a request to the queue to be re-run once the token is refreshed.
 */
const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/**
 * Handles the token refresh API call using the cookie (backend does the work).
 * @returns The new Access Token.
 */
const refreshAccessToken = async (): Promise<string> => {
    try {
        const refreshResponse = await fetch(`${API_BASE_URL}auth/refresh`, {
            method: 'POST',
            // IMPORTANT: Credentials must be included for the backend to read the HTTP-Only Refresh Token cookie
            credentials: 'include', 
        });

        const data = await refreshResponse.json();

        if (!refreshResponse.ok || !data.accessToken) {
            // If refresh fails (e.g., token expired/invalid), force user logout
            clearTokens();
            throw new Error('Refresh token invalid or expired. Please log in again.');
        }

        // Store the new Access Token in local storage
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;

    } catch (error) {
        // Force client-side redirect to login page on failure
        clearTokens();
        throw error;
    }
};

/**
 * Custom fetch wrapper to handle Access Token attachment and Refreshing.
 */
export const apiClient = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    const originalRequest = { endpoint, options };
    let token = getAccessToken();

    // 1. Attach Access Token to Request
    if (token) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    
    // Set credentials for cookie handling (required for refresh token mechanism)
    options.credentials = 'include';
    
    let response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // 2. Check for Token Expiration (HTTP 401 Unauthorized)
    if (response.status === 401 && endpoint !== 'auth/refresh' && token) {
        // Prevent concurrent refresh requests
        if (isRefreshing) {
            // Queue the original request and wait for the new token
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve: (newToken) => {
                    originalRequest.options.headers = {
                        ...originalRequest.options.headers,
                        Authorization: `Bearer ${newToken}`,
                    };
                    resolve(apiClient(originalRequest.endpoint, originalRequest.options));
                }, reject });
            });
        }
        
        isRefreshing = true;

        try {
            // Get a new token using the Refresh Token cookie
            const newToken = await refreshAccessToken();
            
            // Re-run all failed requests with the new token
            processQueue(null, newToken);

            // Re-run the original request with the new token
            originalRequest.options.headers = {
                ...originalRequest.options.headers,
                Authorization: `Bearer ${newToken}`,
            };
            response = await fetch(`${API_BASE_URL}${endpoint}`, originalRequest.options);

        } catch (err: any) {
            // If refresh fails, reject all requests in the queue
            processQueue(err, null);
            // Throw error to trigger client-side redirect to login
            throw err; 
        } finally {
            isRefreshing = false;
        }
    }

    return response;
};