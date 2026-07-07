import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Server actions can't run in jsdom — stub them.
vi.mock("@/lib/actions", () => ({
  saveRecord: vi.fn().mockResolvedValue({ ok: true }),
  deleteRecord: vi.fn().mockResolvedValue({ ok: true }),
}));

import { ResourceView } from "@/components/ResourceView";
import { deleteRecord } from "@/lib/actions";

const rows = [
  {
    id: "1",
    dateOpened: "2026-07-01",
    customer: "Coastal Home Goods",
    contact: "Marcus Lee",
    issue: "Requesting additional origin free time",
    priority: "High",
    waitingOn: "Trade",
    nextAction: "Follow up",
    dueDate: "2000-01-01", // overdue
    status: "Waiting on Trade",
  },
  {
    id: "2",
    dateOpened: "2026-07-02",
    customer: "ABC Imports",
    contact: "Dana",
    issue: "Two containers rolled",
    priority: "Medium",
    waitingOn: "",
    nextAction: "Confirm sailing",
    dueDate: null,
    status: "Open",
  },
];

describe("ResourceView", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders seed rows", () => {
    render(<ResourceView resourceKey="customer-issues" rows={rows} />);
    expect(screen.getByText("Coastal Home Goods")).toBeInTheDocument();
    expect(screen.getByText("ABC Imports")).toBeInTheDocument();
  });

  it("filters rows by search text", async () => {
    const user = userEvent.setup();
    render(<ResourceView resourceKey="customer-issues" rows={rows} />);
    await user.type(screen.getByPlaceholderText(/search/i), "Coastal");
    expect(screen.getByText("Coastal Home Goods")).toBeInTheDocument();
    expect(screen.queryByText("ABC Imports")).not.toBeInTheDocument();
  });

  it("highlights overdue rows", () => {
    render(<ResourceView resourceKey="customer-issues" rows={rows} />);
    const overdueCell = screen.getByText("Coastal Home Goods").closest("tr");
    expect(overdueCell?.className).toMatch(/danger/);
  });

  it("opens the add form when clicking Add", async () => {
    const user = userEvent.setup();
    render(<ResourceView resourceKey="customer-issues" rows={rows} />);
    await user.click(screen.getByRole("button", { name: /add issue/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("New Issue")).toBeInTheDocument();
  });

  it("deletes through the confirm dialog", async () => {
    const user = userEvent.setup();
    render(<ResourceView resourceKey="customer-issues" rows={rows} />);
    const firstRow = screen.getByText("Coastal Home Goods").closest("tr")!;
    await user.click(within(firstRow).getByLabelText("Delete"));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /^delete$/i }));
    expect(deleteRecord).toHaveBeenCalledWith("customer-issues", "1");
  });
});
