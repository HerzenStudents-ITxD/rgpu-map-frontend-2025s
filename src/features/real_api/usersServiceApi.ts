/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ## MODIFIED: To align with updated backend API specification ##
 * ---------------------------------------------------------------
 */

import { getAccessToken } from '../../utils/tokenService';
import {
  BooleanOperationResultResponse,
  ChangePasswordRequest,
  CreateAvatarRequest,
  CreateCommunicationRequest,
  CreateCredentialsRequest,
  CreateUserRequest,
  CredentialsResponseOperationResultResponse,
  EditCommunicationRequest,
  EditUserActiveRequest,
  GuidNullableOperationResultResponse,
  GuidOperationResultResponse,
  ReactivateCredentialsRequest,
  ReconstructPasswordRequest,
  RemoveAvatarsRequest,
  StringOperationResultResponse,
  UserDataOperationResultResponse,
  UserImagesResponseOperationResultResponse,
  UserInfoFindResultResponse,
  UserResponseOperationResultResponse,
  Operation,
} from './usersApi';

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  secure?: boolean;
  path: string;
  type?: ContentType;
  query?: QueryParamsType;
  format?: ResponseFormat;
  body?: unknown;
  baseUrl?: string;
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export enum OperationType {
    Add = "Add",
    Remove = "Remove",
    Replace = "Replace",
    Move = "Move",
    Copy = "Copy",
    Test = "Test",
    Invalid = "Invalid",
  }
  
  export enum CommunicationType {
    Email = "Email",
    Telegram = "Telegram",
    Phone = "Phone",
    VK = "VK",
    BaseEmail = "BaseEmail",
  }
  
  export interface BooleanOperationResultResponse {
    body?: boolean;
    errors: string[];
  }
  
  export interface ChangePasswordRequest {
    /** @minLength 1 */
    password: string;
    /** @minLength 1 */
    newPassword: string;
  }
  
  export interface CommunicationInfo {
    /** @format uuid */
    id?: string;
    type?: CommunicationType;
    value?: string | null;
    isConfirmed?: boolean;
  }
  
  export interface CreateAvatarRequest {
    /** @format uuid */
    userId?: string | null;
    name?: string | null;
    /** @minLength 1 */
    content: string;
    /** @minLength 1 */
    extension: string;
    isCurrentAvatar?: boolean;
  }
  
  export interface CreateCommunicationRequest {
    /** @format uuid */
    userId?: string | null;
    type?: CommunicationType;
    /** @minLength 1 */
    value: string;
  }
  
  export interface CreateCredentialsRequest {
    /** @format uuid */
    userId?: string;
    /** @minLength 1 */
    login: string;
    /** @minLength 1 */
    password: string;
  }
  
  export interface CreateUserRequest {
    /** @minLength 1 */
    login: string;
    /** @minLength 1 */
    email: string;
    /** @minLength 1 */
    firstName: string;
    /** @minLength 1 */
    lastName: string;
    middleName?: string | null;
    isAdmin?: boolean;
    about?: string | null;
    /** @format date-time */
    dateOfBirth?: string | null;
    /** @format uuid */
    departmentId?: string | null;
    /** @format uuid */
    officeId?: string | null;
    /** @format uuid */
    positionId?: string | null;
    roleIds?: string[] | null; // Updated to support multiple roles
    password?: string | null;
    userUniversity?: CreateUserUniversityRequest;
    avatarImage?: CreateAvatarRequest;
    communication: CreateCommunicationRequest;
  }
  
  export interface CreateUserUniversityRequest {
    /** @format uuid */
    universityId?: string;
    /** @format uuid */
    contractSubjectId?: string | null;
    /** @format double */
    rate?: number | null;
    /** @format date-time */
    startWorkingAt?: string;
    /** @format date-time */
    endWorkingAt?: string | null;
    /** @format date-time */
    probation?: string | null;
  }
  
  export interface CredentialsResponse {
    /** @format uuid */
    userId?: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    /** @format double */
    accessTokenExpiresIn?: number;
    /** @format double */
    refreshTokenExpiresIn?: number;
  }
  
  export interface CredentialsResponseOperationResultResponse {
    body?: CredentialsResponse;
    errors: string[];
  }
  
  export interface DepartmentInfo {
    /** @format uuid */
    id?: string;
    name?: string | null;
    shortName?: string | null;
    childDepartmentsIds?: string[] | null;
  }
  
  export interface DepartmentUserInfo {
    department?: DepartmentInfo;
  }
  
  export interface EditCommunicationRequest {
    type?: CommunicationType;
    value?: string | null;
  }
  
  export interface EditUserActiveRequest {
    /** @format uuid */
    userId?: string;
    isActive?: boolean;
    /** @format uuid */
    communicationId?: string | null;
  }
  
  export interface GuidNullableOperationResultResponse {
    /** @format uuid */
    body?: string | null;
    errors: string[];
  }
  
  export interface GuidOperationResultResponse {
    /** @format uuid */
    body?: string;
    errors: string[];
  }
  
  export interface ImageInfo {
    /** @format uuid */
    id?: string | null;
    /** @format uuid */
    parentId?: string | null;
    content?: string | null;
    extension?: string | null;
    name?: string | null;
  }
  
  export interface OfficeInfo {
    /** @format uuid */
    id?: string;
    name?: string | null;
    city?: string | null;
    address?: string | null;
  }
  
  export interface Operation {
    operationType?: OperationType;
    path?: string | null;
    op?: string | null;
    from?: string | null;
    value?: any;
  }
  
  export interface PendingUserInfo {
    /** @format uuid */
    invitationCommunicationId?: string;
  }
  
  export interface PositionInfo {
    /** @format uuid */
    id?: string;
    name?: string | null;
  }
  
  export interface ReactivateCredentialsRequest {
    /** @format uuid */
    userId?: string;
    /** @minLength 1 */
    password: string;
  }
  
  export interface ReconstructPasswordRequest {
    /** @format uuid */
    userId?: string;
    /** @minLength 1 */
    secret: string;
    /** @minLength 1 */
    newPassword: string;
  }
  
  export interface RemoveAvatarsRequest {
    /** @format uuid */
    userId?: string;
    avatarsIds?: string[] | null;
  }
  
  export interface RoleInfo {
    /** @format uuid */
    id?: string;
    name?: string | null;
    rightsIds?: number[] | null;
  }
  
  export interface StringOperationResultResponse {
    body?: string | null;
    errors: string[];
  }
  
  export interface UniversityInfo {
    /** @format uuid */
    id?: string;
    name?: string | null;
  }
  
  export interface UniversityUserInfo {
    university?: UniversityInfo;
    /** @format double */
    rate?: number | null;
    /** @format date-time */
    startWorkingAt?: string;
    /** @format date-time */
    endWorkingAt?: string | null;
    /** @format date-time */
    probation?: string | null;
  }
  
  export interface UserAdditionInfo {
    about?: string | null;
    /** @format date-time */
    dateOfBirth?: string | null;
  }
  
  export interface UserData {
    /** @format uuid */
    id?: string;
    /** @format uuid */
    imageId?: string | null;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    isActive?: boolean;
    email?: string | null;
  }
  
  export interface UserDataOperationResultResponse {
    body?: UserData;
    errors: string[];
  }
  
  export interface UserImagesResponse {
    /** @format uuid */
    userId?: string;
    images?: ImageInfo[] | null;
  }
  
  export interface UserImagesResponseOperationResultResponse {
    body?: UserImagesResponse;
    errors: string[];
  }
  
  export interface UserInfo {
    /** @format uuid */
    userId: string; // Renamed id to userId for consistency
    firstName?: string | null;
    lastName?: string | null;
    middleName?: string | null;
    fullName?: string | null; // Added for UsersPage.tsx search
    email?: string | null; // Added for UsersPage.tsx
    isAdmin?: boolean;
    isActive?: boolean;
    roleIds?: string[] | null; // Added to support multiple roles
    pendingInfo?: PendingUserInfo;
    avatar?: ImageInfo;
    communications?: CommunicationInfo[] | null;
  }
  
  export interface UserInfoFindResultResponse {
    body?: UserInfo[] | null;
    /** @format int32 */
    totalCount: number;
    errors: string[];
  }
  
  export interface UserResponse {
    user?: UserInfo;
    userAddition?: UserAdditionInfo;
    universityUser?: UniversityUserInfo;
    departmentUser?: DepartmentUserInfo;
    office?: OfficeInfo;
    position?: PositionInfo;
    role?: RoleInfo;
    images?: ImageInfo[] | null;
  }
  
  export interface UserResponseOperationResultResponse {
    body?: UserResponse;
    errors: string[];
  }

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:80";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
    this.securityWorker = async () => {
      const token = getAccessToken();
      return {
        headers: {
          Token: token || '',
        },
      };
    };
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) {
        const errorMessage = data.error
          ? Object.entries(data.error.errors || {})
              .map(([key, value]) => `${key}: ${value.join(', ')}`)
              .join('; ')
          : data.error?.title || 'Unknown error';
        throw new Error(errorMessage);
      }
      return data;
    });
  };
}

