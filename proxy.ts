import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Handle Unauthenticated Users for Protected Routes
  const protectedRoutes = [
    "/profile",
    "/weekly-plan",
    "/weekly-plan-ai",
    "/whatever-cook",
    "/publish",
    "/favorites",
    "/checkout",
  ];

  const isProtectedPage = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // 2. Fetch profile data (including onboarding status and identifiers)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding_completed, name")
    .eq("id", user?.id)
    .single();

  const allowedPathsForNonOnboarded = ["/onboarding", "/auth", "/api/auth"];

  const isAllowedPath = allowedPathsForNonOnboarded.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // 3. Handle Onboarding Redirection
  if (user && !isAllowedPath) {
    // Only redirect to onboarding if we can't find a profile OR it's explicitly incomplete
    // We ignore transient query errors (!profileError) to avoid accidental redirects
    if (!profile?.onboarding_completed && !profileError) {
      const redirectUrl = new URL("/onboarding", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // 4. Handle Own-Profile Redirection (Prevention of visiting self-public-page)
    const pathParts = request.nextUrl.pathname.split("/").filter(Boolean);
    if (
      pathParts.length === 2 &&
      (pathParts[0] === "profile" || pathParts[0] === "users")
    ) {
      const identifier = pathParts[1];
      if (
        identifier === user.id ||
        (profile?.name && identifier === profile.name)
      ) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }
  }

  // 5. Redirect users AWAY from onboarding if they are already completed
  if (user && request.nextUrl.pathname.startsWith("/onboarding")) {
    if (profile?.onboarding_completed) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, etc.
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
