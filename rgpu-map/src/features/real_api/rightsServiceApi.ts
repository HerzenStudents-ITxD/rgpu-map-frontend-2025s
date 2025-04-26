import { getAccessToken } from '../../utils/tokenService';

const BASE_URL = 'http://localhost:81/';

// Common response types
interface OperationResultResponse<T> {
  body: T;
  errors: string[];
}

interface FindResultResponse<T> {
  body: T[] | null;
  totalCount: number;
  errors: string[];
}

// Data models
interface RightInfo {
  rightId: number; // int, согласно Swagger
  locale?: string | null;
  name?: string | null;
  description?: string | null;
}

interface RoleInfo {
  id: string; // System.Guid
  isActive: boolean;
  createdBy: UserInfo;
  rights: RightInfo[] | null;
  localizations: RoleLocalizationInfo[] | null;
}

interface RoleResponse {
  role: RoleInfo;
  users: UserInfo[] | null;
}

interface UserInfo {
  id: string; // System.Guid
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
}

interface RoleLocalizationInfo {
  id: string; // System.Guid
  roleId: string; // System.Guid
  locale?: string | null;
  name?: string | null;
  description?: string | null;
  isActive: boolean;
}

// Request DTOs
interface CreateRoleRequest {
  localizations: CreateRoleLocalizationRequest[];
  rights?: number[] | null; // int[], согласно Swagger
}

interface EditUserRoleRequest {
  userId: string; // System.Guid
  roleId?: string | null; // System.Guid
}

interface CreateRoleLocalizationRequest {
  roleId?: string | null; // System.Guid
  locale: string;
  name: string;
  description?: string | null;
}

interface EditRoleLocalizationRequest {
  name?: string;
}

interface UpdateRoleRightsRequest {
  roleId: string; // System.Guid
  rights?: number[] | null; // int[], согласно Swagger
}

// Utility function to handle responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = `HTTP error! status: ${response.status}`;

    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      errorMessage = error.errors?.join('; ') || errorMessage;
    } else {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  if (data.errors?.length > 0) {
    throw new Error(data.errors.join('; '));
  }

  return data;
};

// API Handlers
export const get = async (locale?: string): Promise<RightInfo[]> => {
  try {
    const url = new URL(`${BASE_URL}Rights/get`);
    if (locale) {
      url.searchParams.append('locale', locale);
    }

    const token = getAccessToken();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': token || '', // Используем 'Token' как в LoginPage.tsx
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse<OperationResultResponse<RightInfo[] | null>>(response);
    return data.body || [];
  } catch (error) {
    console.error('Error fetching rights:', error);
    throw error;
  }
};

export const createRole = async (roleData: CreateRoleRequest): Promise<string> => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}Roles/create`, {
      method: 'POST',
      headers: {
        'Token': token || '', // Используем 'Token'
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    const data = await handleResponse<OperationResultResponse<string>>(response);
    return data.body;
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
    if (locale) {
      url.searchParams.append('locale', locale);
    }
    url.searchParams.append('skipcount', skipCount.toString());
    url.searchParams.append('takecount', takeCount.toString());

    const token = getAccessToken();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': token || '', // Используем 'Token'
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse<FindResultResponse<RoleInfo>>(response);
    return {
      roles: data.body || [],
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
    if (roleId) {
      url.searchParams.append('roleid', roleId);
    }
    if (locale) {
      url.searchParams.append('locale', locale);
    }

    const token = getAccessToken();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': token || '', // Используем 'Token'
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse<OperationResultResponse<RoleResponse>>(response);
    return data.body;
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
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Token': token || '', // Используем 'Token'
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse<OperationResultResponse<boolean>>(response);
    return data.body;
  } catch (error) {
    console.error('Error changing role status:', error);
    throw error;
  }
};

export const updateRoleRights = async (request: UpdateRoleRightsRequest): Promise<boolean> => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}Roles/updaterightsset`, {
      method: 'POST',
      headers: {
        'Token': token || '', // Используем 'Token'
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await handleResponse<OperationResultResponse<boolean>>(response);
    return data.body;
  } catch (error) {
    console.error('Error updating role rights:', error);
    throw error;
  }
};

export const createRoleLocalization = async (request: CreateRoleLocalizationRequest): Promise<string> => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}RoleLocalization/create`, {
      method: 'POST',
      headers: {
        'Token': token || '', // Используем 'Token'
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await handleResponse<OperationResultResponse<string>>(response);
    return data.body;
  } catch (error) {
    console.error('Error creating role localization:', error);
    throw error;
  }
};

export const editRoleLocalization = async (
  roleLocalizationId: string,
  request: EditRoleLocalizationRequest
): Promise<boolean> => {
  try {
    const url = new URL(`${BASE_URL}RoleLocalization/edit`);
    url.searchParams.append('roleLocalizationId', roleLocalizationId);

    const token = getAccessToken();
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Token': token || '', // Используем 'Token'
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await handleResponse<OperationResultResponse<boolean>>(response);
    return data.body;
  } catch (error) {
    console.error('Error editing role localization:', error);
    throw error;
  }
};

export const edit = async (request: EditUserRoleRequest): Promise<boolean> => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}User/edit`, {
      method: 'PUT',
      headers: {
        'Token': token || '', // Используем 'Token'
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await handleResponse<OperationResultResponse<boolean>>(response);
    return data.body;
  } catch (error) {
    console.error('Error editing user role:', error);
    throw error;
  }
};