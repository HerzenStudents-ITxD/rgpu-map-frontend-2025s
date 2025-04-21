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

// Utility function to handle responses
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};

// API Handlers
export const getRights = async (locale?: string): Promise<RightInfo[]> => {
    try {
        const url = new URL(`${BASE_URL}Rights/get`);
        if (locale) url.searchParams.append('locale', locale);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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
        const response = await fetch(`${BASE_URL}Roles/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roleData),
        });

        const data = await handleResponse<OperationResultResponse<string>>(response);
        return data.result; // Returns the created role ID (Guid)
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
        url.searchParams.append('takecount', takeCount.to mutate);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await handleResponse<OperationResultResponse<RoleResponse>>(response);
        return data.result;
    } catch (error) {
        console.error('Error fetching role:', error);
        throw error;
    }
};

export const editUserRole = async (userRoleData: EditUserRoleRequest): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}User/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userRoleData),
        });

        const data = await handleResponse<OperationResultResponse<boolean>>(response);
        return data.result; // Returns boolean indicating success
    } catch (error) {
        console.error('Error editing user role:', error);
        throw error;
    }
};