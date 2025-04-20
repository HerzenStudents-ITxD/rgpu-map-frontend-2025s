const BASE_URL = 'http://http://localhost:80/';

// Common response types
interface OperationResultResponse<T> {
    success: boolean;
    result: T;
    message?: string;
}

interface FindResultResponse<T> {
    success: boolean;
    result: T[];
    totalCount: number;
    message?: string;
}

// Data models
interface UserImagesResponse {
    userId: string; // System.Guid
    avatarId: string; // System.Guid
    imageUrl: string;
    createdAt: string; // ISO date string
}

interface UserResponse {
    id: string; // System.Guid
    email: string;
    login: string;
    fullName: string;
    isActive: boolean;
    currentAvatar?: UserImagesResponse;
    avatars?: UserImagesResponse[];
    communications?: Communication[];
    university?: string;
    department?: string;
    office?: string;
    position?: string;
    role?: string;
}

interface Communication {
    id: string; // System.Guid
    type: string; // e.g., 'email', 'phone'
    value: string;
    isConfirmed: boolean;
}

interface CredentialsResponse {
    userId: string; // System.Guid
    email: string;
    login: string;
    isActive: boolean;
}

// Request DTOs
interface CreateAvatarRequest {
    userId: string; // System.Guid
    image: File; // For multipart/form-data upload
}

interface CreateUserRequest {
    email: string;
    login: string;
    fullName: string;
    password: string;
}

interface ChangePasswordRequest {
    userId: string; // System.Guid
    oldPassword: string;
    newPassword: string;
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
export const createAvatar = async (avatarData: CreateAvatarRequest): Promise<string | null> => {
    try {
        const formData = new FormData();
        formData.append('userId', avatarData.userId);
        formData.append('image', avatarData.image);

        const response = await fetch(`${BASE_URL}Avatar/create`, {
            method: 'POST',
            body: formData,
        });

        const data = await handleResponse<OperationResultResponse<string | null>>(response);
        return data.result; // Returns the created avatar ID (Nullable<Guid>)
    } catch (error) {
        console.error('Error creating avatar:', error);
        throw error;
    }
};

export const getAvatar = async (userId?: string): Promise<UserImagesResponse> => {
    try {
        const url = new URL(`${BASE_URL}Avatar/get`);
        if (userId) url.searchParams.append('userId', userId);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await handleResponse<OperationResultResponse<UserImagesResponse>>(response);
        return data.result;
    } catch (error) {
        console.error('Error fetching avatar:', error);
        throw error;
    }
};

export const createUser = async (userData: CreateUserRequest): Promise<string>