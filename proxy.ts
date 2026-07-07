import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Middleware uses only the edge-safe config (JWT read, no DB access).
export default NextAuth(authConfig).auth;

export const config = {
  // Protect everything except Next internals, the auth API, and static files.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
