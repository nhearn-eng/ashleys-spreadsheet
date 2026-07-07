"use client";

import * as React from "react";
import { ResourceView } from "./ResourceView";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/lib/utils";

type Row = Record<string, unknown> & { id: string };

function nameMatches(field: unknown, name: string) {
  return String(field ?? "").toLowerCase().includes(name.toLowerCase());
}

function RelatedSection({
  title,
  items,
  render,
  emptyLabel,
}: {
  title: string;
  items: Row[];
  render: (item: Row) => React.ReactNode;
  emptyLabel: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-warmgray">
        {title} · {items.length}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-warmgray-light">{emptyLabel}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li
              key={it.id}
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
            >
              {render(it)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CustomersView({
  rows,
  issues,
  meetings,
  opportunities,
  marketIntel,
}: {
  rows: Row[];
  issues: Row[];
  meetings: Row[];
  opportunities: Row[];
  marketIntel: Row[];
}) {
  const detail = (customer: Row) => {
    const name = String(customer.customer ?? "");
    const relIssues = issues.filter((i) => nameMatches(i.customer, name));
    const relMeetings = meetings.filter((m) => nameMatches(m.customer, name));
    const relOpps = opportunities.filter((o) => nameMatches(o.customer, name));
    const relMarket = marketIntel.filter(
      (m) =>
        nameMatches(m.customersImpacted, name) ||
        nameMatches(m.namedAccountImpact, name)
    );

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-cream px-4 py-3 text-sm">
          <Field label="Main Contact" value={customer.mainContact} />
          <Field label="Trade Lane" value={customer.tradeLane} />
          <Field label="Phone" value={customer.phone} />
          <Field label="Email" value={customer.email} />
          <Field label="Annual Volume" value={customer.annualVolume} />
          <Field label="Next Meeting" value={formatDate(customer.nextMeeting as string)} />
        </div>

        <RelatedSection
          title="Open & recent issues"
          items={relIssues}
          emptyLabel="No issues on record."
          render={(i) => (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate">{String(i.issue)}</span>
              <StatusBadge status={String(i.status)} />
            </div>
          )}
        />
        <RelatedSection
          title="Opportunities"
          items={relOpps}
          emptyLabel="No opportunities linked."
          render={(o) => (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate">{String(o.opportunity)}</span>
              <StatusBadge status={String(o.status)} />
            </div>
          )}
        />
        <RelatedSection
          title="Meetings"
          items={relMeetings}
          emptyLabel="No meetings logged."
          render={(m) => (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate">
                {String(m.meetingType)} — {String(m.discussion) || "—"}
              </span>
              <span className="shrink-0 text-warmgray">
                {formatDate(m.date as string)}
              </span>
            </div>
          )}
        />
        <RelatedSection
          title="Market impact"
          items={relMarket}
          emptyLabel="No market items reference this customer."
          render={(m) => (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate">
                {String(m.surchargeType)} · {String(m.trade)}
              </span>
              <StatusBadge status={String(m.status)} />
            </div>
          )}
        />
      </div>
    );
  };

  return (
    <ResourceView
      resourceKey="customers"
      rows={rows}
      detail={detail}
      detailTitle={(c) => String(c.customer)}
    />
  );
}

function Field({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-warmgray">{label}</p>
      <p className="text-ink">{String(value ?? "") || "—"}</p>
    </div>
  );
}
