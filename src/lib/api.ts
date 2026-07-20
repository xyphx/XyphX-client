/**
 * Enterprise-grade centralized API client.
 * Automatically prepends the base URL and attaches Authorization headers.
 */

import { store } from '../store/store';
import { setCredentials, logout } from '../store/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface RequestOptions extends RequestInit {
  // Add custom options here if needed in the future
}

export const api = {
  /**
   * Generic request handler
   */
  async request<T>(endpoint: string, options: RequestOptions = {}, isRetry = false): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = new Headers(options.headers || {});
    
    // Attach token from Redux
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Default to JSON for payloads if not explicitly set
    if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
        headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Automatically send and receive HttpOnly cookies
    };

    let response = await fetch(url, config);

    // Global interceptor logic for 401 Unauthorized
    if (response.status === 401 && !isRetry && !endpoint.includes('/api/auth/')) {
      // Attempt refresh token
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          // Dispatch new token to Redux
          store.dispatch(setCredentials({ accessToken: data.accessToken }));
          
          // Retry original request with new token
          headers.set('Authorization', `Bearer ${data.accessToken}`);
          const retryConfig: RequestInit = {
            ...options,
            headers,
            credentials: 'include',
          };
          response = await fetch(url, retryConfig);
        } else {
          // Refresh token invalid or expired, log user out
          store.dispatch(logout());
          window.location.href = '/login';
        }
      } catch (err) {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }

    return response;
  },

  /**
   * GET request
   */
  get(endpoint: string, options: RequestOptions = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post(endpoint: string, body: any, options: RequestOptions = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * PUT request
   */
  put(endpoint: string, body: any, options: RequestOptions = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * DELETE request
   */
  delete(endpoint: string, options: RequestOptions = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
};
