import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Next navigation hooks used across client components.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/customer-issues",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Auth client helpers.
vi.mock("next-auth/react", () => ({
  signIn: vi.fn().mockResolvedValue({ ok: true }),
  signOut: vi.fn(),
}));
