/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
import { getAccessToken } from '../../utils/tokenService';

export interface BooleanOperationResultResponse {
  body?: boolean;
  errors: string[];
}

export interface CreatePointAssociationRequest {
  /** @minLength 1 */
  association: string;
}

export interface CreatePointLabelRequest {
  name: Record<string, string>;
}

export interface CreatePointPhotoRequest {
  /** @format uuid */
  pointId: string;
  /** @minLength 1 */
  content: string;
  /** @format int32 */
  ordinalNumber?: number;
}

export interface CreatePointRequest {
  name: Record<string, string>;
  description?: Record<string, string>;
  fact?: Record<string, string>;
  /** @format float */
  x: number;
  /** @format float */
  y: number;
  /** @format float */
  z: number;
  /** @minLength 1 */
  icon: string;
  labelIds?: string[] | null;
  photos?: CreatePointPhotoRequest[] | null;
  typeIds?: string[] | null;
  associations?: string[] | null;
}

export interface CreatePointTypeAssociationRequest {
  /** @format uuid */
  pointTypeId: string;
  /** @minLength 1 */
  association: string;
}

export interface CreatePointTypeRectangularParallepipedRequest {
  /** @format uuid */
  pointTypeId: string;
  /** @format double */
  xMin: number;
  /** @format double */
  xMax: number;
  /** @format double */
  yMin: number;
  /** @format double */
  yMax: number;
  /** @format double */
  zMin: number;
  /** @format double */
  zMax: number;
}

export interface CreatePointTypeRequest {
  name: Record<string, string>;
  /** @minLength 1 */
  icon: string;
  associations?: string[] | null;
}

export interface CreateRelationRequest {
  /** @format uuid */
  firstPointId: string;
  /** @format uuid */
  secondPointId: string;
}

export interface EditPointAssociationRequest {
  association?: string | null;
  isActive?: boolean | null;
}

export interface EditPointLabelRequest {
  name?: Record<string, string>;
  isActive?: boolean | null;
}

export interface EditPointPhotoRequest {
  content?: string | null;
  /** @format int32 */
  ordinalNumber?: number | null;
  isActive?: boolean | null;
}

export interface EditPointRequest {
  name?: Record<string, string>;
  description?: Record<string, string>;
  fact?: Record<string, string>;
  /** @format float */
  x?: number | null;
  /** @format float */
  y?: number | null;
  /** @format float */
  z?: number | null;
  icon?: string | null;
  labelIds?: string[] | null;
  photos?: CreatePointPhotoRequest[] | null;
  typeIds?: string[] | null;
  associations?: string[] | null;
  isActive?: boolean | null;
}

export interface EditPointTypeAssociationRequest {
  association?: string | null;
  isActive?: boolean | null;
}

export interface EditPointTypeRectangularParallepipedRequest {
  /** @format double */
  xMin?: number | null;
  /** @format double */
  xMax?: number | null;
  /** @format double */
  yMin?: number | null;
  /** @format double */
  yMax?: number | null;
  /** @format double */
  zMin?: number | null;
  /** @format double */
  zMax?: number | null;
  isActive?: boolean | null;
}

export interface EditPointTypeRequest {
  name?: Record<string, string>;
  icon?: string | null;
  associations?: string[] | null;
  isActive?: boolean | null;
}

export interface EditRelationRequest {
  /** @format uuid */
  firstPointId?: string | null;
  /** @format uuid */
  secondPointId?: string | null;
}

export interface GuidNullableOperationResultResponse {
  /** @format uuid */
  body?: string | null;
  errors: string[];
}

export interface PointAssociationInfo {
  /** @format uuid */
  id?: string;
  association?: string | null;
  /** @format uuid */
  createdBy?: string;
  /** @format date-time */
  createdAtUtc?: string;
  isActive?: boolean;
}

export interface PointAssociationInfoListOperationResultResponse {
  body?: PointAssociationInfo[] | null;
  errors: string[];
}

