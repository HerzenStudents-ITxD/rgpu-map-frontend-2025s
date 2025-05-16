const BASE_URL = 'https://itvd.online/api/auth/';

// Response types
interface LoginResult {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // Seconds until access token expires
}

// Request DTOs
interface LoginRequest {
    loginData: string; // Изменено с email на loginData
    password: string;
}

interface RefreshRequest {
    refreshToken: string;
}

// Utility function to handle responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    const errorMessage = error.message || 'Request failed';
    if (response.status === 401) {
      throw new Error('SESSION_EXPIRED');
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

// API Handlers
export const loginUser = async (credentials: LoginRequest): Promise<LoginResult> => {
    try {
        const response = await fetch(`${BASE_URL}Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await handleResponse<LoginResult>(response);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('tokenExpiration', (Date.now() + data.expiresIn * 1000).toString());
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const refreshToken = async (refreshData: RefreshRequest): Promise<LoginResult> => {
    try {
        const response = await fetch(`${BASE_URL}Auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(refreshData),
        });

        const data = await handleResponse<LoginResult>(response);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('tokenExpiration', (Date.now() + data.expiresIn * 1000).toString());
        return data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

