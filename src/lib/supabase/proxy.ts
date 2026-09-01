import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { ConfigurationError, getSupabasePublicConfig } from "@/lib/env";

const protectedPrefixes = ["/lapor-harga", "/aktivitas", "/passport", "/admin"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function signInRedirect(request: NextRequest, status: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/masuk";
  url.searchParams.set("status", status);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function refreshSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const protectedPath = isProtectedPath(request.nextUrl.pathname);

  try {
    const { url, publishableKey } = getSupabasePublicConfig();
    const supabase = createServerClient(url, publishableKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data, error } = await supabase.auth.getClaims();

    if (protectedPath && (error || !data?.claims)) {
      return signInRedirect(request, "autentikasi");
    }

    return response;
  } catch (error) {
    if (protectedPath) {
      return signInRedirect(
        request,
        error instanceof ConfigurationError ? "konfigurasi" : "layanan",
      );
    }

    return response;
  }
}
