import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Skip authentication if Supabase environment variables aren't configured.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // Create a new Supabase client for every request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // IMPORTANT:
  // Keep this immediately after createServerClient().
  // This validates the user's claims and refreshes the session when necessary.
  const { data } = await supabase.auth.getClaims();

  const isAuthenticated = !!data?.claims;
  const pathname = request.nextUrl.pathname;

  /*
   * --------------------------------------------------------------------------
   * ROUTES
   * --------------------------------------------------------------------------
   */

  // Routes anyone can access.
  const publicRoutes = ["/api/inngest"];

  // Routes that require authentication.
  const protectedRoutes = ["/dashboard", "/select", "/subscribe"];

  /*
   * --------------------------------------------------------------------------
   * ROUTE CHECKS
   * --------------------------------------------------------------------------
   */

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // In this application, everything under /auth is for logged-out users.
  const isAuthRoute = pathname.startsWith("/auth");

  /*
   * --------------------------------------------------------------------------
   * ROOT
   * --------------------------------------------------------------------------
   */

  if (pathname === "/") {
    const url = request.nextUrl.clone();

    url.pathname = isAuthenticated ? "/dashboard" : "/auth/login";

    return NextResponse.redirect(url);
  }

  /*
   * --------------------------------------------------------------------------
   * PUBLIC ROUTES
   * --------------------------------------------------------------------------
   */

  // Public routes are available to everyone.
  if (isPublicRoute) {
    return supabaseResponse;
  }

  /*
   * --------------------------------------------------------------------------
   * AUTH ROUTES
   * --------------------------------------------------------------------------
   */

  // Authenticated users should never see /auth/*
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";

    return NextResponse.redirect(url);
  }

  // Unauthenticated users are allowed to access /auth/*
  if (!isAuthenticated && isAuthRoute) {
    return supabaseResponse;
  }

  /*
   * --------------------------------------------------------------------------
   * PROTECTED ROUTES
   * --------------------------------------------------------------------------
   */

  // Unauthenticated users cannot access protected routes.
  if (!isAuthenticated && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";

    return NextResponse.redirect(url);
  }

  /*
   * --------------------------------------------------------------------------
   * EVERYTHING ELSE
   * --------------------------------------------------------------------------
   */

  return supabaseResponse;
}
