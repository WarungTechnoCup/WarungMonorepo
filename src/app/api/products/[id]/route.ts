import { NextResponse } from "next/server";

import { apiError } from "@/server/api-response";
import { getProduct } from "@/server/harga-wajar/repository";
import type { ApiSuccess } from "@/types/api";
import type { ProductDto } from "@/types/harga-wajar";

interface ProductRouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: ProductRouteProps) {
  try {
    const { id } = await params;
    const response: ApiSuccess<ProductDto> = {
      data: await getProduct(decodeURIComponent(id)),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch (error) {
    return apiError(error);
  }
}
