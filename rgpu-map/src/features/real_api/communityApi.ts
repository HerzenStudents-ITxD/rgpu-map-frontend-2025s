import { getAccessToken } from '../../utils/tokenService';

const BASE_URL = 'http://localhost:83/';

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
interface CommunityResponse {
    id: string; // System.Guid
    name: string;
    description: string;
    createdAt: string; // ISO date string
}

interface NewsResponse {
    id: string; // System.Guid
    communityId: string; // System.Guid
    title: string;
    content: string;
    createdAt: string; // ISO date string
}

// Request DTOs
interface CreateCommunityRequest {
    name: string;
    description: string;
}

interface CreateNewsRequest {
    communityId: string; // System.Guid
    title: string;
    content: string;
}

interface ParticipateRequest {
    communityId: string; // System.Guid
    userId: string; // System.Guid
}

// Filter interface for GET requests
interface CommunityFilter {
    search?: string;
    sortItem?: keyof CommunityResponse;
    sortOrder?: 'asc' | 'desc';
}

// Utility function to handle responses
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Request failed';

        if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.message || `HTTP error! status: ${response.status}`;
        } else {
            const errorText = await response.text();
            errorMessage = errorText || `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
    }

    return response.json();
};

// API Handlers
export const fetchAllCommunities = async (filter: CommunityFilter = {}): Promise<{ communities: CommunityResponse[] }> => {
    try {
        const url = new URL(`${BASE_URL}Community/all`);
        if (filter.search) {
            url.searchParams.append('search', filter.search);
        }

        const token = getAccessToken();
        console.log('Token being sent to CommunityService:', token); // Отладочный лог
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Используем заголовок 'token'
        } else {
            console.warn('No token found for CommunityService request');
        }

        console.log('Request headers:', headers); // Отладочный лог

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const data = await handleResponse<FindResultResponse<CommunityResponse>>(response);
        let communities = data.result || [];

        if (filter.sortItem && filter.sortOrder) {
            communities = communities.sort((a, b) => {
                if (filter.sortOrder === 'asc') {
                    return a[filter.sortItem] > b[filter.sortItem] ? 1 : -1;
                }
                return a[filter.sortItem] < b[filter.sortItem] ? 1 : -1;
            });
        }

        return { communities };
    } catch (error) {
        console.error('Error fetching communities:', error);
        throw error;
    }
};

export const fetchCommunityNews = async ({
    communityId,
    page = 1,
    pageSize = 10,
}: {
    communityId?: string;
    page?: number;
    pageSize?: number;
}): Promise<{ news: NewsResponse[]; total: number }> => {
    try {
        const url = new URL(`${BASE_URL}Community/community-news`);
        if (communityId) url.searchParams.append('communityId', communityId);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('pageSize', pageSize.toString());

        const token = getAccessToken();
        console.log('Token being sent to CommunityService:', token); // Отладочный лог
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Используем заголовок 'token'
        } else {
            console.warn('No token found for CommunityService request');
        }

        console.log('Request headers:', headers); // Отладочный лог

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const data = await handleResponse<FindResultResponse<NewsResponse>>(response);
        return {
            news: data.result || [],
            total: data.totalCount || 0,
        };
    } catch (error) {
        console.error('Error fetching community news:', error);
        throw error;
    }
};

export const createCommunity = async (communityData: CreateCommunityRequest): Promise<string> => {
    try {
        const token = getAccessToken();
        console.log('Token being sent to CommunityService:', token); // Отладочный лог
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Используем заголовок 'token'
        } else {
            console.warn('No token found for CommunityService request');
        }

        console.log('Request headers:', headers); // Отладочный лог

        const response = await fetch(`${BASE_URL}Community/create`, {
            method: 'POST',
            headers,
            body: JSON.stringify(communityData),
        });

        const data = await handleResponse<OperationResultResponse<string>>(response);
        return data.result; // Returns the created community ID (Guid)
    } catch (error) {
        console.error('Error creating community:', error);
        throw error;
    }
};

export const createNews = async (newsData: CreateNewsRequest): Promise<string> => {
    try {
        const token = getAccessToken();
        console.log('Token being sent to CommunityService:', token); // Отладочный лог
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Используем заголовок 'token'
        } else {
            console.warn('No token found for CommunityService request');
        }

        console.log('Request headers:', headers); // Отладочный лог

        const response = await fetch(`${BASE_URL}Community/create-news`, {
            method: 'POST',
            headers,
            body: JSON.stringify(newsData),
        });

        const data = await handleResponse<OperationResultResponse<string>>(response);
        return data.result; // Returns the created news ID (Guid)
    } catch (error) {
        console.error('Error creating news:', error);
        throw error;
    }
};

export const participateInCommunity = async (participationData: ParticipateRequest): Promise<boolean> => {
    try {
        const token = getAccessToken();
        console.log('Token being sent to CommunityService:', token); // Отладочный лог
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Используем заголовок 'token'
        } else {
            console.warn('No token found for CommunityService request');
        }

        console.log('Request headers:', headers); // Отладочный лог

        const response = await fetch(`${BASE_URL}Community/participate`, {
            method: 'POST',
            headers,
            body: JSON.stringify(participationData),
        });

        const data = await handleResponse<OperationResultResponse<boolean>>(response);
        return data.result; // Returns boolean indicating success
    } catch (error) {
        console.error('Error participating in community:', error);
        throw error;
    }
};