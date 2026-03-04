"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    const client = await clerkClient();
    const usersResponse = await client.users.getUserList({
        limit: 100,
    });

    // Process and return serialized users
    // Clerk returns a class instance, so we map to raw objects
    return usersResponse.data.map(user => ({
        id: user.id,
        email: user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || "No email",
        firstName: user.firstName,
        lastName: user.lastName,
        isSuperadmin: user.publicMetadata?.role === "superadmin",
    }));
}

export async function toggleSuperadmin(userId: string, currentStatus: boolean) {
    const client = await clerkClient();

    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            role: currentStatus ? null : "superadmin"
        }
    });

    revalidatePath("/admin");
}
