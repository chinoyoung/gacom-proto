/** The Clerk publicMetadata role that grants prototype admin privileges. */
export const SUPERADMIN_ROLE = "superadmin";

/**
 * Pure check for the superadmin role. Framework-free so it can be unit-tested
 * without Clerk. Must match `isSuperadmin` in convex/comments.ts.
 */
export function isSuperadminRole(role: unknown): boolean {
  return role === SUPERADMIN_ROLE;
}