/**
 * @title UserService
 * @version 2.0.2.0
 *
 * UserService is an API intended to work with users.
 */
export class UsersServiceApi<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  avatar = {
    /**
     * Creates a new avatar
     *
     * @tags Avatar
     * @name CreateAvatar
     * @request POST:/Avatar/create
     * @secure
     */
    createAvatar: (data: CreateAvatarRequest, params: RequestParams = {}) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/Avatar/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Retrieves avatars for a user
     *
     * @tags Avatar
     * @name GetAvatar
     * @request GET:/Avatar/get
     * @secure
     */
    getAvatar: (
      query?: {
        /** @format uuid */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserImagesResponseOperationResultResponse, any>({
        path: `/Avatar/get`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Removes avatars
     *
     * @tags Avatar
     * @name RemoveAvatar
     * @request DELETE:/Avatar/remove
     * @secure
     */
    removeAvatar: (data: RemoveAvatarsRequest, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Avatar/remove`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Sets the current avatar
     *
     * @tags Avatar
     * @name EditCurrentAvatar
     * @request GET:/Avatar/editcurrent
     * @secure
     */
    editCurrentAvatar: (
      query?: {
        /** @format uuid */
        userId?: string;
        /** @format uuid */
        avatarId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Avatar/editcurrent`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };

  communication = {
    /**
     * Creates a new communication
     *
     * @tags Communication
     * @name CreateCommunication
     * @request POST:/Communication/create
     * @secure
     */
    createCommunication: (
      data: CreateCommunicationRequest,
      params: RequestParams = {},
    ) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/Communication/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Edits a communication
     *
     * @tags Communication
     * @name EditCommunication
     * @request PUT:/Communication/edit
     * @secure
     */
    editCommunication: (
      data: EditCommunicationRequest,
      query?: {
        /** @format uuid */
        communicationId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Communication/edit`,
        method: "PUT",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Removes a communication
     *
     * @tags Communication
     * @name RemoveCommunication
     * @request DELETE:/Communication/remove
     * @secure
     */
    removeCommunication: (
      query?: {
        /** @format uuid */
        communicationId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Communication/remove`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Confirms a communication
     *
     * @tags Communication
     * @name ConfirmCommunication
     * @request PUT:/Communication/confirm
     * @secure
     */
    confirmCommunication: (
      query?: {
        /** @format uuid */
        communicationId?: string;
        secret?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Communication/confirm`,
        method: "PUT",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Resends confirmation for a communication
     *
     * @tags Communication
     * @name ResendConfirmation
     * @request GET:/Communication/resendconfirmation
     * @secure
     */
    resendConfirmation: (
      query?: {
        /** @format uuid */
        communicationId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Communication/resendconfirmation`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };

  credentials = {
    /**
     * Creates new credentials
     *
     * @tags Credentials
     * @name CreateCredentials
     * @request POST:/Credentials/create
     * @secure
     */
    createCredentials: (
      data: CreateCredentialsRequest,
      params: RequestParams = {},
    ) =>
      this.request<CredentialsResponseOperationResultResponse, any>({
        path: `/Credentials/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Reactivates credentials
     *
     * @tags Credentials
     * @name ReactivateCredentials
     * @request PUT:/Credentials/reactivate
     * @secure
     */
    reactivateCredentials: (
      data: ReactivateCredentialsRequest,
      params: RequestParams = {},
    ) =>
      this.request<CredentialsResponseOperationResultResponse, any>({
        path: `/Credentials/reactivate`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };

  password = {
    /**
     * Initiates password recovery
     *
     * @tags Password
     * @name ForgotPassword
     * @request GET:/Password/forgot
     * @secure
     */
    forgotPassword: (
      query?: {
        userEmail?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StringOperationResultResponse, any>({
        path: `/Password/forgot`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Reconstructs a password
     *
     * @tags Password
     * @name ReconstructPassword
     * @request POST:/Password/reconstruct
     * @secure
     */
    reconstructPassword: (
      data: ReconstructPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Password/reconstruct`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Changes a password
     *
     * @tags Password
     * @name ChangePassword
     * @request POST:/Password/change
     * @secure
     */
    changePassword: (data: ChangePasswordRequest, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Password/change`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Generates a new password
     *
     * @tags Password
     * @name GeneratePassword
     * @request GET:/Password/generate
     * @secure
     */
    generatePassword: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/Password/generate`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };

  pending = {
    /**
     * Checks pending user status
     *
     * @tags Pending
     * @name CheckPending
     * @request GET:/Pending/check
     * @secure
     */
    checkPending: (
      query?: {
        /** @format uuid */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Pending/check`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Resends an invitation
     *
     * @tags Pending
     * @name ResendInvitation
     * @request GET:/Pending/resendinvitation
     * @secure
     */
    resendInvitation: (
      query?: {
        /** @format uuid */
        userId?: string;
        /** @format uuid */
        communicationId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Pending/resendinvitation`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Removes a pending user
     *
     * @tags Pending
     * @name RemovePending
     * @request DELETE:/Pending/remove
     * @secure
     */
    removePending: (
      query?: {
        /** @format uuid */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Pending/remove`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };

  user = {
    /**
     * Creates a new user
     *
     * @tags User
     * @name CreateUser
     * @request POST:/User/create
     * @secure
     */
    createUser: (data: CreateUserRequest, params: RequestParams = {}) =>
      this.request<GuidOperationResultResponse, any>({
        path: `/User/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Partially edits a user
     *
     * @tags User
     * @name EditPartialUser
     * @request PATCH:/User/edit
     * @secure
     */
    editPartialUser: (
      data: Operation[],
      query?: {
        /** @format uuid */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/User/edit`,
        method: "PATCH",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Retrieves a user
     *
     * @tags User
     * @name GetUser
     * @request GET:/User/get
     * @secure
     */
    getUser: (
      query?: {
        /** @format uuid */
        userid?: string;
        email?: string;
        login?: string;
        includecurrentavatar?: boolean;
        includeavatars?: boolean;
        includecommunications?: boolean;
        includeuniversity?: boolean;
        includedepartment?: boolean;
        includeoffice?: boolean;
        includeposition?: boolean;
        includerole?: boolean;
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserResponseOperationResultResponse, any>({
        path: `/User/get`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Retrieves user info
     *
     * @tags User
     * @name GetUserInfo
     * @request GET:/User/getinfo
     * @secure
     */
    getUserInfo: (params: RequestParams = {}) =>
      this.request<UserDataOperationResultResponse, any>({
        path: `/User/getinfo`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Finds users
     *
     * @tags User
     * @name FindUsers
     * @request GET:/User/find
     * @secure
     */
    findUsers: (
      query: {
        isascendingsort?: boolean;
        fullnameincludesubstring?: string;
        isactive?: boolean;
        ispending?: boolean;
        includecurrentavatar?: boolean;
        includecommunications?: boolean;
        /** @format int32 */
        skipcount: number;
        /** @format int32 */
        takecount: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserInfoFindResultResponse, any>({
        path: `/User/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Edits user active status
     *
     * @tags User
     * @name EditUserActive
     * @request PUT:/User/editactive
     * @secure
     */
    editUserActive: (
      data: EditUserActiveRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/User/editactive`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}