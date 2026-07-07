import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const username = parsed.data.username.toLowerCase();
        const { password } = parsed.data;

        let user = await prisma.user.findUnique({ where: { email: username } });

        // First-run bootstrap: if no user exists yet, create one from the
        // AUTH_USERNAME / AUTH_PASSWORD env vars. This makes a fresh Vercel
        // deploy work with zero manual seeding — the fixed credentials come
        // straight from the environment.
        if (!user) {
          const envUser = (process.env.AUTH_USERNAME ?? "").toLowerCase();
          const envPass = process.env.AUTH_PASSWORD ?? "";
          if (envUser && envPass && username === envUser && password === envPass) {
            const passwordHash = await bcrypt.hash(envPass, 12);
            user = await prisma.user.upsert({
              where: { id: "single-user" },
              create: { id: "single-user", email: envUser, passwordHash },
              update: { email: envUser, passwordHash },
            });
          } else {
            return null;
          }
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return { id: user.id, name: user.email, email: user.email };
      },
    }),
  ],
});
