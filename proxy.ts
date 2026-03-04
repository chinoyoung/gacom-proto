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
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        // Find the primary email address
        const primaryEmail = user.emailAddresses.find(
            (email) => email.id === user.primaryEmailAddressId
        )?.emailAddress;

        // 2. Enforce the @goabroad.com domain restriction
        if (primaryEmail && !primaryEmail.endsWith("@goabroad.com")) {
            return new NextResponse(
                `<html>
                    <head>
                        <title>Access Restricted</title>
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #1e293b; }
                            .card { background: white; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); max-width: 400px; text-align: center; border: 1px solid #e2e8f0; }
                            h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: #0f172a; }
                            p { line-height: 1.6; color: #64748b; margin-bottom: 2rem; }
                            .email { font-weight: 700; color: #4f46e5; }
                            .btn { display: inline-block; padding: 0.75rem 1.5rem; background: #0f172a; color: white; text-decoration: none; border-radius: 0.75rem; font-weight: 700; font-size: 0.875rem; transition: all 0.2s; }
                            .btn:hover { background: #1e293b; transform: translateY(-1px); }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <h1>Access Restricted</h1>
                            <p>The account (<span class="email">${primaryEmail}</span>) is not authorized to access this prototype module.</p>
                            <a href="/sign-in" class="btn">Try Another Account</a>
                        </div>
                    </body>
                </html>`,
                {
                    status: 403,
                    headers: { 'Content-Type': 'text/html' }
                }
            );
        }

        // 3. Restrict /admin access to superadmins only
        const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
        if (isAdminRoute(req)) {
            if (user.publicMetadata?.role !== "superadmin") {
                return new NextResponse(
                    `<html>
                        <head>
                            <title>Permission Denied</title>
                            <style>
                                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #1e293b; }
                                .card { background: white; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); max-width: 400px; text-align: center; border: 1px solid #e2e8f0; }
                                h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: #0f172a; }
                                p { line-height: 1.6; color: #64748b; margin-bottom: 2rem; }
                                .btn { display: inline-block; padding: 0.75rem 1.5rem; background: #0f172a; color: white; text-decoration: none; border-radius: 0.75rem; font-weight: 700; font-size: 0.875rem; transition: all 0.2s; }
                                .btn:hover { background: #1e293b; transform: translateY(-1px); }
                            </style>
                        </head>
                        <body>
                            <div class="card">
                                <h1>Permission Denied</h1>
                                <p>You do not have the required administrative privileges to access this dashboard. Please contact your system administrator.</p>
                                <a href="/" class="btn">Return Home</a>
                            </div>
                        </body>
                    </html>`,
                    {
                        status: 403,
                        headers: { 'Content-Type': 'text/html' }
                    }
                );
            }
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