export interface PointInfo {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  createdBy?: string;
  /** @format date-time */
  createdAtUtc?: string;
  isActive?: boolean;
  name?: Record<string, string>;
  description?: Record<string, string>;
  fact?: Record<string, string>;
  /** @format float */
  x?: number;
  /** @format float */
  y?: number;
  /** @format float */
  z?: number;
  icon?: string | null;
  labels?: PointLabelInfo[] | null;
  photos?: PointPhotoInfo[] | null;
  pointTypes?: PointTypeInfo[] | null;
}

export interface PointInfoListOperationResultResponse {
  body?: PointInfo[] | null;
  errors: string[];
}

export interface PointInfoOperationResultResponse {
  body?: PointInfo;
  errors: string[];
}

export interface PointLabelInfo {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  roleId?: string;
  name?: Record<string, string>;
  locale?: string | null;
  /** @format uuid */
  createdBy?: string;
  /** @format date-time */
  createdAtUtc?: string;
  isActive?: boolean;
}

export interface PointLabelInfoListOperationResultResponse {
  body?: PointLabelInfo[] | null;
  errors: string[];
}

export interface PointPhotoInfo {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  photoId?: string;
  /** @format int32 */
  number?: number;
  isActive?: boolean;
}

export interface PointPhotoInfoListOperationResultResponse {
  body?: PointPhotoInfo[] | null;
  errors: string[];
}

export interface PointTypeAssociationInfo {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  pointTypeId?: string;
  association?: string | null;
  /** @format uuid */
  createdBy?: string;
  /** @format date-time */
  createdAtUtc?: string;
  isActive?: boolean;
}

export interface PointTypeAssociationInfoListOperationResultResponse {
  body?: PointTypeAssociationInfo[] | null;
  errors: string[];
}

export interface PointTypeInfo {
  /** @format uuid */
  id?: string;
  name?: Record<string, string>;
  icon?: string | null;
  associations?: string[] | null;
  /** @format uuid */
  createdBy?: string;
  /** @format date-time */
  createdAtUtc?: string;
  isActive?: boolean;
}

export interface PointTypeInfoListOperationResultResponse {
  body?: PointTypeInfo[] | null;
  errors: string[];
}

export interface PointTypeRectangularParallepipedInfo {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  pointTypeId?: string;
  /** @format double */
  xMin?: number;
  /** @format double */
  xMax?: number;
  /** @format double */
  yMin?: number;
  /** @format double */
  yMax?: number;
  /** @format double */
  zMin?: number;
  /** @format double */
  zMax?: number;
  /** @format uuid */
  createdBy?: string;
  /** @format date-time */
  createdAtUtc?: string;
  isActive?: boolean;
}

