import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { listProducts } from "@/server/harga-wajar/repository";
import type { ApiSuccess } from "@/types/api";
import type { ProductDto } from "@/types/harga-wajar";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query") ?? "";
    const response: ApiSuccess<ProductDto[]> = {
      data: await listProducts(query),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch (error) {
    return apiError(error);
  }
}
