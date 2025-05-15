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

export enum FeedbackStatusType {
  New = "New",
  Archived = "Archived",
}

export interface BooleanOperationResultResponse {
  body?: boolean;
  errors: string[];
}

export interface CreateFeedbackRequest {
  typeIds: string[] | null;
  content: string | null;
  /** @format int32 */
  status: number;
  email: string | null;
  feedbackImages?: ImageContent[] | null;
  user?: UserInfo;
}

export interface CreateTypeRequest {
  /** @format int32 */
  type?: number;
  name: string | null; // JSON string like {"ru": "Пожелания", "en": "Wishes", "zh": "愿望"}
}

export interface EditFeedbackStatusesRequest {
  feedbackIds: string[] | null;
  status?: FeedbackStatusType;
}

export interface FeedbackInfo {
  /** @format uuid */
  id?: string;
  content: string | null;
  senderEmail: string | null;
  typeIds: string[] | null;
  status?: FeedbackStatusType;
  /** @format date-time */
  createdAtUtc?: string;
  /** @format int32 */
  imagesCount?: number;
}

export interface FeedbackResponse {
  feedback: FeedbackInfo;
  images: ImageInfo[] | null;
}

export interface FeedbackResponseArrayOperationResultResponse {
  body?: FeedbackResponse[] | null;
  errors: string[];
}

export interface FeedbackResponseFindResultResponse {
  body?: FeedbackResponse[] | null;
  /** @format int32 */
  totalCount: number;
  errors: string[];
}

export interface FeedbackResponseOperationResultResponse {
  body?: FeedbackResponse;
  errors: string[];
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

export interface ImageContent {
  name: string | null;
  content: string | null;
  extension: string | null;
}

export interface ImageInfo {
  /** @format uuid */
  id?: string;
  name: string | null;
  content: string | null;
  extension: string | null;
  /** @format date-time */
  createdAtUtc?: string;
}

export type IntPtr = object;

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface TypeResponse {
  /** @format uuid */
  id?: string;
  /** @format int32 */
  type?: number;
  name: string | null; // JSON string like {"ru": "Пожелания", "en": "Wishes", "zh": "愿望"}
  isActive?: boolean;
}

export interface TypeResponseArrayOperationResultResponse {
  body?: TypeResponse[] | null;
  errors: string[];
}

export interface UpdateTypeRequest {
  /** @format uuid */
  id?: string;
  /** @format int32 */
  type?: number;
  name: string | null; // JSON string like {"ru": "Пожелания", "en": "Wishes", "zh": "愿望"}
}

export interface UserInfo {
  /** @format uuid */
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
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

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:51704";
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
 * @title FeedbackService
 * @version 2.0.2.0
 *
 * FeedbackService is an API intended to work with the communities.
 */
export class FeedbackServiceApi<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  feedback = {
    /**
     * Retrieves a specific feedback by ID
     *
     * @tags Feedback
     * @name GetFeedback
     * @request GET:/Feedback/get
     * @secure
     */
    getFeedback: (
      query?: {
        /** @format uuid */
        feedbackId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<FeedbackResponseOperationResultResponse, ProblemDetails>({
        path: `/Feedback/get`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Finds a list of feedbacks based on filters
     *
     * @tags Feedback
     * @name FindList
     * @request GET:/Feedback/find
     * @secure
     */
    findList: (
      query: {
        feedbackstatus?: FeedbackStatusType;
        feedbacktypeids?: string[];
        orderbydescending?: boolean;
        /** @format int32 */
        page?: number;
        /** @format int32 */
        pageSize?: number;
        /** @format int32 */
        skipcount: number;
        /** @format int32 */
        takecount: number;
        IsCancellationRequested?: boolean;
        CanBeCanceled?: boolean;
        "WaitHandle.Handle"?: IntPtr;
        "WaitHandle.SafeWaitHandle.IsInvalid"?: boolean;
        "WaitHandle.SafeWaitHandle.IsClosed"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<FeedbackResponseFindResultResponse, ProblemDetails>({
        path: `/Feedback/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Creates a new feedback
     *
     * @tags Feedback
     * @name CreateFeedback
     * @request POST:/Feedback/create
     * @secure
     */
    createFeedback: (data: CreateFeedbackRequest, params: RequestParams = {}) =>
      this.request<GuidNullableOperationResultResponse, ProblemDetails>({
        path: `/Feedback/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Updates the status of multiple feedbacks
     *
     * @tags Feedback
     * @name EditFeedbackStatuses
     * @request PUT:/Feedback/editstatus
     * @secure
     */
    editFeedbackStatuses: (
      data: EditFeedbackStatusesRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/Feedback/editstatus`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Retrieves all feedbacks
     *
     * @tags Feedback
     * @name GetAllFeedbacks
     * @request GET:/Feedback/getall
     * @secure
     */
    getAllFeedbacks: (params: RequestParams = {}) =>
      this.request<
        FeedbackResponseArrayOperationResultResponse,
        ProblemDetails
      >({
        path: `/Feedback/getall`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };

  type = {
    /**
     * Retrieves all feedback types
     *
     * @tags Type
     * @name GetType
     * @request GET:/type/all
     * @secure
     */
    getType: (params: RequestParams = {}) =>
      this.request<TypeResponseArrayOperationResultResponse, any>({
        path: `/type/all`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Updates an existing feedback type
     *
     * @tags Type
     * @name UpdateType
     * @request PUT:/type/update
     * @secure
     */
    updateType: (data: UpdateTypeRequest, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/type/update`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * Hides a feedback type
     *
     * @tags Type
     * @name HideType
     * @request PUT:/type/hide/{typeId}
     * @secure
     */
    hideType: (typeId: string, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/type/hide/${typeId}`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Shows a hidden feedback type
     *
     * @tags Type
     * @name ShowType
     * @request PUT:/type/show/{typeId}
     * @secure
     */
    showType: (typeId: string, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, ProblemDetails>({
        path: `/type/show/${typeId}`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * Creates a new feedback type
     *
     * @tags Type
     * @name CreateType
     * @request POST:/type/create
     * @secure
     */
    createType: (data: CreateTypeRequest, params: RequestParams = {}) =>
      this.request<GuidOperationResultResponse, ProblemDetails>({
        path: `/type/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}