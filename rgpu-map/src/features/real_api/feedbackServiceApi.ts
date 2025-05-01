import { getAccessToken } from '../../utils/tokenService';

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
export enum FeedbackStatusType {
  New = "New",
  Archived = "Archived",
}

export enum FeedbackType {
  None = "None",
  Wishes = "Wishes",
  Home = "Home",
  News = "News",
  Routes = "Routes",
  Timetable = "Timetable",
  Settings = "Settings",
  Other = "Other",
}

interface UserInfo {
  id?: string; // UUID
  firstName: string | null;
  lastName: string | null;
  middleName?: string | null;
}

interface ImageContent {
  name: string | null;
  content: string | null;
  extension: string | null;
}

interface ImageInfo {
  id?: string; // UUID
  name: string | null;
  content: string | null;
  extension: string | null;
  createdAtUtc?: string; // date-time
}

interface FeedbackInfo {
  id?: string; // UUID
  content: string | null;
  senderEmail: string | null;
  type?: FeedbackType;
  status?: FeedbackStatusType;
  createdAtUtc?: string; // date-time
  imagesCount?: number;
}

interface FeedbackResponse {
  feedback: FeedbackInfo;
  images: ImageInfo[] | null;
}

// Request DTOs
interface CreateFeedbackRequest {
  type?: FeedbackType;
  content: string | null;
  status: number;
  email: string | null;
  feedbackImages: ImageContent[] | null;
  user: UserInfo;
}

interface EditFeedbackStatusesRequest {
  feedbackIds: string[] | null; // UUID array
  status?: FeedbackStatusType;
}

// Response DTOs
interface FeedbackResponseOperationResultResponse extends OperationResultResponse<FeedbackResponse | null> {}

interface FeedbackResponseFindResultResponse extends FindResultResponse<FeedbackResponse> {}

interface GuidNullableOperationResultResponse extends OperationResultResponse<string | null> {}

interface BooleanOperationResultResponse extends OperationResultResponse<boolean> {}

interface IntPtr {}

interface FeedbackFindParams {
  feedbackstatus?: FeedbackStatusType;
  feedbacktype?: FeedbackType;
  orderbydescending?: boolean;
  page?: number;
  pageSize?: number;
  skipcount: number;
  takecount: number;
  IsCancellationRequested?: boolean;
  CanBeCanceled?: boolean;
  "WaitHandle.Handle"?: IntPtr;
  "WaitHandle.SafeWaitHandle.IsInvalid"?: boolean;
  "WaitHandle.SafeWaitHandle.IsClosed"?: boolean;
}

const BASE_URL = 'http://localhost:84/';

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
export const getFeedback = async (feedbackId: string): Promise<FeedbackResponseOperationResultResponse> => {
  try {
    const url = new URL(`${BASE_URL}Feedback/get`);
    url.searchParams.append('feedbackId', feedbackId);

    const token = getAccessToken();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': token || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse<FeedbackResponseOperationResultResponse>(response);
    return data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

export const findFeedback = async (params: FeedbackFindParams): Promise<FeedbackResponseFindResultResponse> => {
  try {
    const url = new URL(`${BASE_URL}Feedback/find`);
    if (params.feedbackstatus) {
      url.searchParams.append('feedbackstatus', params.feedbackstatus);
    }
    if (params.feedbacktype) {
      url.searchParams.append('feedbacktype', params.feedbacktype);
    }
    if (params.orderbydescending !== undefined) {
      url.searchParams.append('orderbydescending', params.orderbydescending.toString());
    }
    if (params.page !== undefined) {
      url.searchParams.append('page', params.page.toString());
    }
    if (params.pageSize !== undefined) {
      url.searchParams.append('pageSize', params.pageSize.toString());
    }
    url.searchParams.append('skipcount', params.skipcount.toString());
    url.searchParams.append('takecount', params.takecount.toString());
    if (params.IsCancellationRequested !== undefined) {
      url.searchParams.append('IsCancellationRequested', params.IsCancellationRequested.toString());
    }
    if (params.CanBeCanceled !== undefined) {
      url.searchParams.append('CanBeCanceled', params.CanBeCanceled.toString());
    }
    if (params['WaitHandle.Handle']) {
      url.searchParams.append('WaitHandle.Handle', JSON.stringify(params['WaitHandle.Handle']));
    }
    if (params['WaitHandle.SafeWaitHandle.IsInvalid'] !== undefined) {
      url.searchParams.append('WaitHandle.SafeWaitHandle.IsInvalid', params['WaitHandle.SafeWaitHandle.IsInvalid'].toString());
    }
    if (params['WaitHandle.SafeWaitHandle.IsClosed'] !== undefined) {
      url.searchParams.append('WaitHandle.SafeWaitHandle.IsClosed', params['WaitHandle.SafeWaitHandle.IsClosed'].toString());
    }

    const token = getAccessToken();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': token || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse<FeedbackResponseFindResultResponse>(response);
    return data;
  } catch (error) {
    console.error('Error finding feedback:', error);
    throw error;
  }
};

export const createFeedback = async (request: CreateFeedbackRequest): Promise<GuidNullableOperationResultResponse> => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}Feedback/create`, {
      method: 'POST',
      headers: {
        'Token': token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await handleResponse<GuidNullableOperationResultResponse>(response);
    return data;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
};

export const editFeedbackStatuses = async (request: EditFeedbackStatusesRequest): Promise<BooleanOperationResultResponse> => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}Feedback/editstatus`, {
      method: 'PUT',
      headers: {
        'Token': token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await handleResponse<BooleanOperationResultResponse>(response);
    return data;
  } catch (error) {
    console.error('Error editing feedback statuses:', error);
    throw error;
  }
};