export interface PointTypeRectangularParallepipedInfoListOperationResultResponse {
  body?: PointTypeRectangularParallepipedInfo[] | null;
  errors: string[];
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

export type {
  PointInfo,
  CreatePointRequest,
  EditPointRequest,
  PointLabelInfo,
  PointPhotoInfo,
  PointTypeInfo,
  PointAssociationInfo
};

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
  public baseUrl: string = "http://localhost:85";
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

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title MapService
 * @version 2.0.2.0
 *
 * MapService is an API intended to work with the map.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  point = {
    /**
     * No description
     *
     * @tags Point
     * @name FindList
     * @request GET:/Point/find
     */
    findList: (
      query?: {
        IncludeDeactivated?: boolean;
        /** @format uuid */
        CreatedBy?: string;
        Locale?: string;
        TypeId?: string;
        /** @format int32 */
        Page?: number;
        /** @format int32 */
        PageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PointInfoListOperationResultResponse, any>({
        path: `/Point/find`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Point
     * @name PointDetail
     * @request GET:/Point/{pointId}
     */
    pointDetail: (
      pointId: string,
      query?: {
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PointInfoOperationResultResponse, any>({
        path: `/Point/${pointId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Point
     * @name PointDelete
     * @request DELETE:/Point/{pointId}
     */
    pointDelete: (pointId: string, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Point/${pointId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Point
     * @name CreateCreate
     * @request POST:/Point/create
     */
    createCreate: (data: CreatePointRequest, params: RequestParams = {}) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/Point/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Point
     * @name EditUpdate
     * @request PUT:/Point/edit/{pointId}
     */
    editUpdate: (
      pointId: string,
      data: EditPointRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Point/edit/${pointId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  pointAssociation = {
    /**
     * No description
     *
     * @tags PointAssociation
     * @name ListList
     * @request GET:/PointAssociation/list
     */
    listList: (params: RequestParams = {}) =>
      this.request<PointAssociationInfoListOperationResultResponse, any>({
        path: `/PointAssociation/list`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointAssociation
     * @name CreateCreate
     * @request POST:/PointAssociation/create
     */
    createCreate: (
      data: CreatePointAssociationRequest,
      params: RequestParams = {},
    ) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/PointAssociation/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointAssociation
     * @name EditUpdate
     * @request PUT:/PointAssociation/edit/{associationId}
     */
    editUpdate: (
      associationId: string,
      data: EditPointAssociationRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointAssociation/edit/${associationId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointAssociation
     * @name PointAssociationDelete
     * @request DELETE:/PointAssociation/{associationId}
     */
    pointAssociationDelete: (
      associationId: string,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointAssociation/${associationId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  pointLabel = {
    /**
     * No description
     *
     * @tags PointLabel
     * @name ListList
     * @request GET:/PointLabel/list
     */
    listList: (
      query?: {
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PointLabelInfoListOperationResultResponse, any>({
        path: `/PointLabel/list`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointLabel
     * @name CreateCreate
     * @request POST:/PointLabel/create
     */
    createCreate: (data: CreatePointLabelRequest, params: RequestParams = {}) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/PointLabel/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointLabel
     * @name EditUpdate
     * @request PUT:/PointLabel/edit/{labelId}
     */
    editUpdate: (
      labelId: string,
      data: EditPointLabelRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointLabel/edit/${labelId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointLabel
     * @name PointLabelDelete
     * @request DELETE:/PointLabel/{labelId}
     */
    pointLabelDelete: (labelId: string, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointLabel/${labelId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  pointPhoto = {
    /**
     * No description
     *
     * @tags PointPhoto
     * @name ListDetail
     * @request GET:/PointPhoto/list/{pointId}
     */
    listDetail: (pointId: string, params: RequestParams = {}) =>
      this.request<PointPhotoInfoListOperationResultResponse, any>({
        path: `/PointPhoto/list/${pointId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointPhoto
     * @name CreateCreate
     * @request POST:/PointPhoto/create
     */
    createCreate: (data: CreatePointPhotoRequest, params: RequestParams = {}) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/PointPhoto/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointPhoto
     * @name EditUpdate
     * @request PUT:/PointPhoto/edit/{photoId}
     */
    editUpdate: (
      photoId: string,
      data: EditPointPhotoRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointPhoto/edit/${photoId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointPhoto
     * @name PointPhotoDelete
     * @request DELETE:/PointPhoto/{photoId}
     */
    pointPhotoDelete: (photoId: string, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointPhoto/${photoId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  pointType = {
    /**
     * No description
     *
     * @tags PointType
     * @name ListList
     * @request GET:/PointType/list
     */
    listList: (
      query?: {
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PointTypeInfoListOperationResultResponse, any>({
        path: `/PointType/list`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointType
     * @name CreateCreate
     * @request POST:/PointType/create
     */
    createCreate: (data: CreatePointTypeRequest, params: RequestParams = {}) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/PointType/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointType
     * @name EditUpdate
     * @request PUT:/PointType/edit/{typeId}
     */
    editUpdate: (
      typeId: string,
      data: EditPointTypeRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointType/edit/${typeId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointType
     * @name PointTypeDelete
     * @request DELETE:/PointType/{typeId}
     */
    pointTypeDelete: (typeId: string, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointType/${typeId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  pointTypeAssociation = {
    /**
     * No description
     *
     * @tags PointTypeAssociation
     * @name ListDetail
     * @request GET:/PointTypeAssociation/list/{pointTypeId}
     */
    listDetail: (pointTypeId: string, params: RequestParams = {}) =>
      this.request<PointTypeAssociationInfoListOperationResultResponse, any>({
        path: `/PointTypeAssociation/list/${pointTypeId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointTypeAssociation
     * @name CreateCreate
     * @request POST:/PointTypeAssociation/create
     */
    createCreate: (
      data: CreatePointTypeAssociationRequest,
      params: RequestParams = {},
    ) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/PointTypeAssociation/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointTypeAssociation
     * @name EditUpdate
     * @request PUT:/PointTypeAssociation/edit/{associationId}
     */
    editUpdate: (
      associationId: string,
      data: EditPointTypeAssociationRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointTypeAssociation/edit/${associationId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointTypeAssociation
     * @name PointTypeAssociationDelete
     * @request DELETE:/PointTypeAssociation/{associationId}
     */
    pointTypeAssociationDelete: (
      associationId: string,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointTypeAssociation/${associationId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  pointTypeRectangularParallepipeds = {
    /**
     * No description
     *
     * @tags PointTypeRectangularParallepipeds
     * @name ListDetail
     * @request GET:/PointTypeRectangularParallepipeds/list/{pointTypeId}
     */
    listDetail: (pointTypeId: string, params: RequestParams = {}) =>
      this.request<
        PointTypeRectangularParallepipedInfoListOperationResultResponse,
        any
      >({
        path: `/PointTypeRectangularParallepipeds/list/${pointTypeId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointTypeRectangularParallepipeds
     * @name CreateCreate
     * @request POST:/PointTypeRectangularParallepipeds/create
     */
    createCreate: (
      data: CreatePointTypeRectangularParallepipedRequest,
      params: RequestParams = {},
    ) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/PointTypeRectangularParallepipeds/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointTypeRectangularParallepipeds
     * @name EditUpdate
     * @request PUT:/PointTypeRectangularParallepipeds/edit/{parallelepipedId}
     */
    editUpdate: (
      parallelepipedId: string,
      data: EditPointTypeRectangularParallepipedRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointTypeRectangularParallepipeds/edit/${parallelepipedId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PointTypeRectangularParallepipeds
     * @name PointTypeRectangularParallepipedsDelete
     * @request DELETE:/PointTypeRectangularParallepipeds/{parallelepipedId}
     */
    pointTypeRectangularParallepipedsDelete: (
      parallelepipedId: string,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/PointTypeRectangularParallepipeds/${parallelepipedId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  route = {
    /**
     * No description
     *
     * @tags Route
     * @name BuildList
     * @request GET:/Route/build
     */
    buildList: (
      query?: {
        /** @format uuid */
        startPointId?: string;
        /** @format uuid */
        endPointId?: string;
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PointInfoListOperationResultResponse, any>({
        path: `/Route/build`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Route
     * @name AvailableList
     * @request GET:/Route/available
     */
    availableList: (
      query?: {
        /** @format uuid */
        pointId?: string;
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PointInfoListOperationResultResponse, any>({
        path: `/Route/available`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Route
     * @name CreateCreate
     * @request POST:/Route/create
     */
    createCreate: (data: CreateRelationRequest, params: RequestParams = {}) =>
      this.request<GuidNullableOperationResultResponse, any>({
        path: `/Route/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Route
     * @name EditUpdate
     * @request PUT:/Route/edit/{relationId}
     */
    editUpdate: (
      relationId: string,
      data: EditRelationRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Route/edit/${relationId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Route
     * @name RouteDelete
     * @request DELETE:/Route/{relationId}
     */
    routeDelete: (relationId: string, params: RequestParams = {}) =>
      this.request<BooleanOperationResultResponse, any>({
        path: `/Route/${relationId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
}
