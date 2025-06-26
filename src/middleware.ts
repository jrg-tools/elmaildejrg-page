import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isProtectedRoute = createRouteMatcher(['/(.*)']);
const isPublicRoute = createRouteMatcher(['/']);

export const onRequest = clerkMiddleware((auth, context) => {
  const { userId, sessionClaims, redirectToSignIn } = auth();

  // 1. Public route: skip
  if (isPublicRoute(context.request))
    return;

  // 2. Admin route: check user and role
  if (isAdminRoute(context.request)) {
    const role = sessionClaims?.privateMetadata?.role;

    if (!userId) {
      return redirectToSignIn();
    }

    if (role !== 'admin') {
      return new Response('Forbidden', { status: 403 });
    }

    return; // Admin is allowed
  }

  // 3. All other protected routes: require sign-in
  if (!userId && isProtectedRoute(context.request)) {
    return redirectToSignIn();
  }
});
