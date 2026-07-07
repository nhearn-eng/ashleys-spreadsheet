import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";

describe("StatusBadge", () => {
  it("renders the status text", () => {
    render(<StatusBadge status="Escalated" />);
    expect(screen.getByText("Escalated")).toBeInTheDocument();
  });

  it("shows a dash for empty status", () => {
    render(<StatusBadge status="" />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("PriorityBadge", () => {
  it("renders the priority label", () => {
    render(<PriorityBadge priority="High" />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
