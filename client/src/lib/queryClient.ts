import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: {
    isFormData?: boolean;
  }
): Promise<Response> {
  // Get auth token from localStorage
  const authData = localStorage.getItem("harvest_direct_auth");
  let token = null;
  if (authData) {
    try {
      const parsedAuth = JSON.parse(authData);
      token = parsedAuth.token;
      
      // Validate token is not null, undefined, or string literals
      if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
        token = null;
        // Invalid or empty token found in localStorage - ignore
      }
    } catch (e) {
      // Failed to parse auth data - ignore
      token = null;
    }
  }

  // Prepare headers
  const headers: Record<string, string> = {};
  
  // Only set content-type for JSON data, not for FormData (browser sets it with boundary)
  if (data && !options?.isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  // Only add Authorization header if we have a valid token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    let body: any = undefined;
    
    if (data) {
      if (options?.isFormData) {
        // For FormData, use as is
        body = data as FormData;
      } else {
        // For JSON, stringify the data
        body = JSON.stringify(data);
      }
    }
    
    const res = await fetch(url, {
      method,
      headers,
      body,
      credentials: "include", // Keep this for cookies as well
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get auth token from localStorage
    const authData = localStorage.getItem("harvest_direct_auth");
    let token = null;
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        token = parsedAuth.token;
      } catch (e) {
        // Failed to parse auth data - ignore
      }
    }

    // Prepare headers
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Build URL with query parameters if provided
    let url = queryKey[0] as string;
    if (queryKey[1] && typeof queryKey[1] === 'object') {
      const params = new URLSearchParams();
      const queryParams = queryKey[1] as Record<string, any>;
      
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      
      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
    }

    const res = await fetch(url, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
