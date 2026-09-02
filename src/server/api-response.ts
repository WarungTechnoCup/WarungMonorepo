import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthenticationError } from "@/server/auth";
import type { ApiFailure } from "@/types/api";

export class NotFoundError extends Error {}
export class ConflictError extends Error {}

export function apiError(error: unknown) {
  const requestId = randomUUID();
  let status = 500;
  let code = "INTERNAL_ERROR";
  let message = "Terjadi gangguan. Coba lagi beberapa saat.";
  let fieldErrors: Record<string, string[]> | undefined;

  if (error instanceof ZodError) {
    status = 400;
    code = "VALIDATION_ERROR";
    message = "Periksa kembali data yang dimasukkan.";
    fieldErrors = error.flatten().fieldErrors as Record<string, string[]>;
  } else if (error instanceof AuthenticationError) {
    status = 401;
    code = "AUTHENTICATION_REQUIRED";
    message = error.message;
  } else if (error instanceof NotFoundError) {
    status = 404;
    code = "NOT_FOUND";
    message = error.message;
  } else if (error instanceof ConflictError) {
    status = 409;
    code = "CONFLICT";
    message = error.message;
  }

  const body: ApiFailure = { code, message, requestId, fieldErrors };
  return NextResponse.json(body, { status });
}
