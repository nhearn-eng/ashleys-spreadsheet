import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Resolve the signed-in user's id in Server Components and Server Actions.
 * Redirects to /login when there is no session (defence in depth on top of
 * middleware).
 */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
