import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import LoginPage from "@/app/(auth)/login/page";

describe("Login page", () => {
  it("renders username, password, and a submit button", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("calls signIn with the entered credentials", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.type(screen.getByLabelText("Username"), "ashley");
    await user.type(screen.getByLabelText("Password"), "command2026");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(signIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ username: "ashley", password: "command2026", redirect: false })
    );
  });
});
