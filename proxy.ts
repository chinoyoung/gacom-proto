// proxy.ts
import { clerkMiddleware, clerkClient, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // 1. Force authentication for all routes except public ones
    if (!isPublicRoute(req)) {
        await auth.protect();
    }

    // 2. Retrieve the user's email to enforce the domain restriction
    const { userId } = await auth();

    if (userId) {
        // Fetch the full user object from Clerk Backend. 
        // This removes the need for manual Session Token customization.
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        // Find the primary email address
        const primaryEmail = user.emailAddresses.find(
            (email) => email.id === user.primaryEmailAddressId
        )?.emailAddress;

        if (primaryEmail && !primaryEmail.endsWith("@goabroad.com")) {
            return new NextResponse(
                `Unauthorized: Your email (${primaryEmail}) is not authorized. Only @goabroad.com accounts can access this prototype.`,
                { status: 403 }
            );
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
