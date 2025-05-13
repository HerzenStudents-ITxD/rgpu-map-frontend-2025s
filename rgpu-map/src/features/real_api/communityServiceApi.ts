/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ## MODIFIED: Merged and updated API definitions             ##
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

export interface AddAgentRequest {
  /** @format uuid */
  communityId: string;
  /** @format uuid */
  userId: string;
  isModerator?: boolean;
}

export interface BooleanOperationResultResponse {
  body?: boolean;
  errors: string[];
}

export interface CommunityAgentInfo {
  /** @format uuid */
  userId?: string;
  userName?: string;
  /** @format uuid */
  communityId?: string;
  isModerator?: boolean;
}

export interface CommunityInfo {
  /** @format uuid */
  id?: string;
  name?: string | null;
  isHidden?: boolean;
  avatar?: string | null;
  text?: string | null;
  /** @format date-time */
  createdAt?: string;
}

export interface CommunityResponse {
  community?: CommunityInfo;
  agents?: CommunityAgentInfo[] | null;
}

export interface CommunityResponseFindResultResponse {
  body?: CommunityResponse[] | null;
  /** @format int32 */
  totalCount: number;
  errors: string[];
}

export interface CreateCommunityRequest {
  /** @minLength 1 */
  name: string;
  avatarImage?: string | null;
  text?: string | null;
}

export interface CreateNewsRequest {
  /** @format uuid */
  communityId: string;
  /** @minLength 1 */
  title: string;
  /** @minLength 1 */
  content: string;
  images?: string[] | null;
  image?: string | null;
  /** @format uuid */
  pointId?: string | null;
  isFeatured?: boolean;
}

export interface GuidOperationResultResponse {
  /** @format uuid */
  body?: string;
  errors: string[];
}

export interface NewsResponse {
  text: string;
  id: string;
  /** @format uuid */
  newsId?: string;
  /** @format uuid */
  communityId?: string;
  title?: string | null;
  content?: string | null;
  photos?: string[] | null;
  participants?: string[] | null;
  location?: string | null;
  isFeatured?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format uuid */
  pointId?: string | null;
}

export interface NewsResponseFindResultResponse {
  body?: NewsResponse[] | null;
  /** @format int32 */
  totalCount: number;
  errors: string[];
}

export interface Operation {
  operationType?: OperationType;
  path?: string | null;
  op?: string | null;
  from?: string | null;
  value?: any;
}

export interface ParticipateRequest {
  /** @format uuid */
  newsId: string;
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

export type IntPtr = object;
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
  public baseUrl: string = "http://localhost:83";
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
        const errorData = await response.json();
        const errorMessage = errorData?.detail || 
          (data.error ? Object.entries(data.error.errors || {})
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('; ') : 'Unknown error');
        throw new Error(errorMessage);
      }
      return data;
    });
  };
}

/**
 * @title CommunityService
 * @version 2.0.2.0
 * 
 * CommunityService is an API intended to work with communities.
 */
export class CommunityServiceApi<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  community = {
    /**
     * Retrieves all communities
     * @tags Community
     * @name GetCommunity
     * @request GET:/Community/all
     * @secure
     */
    getCommunity: (
      query?: {
        IsCancellationRequested?: boolean;
        CanBeCanceled?: boolean;
        "WaitHandle.Handle"?: IntPtr;
        "WaitHandle.SafeWaitHandle.IsInvalid"?: boolean;
        "WaitHandle.SafeWaitHandle.IsClosed"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommunityResponseFindResultResponse, ProblemDetails>({
        path: `/Community/all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Retrieves communities for the current user
     * @tags Community
     * @name UserList
     * @request GET:/Community/user
     * @secure
     */
    userList: (
      query?: {
        IsCancellationRequested?: boolean;
        CanBeCanceled?: boolean;
        "WaitHandle.Handle"?: IntPtr;
        "WaitHandle.SafeWaitHandle.IsInvalid"?: boolean;
        "WaitHandle.SafeWaitHandle.IsClosed"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommunityResponseFindResultResponse, ProblemDetails>({
        path: `/Community/user`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Creates a new community
     * @tags Community
     * @name CreateCommunity
     * @request POST:/Community/create
     * @secure
     */
    createCommunity: (data: CreateCommunityRequest, params: RequestParams = {}) =>
      this.request<GuidOperationResultResponse, ProblemDetails>({
        path: `/Community/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Updates a community
     * @tags Community
     * @name EditPartialUpdate
     * @request PATCH:/Community/edit
     * @secure
     */
    editPartialUpdate: (
      data: Operation[],
      query: {
        /** @format uuid */
        communityId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/Community/edit`,
        method: "PATCH",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Soft deletes a community
     * @tags Community
     * @name SoftdeleteDelete
     * @request DELETE:/Community/softdelete
     * @secure
     */
    softdeleteDelete: (
      query: {
        /** @format uuid */
        communityId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/Community/softdelete`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Adds an agent to a community
     * @tags Community
     * @name AddAgentCreate
     * @request POST:/Community/add-agent
     * @secure
     */
    addAgentCreate: (data: AddAgentRequest, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/Community/add-agent`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Removes an agent from a community
     * @tags Community
     * @name RemoveAgentDelete
     * @request DELETE:/Community/remove-agent
     * @secure
     */
    removeAgentDelete: (
      query: {
        /** @format uuid */
        communityId: string;
        /** @format uuid */
        userId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/Community/remove-agent`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Retrieves news items
     * @tags Community
     * @name NewsList
     * @request GET:/Community/news
     * @secure
     */
    newsList: (
      query?: {
        /** @format int32 */
        page?: number;
        /** @format int32 */
        pageSize?: number;
        IsCancellationRequested?: boolean;
        CanBeCanceled?: boolean;
        "WaitHandle.Handle"?: IntPtr;
        "WaitHandle.SafeWaitHandle.IsInvalid"?: boolean;
        "WaitHandle.SafeWaitHandle.IsClosed"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<NewsResponseFindResultResponse, ProblemDetails>({
        path: `/Community/news`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Retrieves news items for a specific community
     * @tags Community
     * @name CommunityNewsList
     * @request GET:/Community/community-news
     * @secure
     */
    communityNewsList: (
      query: {
        /** @format uuid */
        communityId: string;
        /** @format int32 */
        page?: number;
        /** @format int32 */
        pageSize?: number;
        IsCancellationRequested?: boolean;
        CanBeCanceled?: boolean;
        "WaitHandle.Handle"?: IntPtr;
        "WaitHandle.SafeWaitHandle.IsInvalid"?: boolean;
        "WaitHandle.SafeWaitHandle.IsClosed"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<NewsResponseFindResultResponse, ProblemDetails>({
        path: `/Community/community-news`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Creates a new news item
     * @tags Community
     * @name CreateNewsCreate
     * @request POST:/Community/create-news
     * @secure
     */
    createNewsCreate: (data: CreateNewsRequest, params: RequestParams = {}) =>
      this.request<GuidOperationResultResponse, ProblemDetails>({
        path: `/Community/create-news`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}