import type { ApiFailure, ApiSuccess } from "@/types/api";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function fetchApi<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, init);
  const body = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (!response.ok || !("data" in body)) {
    const failure = body as ApiFailure;
    throw new ApiClientError(
      failure.message ?? "Permintaan tidak dapat diproses.",
      failure.code ?? "UNKNOWN_ERROR",
      failure.fieldErrors,
    );
  }

  return body.data;
}
