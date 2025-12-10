type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

type ApiClientOptions = {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
};

type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export async function apiClient<T = unknown>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, cache } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    cache,
  };

  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(path, requestOptions);

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as ApiResponse<T>;
      throw new Error(
        errorData.error || errorData.message || `API request failed: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as ApiResponse<T> | T;

    if (typeof data === 'object' && data !== null && 'error' in data) {
      const apiResponse = data as ApiResponse<T>;
      if (apiResponse.error) {
        throw new Error(apiResponse.error);
      }
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during API request');
  }
}

export const api = {
  get: <T = unknown>(path: string, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(path, { ...options, method: 'GET' }),

  post: <T = unknown>(path: string, body?: unknown, options?: Omit<ApiClientOptions, 'method'>) =>
    apiClient<T>(path, { ...options, method: 'POST', body }),

  patch: <T = unknown>(path: string, body?: unknown, options?: Omit<ApiClientOptions, 'method'>) =>
    apiClient<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T = unknown>(path: string, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(path, { ...options, method: 'DELETE' }),

  put: <T = unknown>(path: string, body?: unknown, options?: Omit<ApiClientOptions, 'method'>) =>
    apiClient<T>(path, { ...options, method: 'PUT', body }),
};
