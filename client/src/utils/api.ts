// api.ts client/src/utils/api.ts
// The ONE function every page uses to talk to the server:
//   const { categories } = await api<CategoriesResponse>("/categories");
//   await api("/auth/login", { method: "POST", body: { email, password } });

// STEP 30 (part 2): Talk to the server

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

// Where the login token is kept in the browser
export const TOKEN_KEY = "quickcart_token";

// An error from the server, with its status code
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
};

export const api = async <T>(
  path: string,
  { method = "GET", body, signal }: ApiOptions = {},
): Promise<T> => {
  const isForm = body instanceof FormData;
  const headers: Record<string, string> = {};

  // Attach the login token when available
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // JSON bodies need this header. FormData must NOT have it.
  if (body !== undefined && !isForm) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;

  try {
    response = await fetch(API_URL + path, {
      method,
      headers,
      body:
        body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw error;
    }

    throw new ApiError(
      0,
      "Can't reach QuickCart right now. Check your connection and try again.",
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message ?? "Something went wrong. Please try again.",
    );
  }

  return data as T;
};
