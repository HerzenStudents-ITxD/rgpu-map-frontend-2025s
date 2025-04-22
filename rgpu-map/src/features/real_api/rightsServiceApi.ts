import { getAccessToken } from '../../utils/tokenService';

const BASE_URL = 'http://localhost:81/';

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
interface RightInfo {
    id: string; // System.Guid
    name: string;
    description: string;
}

interface RoleInfo {
    id: string; // System.Guid
    name: string;
    isActive: boolean;
    rights: string[]; // Array of Right IDs (Guids)
}

interface RoleResponse {
    id: string; // System.Guid
    name: string;
    isActive: boolean;
    rights: RightInfo[];
    localizedName?: string; // Based on locale
}

// Request DTOs
interface CreateRoleRequest {
    name: string;
    rightIds: string[]; // Array of Right IDs (Guids)
}

interface EditUserRoleRequest {
    userId: string; // System.Guid
    roleId: string; // System.Guid
}

interface CreateRoleLocalizationRequest {
    roleId: string; // System.Guid
    locale: string;
    name: string;
}

interface EditRoleLocalizationRequest {
    name?: string;
}

interface UpdateRoleRightsRequest {
    roleId: string; // System.Guid
    rightIds: string[]; // Array of Right IDs (Guids)
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
export const get = async (locale?: string): Promise<RightInfo[]> => {
    try {
        const url = new URL(`${BASE_URL}Rights/get`);
        if (locale) url.searchParams.append('locale', locale);

        const token = getAccessToken();
        console.log('Token being sent to RightsService:', token); // Отладочный лог
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Изменено с 'Authorization' на 'token'
        } else {
            console.warn('No token found for RightsService request');
        }

        console.log('Request headers:', headers); // Отладочный лог

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const data = await handleResponse<OperationResultResponse<RightInfo[]>>(response);
        return data.result;
    } catch (error) {
        console.error('Error fetching rights:', error);
        throw error;
    }
};

export const createRole = async (roleData: CreateRoleRequest): Promise<string> => {
    try {
        const token = getAccessToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Изменено с 'Authorization' на 'token'
        }

        const response = await fetch(`${BASE_URL}Roles/create`, {
            method: 'POST',
            headers,
            body: JSON.stringify(roleData),
        });

        const data = await handleResponse<OperationResultResponse<string>>(response);
        return data.result;
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
};

export const findRoles = async ({
    includeDeactivated = false,
    locale,
    skipCount = 0,
    takeCount = 10,
}: {
    includeDeactivated?: boolean;
    locale?: string;
    skipCount?: number;
    takeCount?: number;
}): Promise<{ roles: RoleInfo[]; total: number }> => {
    try {
        const url = new URL(`${BASE_URL}Roles/find`);
        url.searchParams.append('includedeactivated', includeDeactivated.toString());
        if (locale) url.searchParams.append('locale', locale);
        url.searchParams.append('skipcount', skipCount.toString());
        url.searchParams.append('takecount', takeCount.toString());

        const token = getAccessToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Изменено с 'Authorization' на 'token'
        }

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const data = await handleResponse<FindResultResponse<RoleInfo>>(response);
        return {
            roles: data.result || [],
            total: data.totalCount || 0,
        };
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

export const getRole = async ({ roleId, locale }: { roleId?: string; locale?: string }): Promise<RoleResponse> => {
    try {
        const url = new URL(`${BASE_URL}Roles/get`);
        if (roleId) url.searchParams.append('roleid', roleId);
        if (locale) url.searchParams.append('locale', locale);

        const token = getAccessToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Изменено с 'Authorization' на 'token'
        }

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const data = await handleResponse<OperationResultResponse<RoleResponse>>(response);
        return data.result;
    } catch (error) {
        console.error('Error fetching role:', error);
        throw error;
    }
};

export const changeRoleStatus = async (roleId: string, isActive: boolean): Promise<boolean> => {
    try {
        const url = new URL(`${BASE_URL}Roles/editstatus`);
        url.searchParams.append('roleId', roleId);
        url.searchParams.append('isActive', isActive.toString());

        const token = getAccessToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Изменено с 'Authorization' на 'token'
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers,
        });

        const data = await handleResponse<OperationResultResponse<boolean>>(response);
        return data.result;
    } catch (error) {
        console.error('Error changing role status:', error);
        throw error;
    }
};

export const updateRoleRights = async (request: UpdateRoleRightsRequest): Promise<boolean> => {
    try {
        const token = getAccessToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Изменено с 'Authorization' на 'token'
        }

        const response = await fetch(`${BASE_URL}Roles/updaterightsset`, {
            method: 'POST',
            headers,
            body: JSON.stringify(request),
        });

        const data = await handleResponse<OperationResultResponse<boolean>>(response);
        return data.result;
    } catch (error) {
        console.error('Error updating role rights:', error);
        throw error;
    }
};

export const createRoleLocalization = async (request: CreateRoleLocalizationRequest): Promise<string> => {
    try {
        const token = getAccessToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Изменено с 'Authorization' на 'token'
        }

        const response = await fetch(`${BASE_URL}RoleLocalization/create`, {
            method: 'POST',
            headers,
            body: JSON.stringify(request),
        });

        const data = await handleResponse<OperationResultResponse<string>>(response);
        return data.result;
    } catch (error) {
        console.error('Error creating role localization:', error);
        throw error;
    }
};

export const editRoleLocalization = async (roleLocalizationId: string, request: EditRoleLocalizationRequest): Promise<boolean> => {
    try {
        const url = new URL(`${BASE_URL}RoleLocalization/edit`);
        url.searchParams.append('roleLocalizationId', roleLocalizationId);

        const token = getAccessToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Изменено с 'Authorization' на 'token'
        }

        const response = await fetch(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(request),
        });

        const data = await handleResponse<OperationResultResponse<boolean>>(response);
        return data.result;
    } catch (error) {
        console.error('Error editing role localization:', error);
        throw error;
    }
};

export const edit = async (request: EditUserRoleRequest): Promise<boolean> => {
    try {
        const token = getAccessToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['token'] = token; // Изменено с 'Authorization' на 'token'
        }

        const response = await fetch(`${BASE_URL}User/edit`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(request),
        });

        const data = await handleResponse<OperationResultResponse<boolean>>(response);
        return data.result;
    } catch (error) {
        console.error('Error editing user role:', error);
        throw error;
    }
};