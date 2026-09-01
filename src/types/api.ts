export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  requestId: string;
}
