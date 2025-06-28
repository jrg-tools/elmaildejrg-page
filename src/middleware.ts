import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher(['/edit(.*)']);

export const onRequest = clerkMiddleware(async (auth, context) => {
  const { userId, redirectToSignIn } = auth();

  if (!isProtectedRoute(context.request)) {
    return;
  }

  if (!userId) {
    return redirectToSignIn();
  }

  const user = await clerkClient(context).users.getUser(userId);
  const role = user?.privateMetadata?.role;

  if (role !== 'admin') {
    return new Response('Unauthorized', { status: 403 });
  }
});
