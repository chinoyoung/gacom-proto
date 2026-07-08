"use client";

import { useUser } from "@clerk/nextjs";
import { isSuperadminRole } from "./is-superadmin";

/**
 * Client-side convenience check for the superadmin role, read from Clerk
 * publicMetadata. UX gating only — Convex mutations re-check server-side.
 */
export function useIsSuperadmin(): boolean {
  const { user } = useUser();
  return isSuperadminRole(user?.publicMetadata?.role);
}
