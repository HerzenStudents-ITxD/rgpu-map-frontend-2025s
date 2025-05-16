/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ## MODIFIED: To align with feedbackService and add getAccessToken ##
 * ---------------------------------------------------------------
 */

import { getAccessToken } from '../../utils/tokenService';

export enum OperationType {
  Add = "Add",
  Remove = "Remove",
  Replace = "Replace",
  Move = "Move",
  Copy = "Copy",
  Test = "Test",
  Invalid = "Invalid",
}

export interface BooleanOperationResultResponse {
  body?: boolean;
  errors: string[];
}

export interface CreateRoleLocalizationRequest {
  /** @format uuid */
  roleId?: string | null;
  /** @minLength 1 */
  locale: string;
  /** @minLength 1 */
  name: string;
  description?: string | null;
}

export interface CreateRoleRequest {
  name?: string | null;
  localizations: CreateRoleLocalizationRequest[];
  rights?: number[] | null;
  isActive?: boolean;
}

export interface EditUserRoleRequest {
  /** @format uuid */
  userId?: string;
  /** @format uuid */
  roleId?: string | null;
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

export interface Operation {
  operationType?: OperationType;
  path?: string | null;
  op?: string | null;
  from?: string | null;
  value?: any;
}

export interface RightInfo {
  /** @format int32 */
  rightId?: number;
  locale?: string | null;
  name?: string | null;
  description?: string | null;
}

export interface RightInfoListOperationResultResponse {
  body?: RightInfo[] | null;
  errors: string[];
}

export interface RoleInfo {
  /** @format uuid */
  id?: string;
  isActive?: boolean;
  createdBy?: UserInfo;
  rights?: RightInfo[] | null;
  localizations?: RoleLocalizationInfo[] | null;
}

export interface RoleInfoFindResultResponse {
  body?: RoleInfo[] | null;
  /** @format int32 */
  totalCount: number;
  errors: string[];
}

export interface RoleLocalizationInfo {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  roleId?: string;
  locale?: string | null;
  name?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface RoleResponse {
  role?: RoleInfo;
  users?: UserInfo[] | null;
}

export interface RoleResponseOperationResultResponse {
  body?: RoleResponse;
  errors: string[];
}

export interface UpdateRoleRightsRequest {
  /** @format uuid */
  roleId?: string;
  rights?: number[] | null;
}

export interface UserInfo {
  /** @format uuid */
  id?: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

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

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
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

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = window.location.hostname === 'localhost'
    ? "http://localhost:81"
    : 'https://itvd.online/herzen-map/api/rights/';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

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
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
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

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
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

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
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
 * @title RightsService
 * @version 2.0.2.0
 *
 * RightsService is an API intended to work with the user rights.
 */
export class RightsServiceApi<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  rights = {
    /**
     * Retrieves all rights
     *
     * @tags Rights
     * @name GetRights
     * @request GET:/Rights/get
     * @secure
     */
    getRights: (
      query?: {
        locale?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<RightInfoListOperationResultResponse, ProblemDetails>({
        path: `/Rights/get`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  roleLocalization = {
    /**
     * Creates a new role localization
     *
     * @tags RoleLocalization
     * @name CreateRoleLocalization
     * @request POST:/RoleLocalization/create
     * @secure
     */
    createRoleLocalization: (
      data: CreateRoleLocalizationRequest,
      params: RequestParams = {}
    ) =>
      this.request<GuidNullableOperationResultResponse, ProblemDetails>({
        path: `/RoleLocalization/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Partially edits a role localization
     *
     * @tags RoleLocalization
     * @name EditRoleLocalization
     * @request PATCH:/RoleLocalization/edit
     * @secure
     */
    editRoleLocalization: (
      data: Operation[],
      query?: {
        /** @format uuid */
        roleLocalizationId?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/RoleLocalization/edit`,
        method: "PATCH",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  roles = {
    /**
     * Finds roles
     *
     * @tags Roles
     * @name FindRoles
     * @request GET:/Roles/find
     * @secure
     */
    findRoles: (
      query: {
        includedeactivated?: boolean;
        locale?: string;
        /** @format int32 */
        skipcount: number;
        /** @format int32 */
        takecount: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<RoleInfoFindResultResponse, ProblemDetails>({
        path: `/Roles/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Creates a new role
     *
     * @tags Roles
     * @name CreateRole
     * @request POST:/Roles/create
     * @secure
     */
    createRole: (
      data: CreateRoleRequest,
      params: RequestParams = {}
    ) =>
      this.request<GuidOperationResultResponse, ProblemDetails>({
        path: `/Roles/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Retrieves a role
     *
     * @tags Roles
     * @name GetRoles
     * @request GET:/Roles/get
     * @secure
     */
    getRoles: (
      query?: {
        /** @format uuid */
        roleid?: string;
        locale?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<RoleResponseOperationResultResponse, ProblemDetails>({
        path: `/Roles/get`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Edits role status
     *
     * @tags Roles
     * @name EditRoleStatus
     * @request PUT:/Roles/editstatus
     * @secure
     */
    editRoleStatus: (
      query?: {
        /** @format uuid */
        roleId?: string;
        isActive?: boolean;
      },
      params: RequestParams = {}
    ) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/Roles/editstatus`,
        method: "PUT",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Updates role rights
     *
     * @tags Roles
     * @name UpdateRoleRights
     * @request POST:/Roles/updaterightsset
     * @secure
     */
    updateRoleRights: (
      data: UpdateRoleRightsRequest,
      params: RequestParams = {}
    ) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/Roles/updaterightsset`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * Edits user role
     *
     * @tags User
     * @name EditUserRole
     * @request PUT:/User/edit
     * @secure
     */
    editUserRole: (
      data: EditUserRoleRequest,
      params: RequestParams = {}
    ) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/User/edit`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}