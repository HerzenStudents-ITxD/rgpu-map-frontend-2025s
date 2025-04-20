const BASE_URL = 'http:/http://localhost:82/';

// Response types
interface LoginResult {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // Seconds until access token expires
}

// Request DTOs
interface LoginRequest {
    email: string;
    password: string;
}

interface RefreshRequest {
    refreshToken: string;
}

// Utility function to handle responses
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
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
        return data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};