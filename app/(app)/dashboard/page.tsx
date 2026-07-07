import Link from "next/link";
import { AlertCircle, Phone, CalendarClock, RefreshCw, Clock } from "lucide-react";
import { requireUserId } from "@/lib/auth";
import { getDashboardData } from "@/lib/reportUtils";
import { MetricCard } from "@/components/MetricCard";
import { SectionCard } from "@/components/SectionCard";
import { TodayTop3, Scorecard } from "@/components/DashboardWidgets";
import { WORK_BLOCKS } from "@/lib/constants";

export default async function DashboardPage() {
  const userId = await requireUserId();
  const data = await getDashboardData(userId);
  const plan = data.plan;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Open Issues"
          value={data.counts.openIssues}
          sub={`${data.counts.highIssues} high priority`}
          tone={data.counts.openIssues > 0 ? "danger" : "ok"}
          icon={<AlertCircle className="h-4 w-4" />}
        />
        <MetricCard
          label="Follow-ups Due"
          value={data.counts.followUpsDueToday}
          sub="Today & overdue"
          tone={data.counts.followUpsDueToday > 0 ? "warn" : "ok"}
          icon={<Phone className="h-4 w-4" />}
        />
        <MetricCard
          label="CRM Reminders"
          value={data.counts.crmReminders}
          sub="Meetings not updated"
          tone={data.counts.crmReminders > 0 ? "warn" : "ok"}
          icon={<RefreshCw className="h-4 w-4" />}
        />
        <MetricCard
          label="Urgent Items"
          value={data.urgent.length}
          sub="Need attention now"
          tone={data.urgent.length > 0 ? "danger" : "ok"}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TodayTop3
          initial={{
            top1: plan?.top1 ?? "",
            top2: plan?.top2 ?? "",
            top3: plan?.top3 ?? "",
          }}
        />

        <SectionCard title="Today's Work Blocks" description="Your default rhythm.">
          <ul className="space-y-2">
            {WORK_BLOCKS.map((b) => (
              <li
                key={b.time}
                className="flex items-center gap-4 rounded-lg border border-line bg-cream/50 px-4 py-2.5"
              >
                <CalendarClock className="h-4 w-4 shrink-0 text-sage" />
                <span className="w-28 shrink-0 font-medium text-navy">{b.time}</span>
                <span className="text-sm text-ink">{b.label}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <Scorecard
        actuals={data.scorecardActuals}
        stored={(plan?.scorecard as Record<string, { goal: number; actual: number }>) ?? null}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="Urgent Items"
          description="High priority, due today, or overdue."
        >
          {data.urgent.length === 0 ? (
            <p className="py-6 text-center text-sm text-warmgray">
              Nothing urgent. Enjoy the calm. ⚓
            </p>
          ) : (
            <ul className="space-y-2">
              {data.urgent.map((u) => (
                <li
                  key={u.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-line bg-white px-3 py-2.5"
                >
                  <span className="text-sm text-ink">{u.label}</span>
                  <span className="shrink-0 rounded-full bg-danger-soft px-2 py-0.5 text-xs font-medium text-danger">
                    {u.reason}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Waiting On"
          description="Parked on customers, trade, or others."
        >
          {data.waiting.length === 0 ? (
            <p className="py-6 text-center text-sm text-warmgray">
              Nothing waiting on anyone else.
            </p>
          ) : (
            <ul className="space-y-2">
              {data.waiting.map((w) => (
                <li
                  key={w.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-line bg-white px-3 py-2.5"
                >
                  <span className="text-sm text-ink">{w.label}</span>
                  <span className="shrink-0 rounded-full bg-sage-soft px-2 py-0.5 text-xs font-medium text-sage-dark">
                    {w.detail}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/customer-issues"
          className="text-sm font-medium text-navy underline-offset-4 hover:underline"
        >
          Go to Customer Issues →
        </Link>
        <Link
          href="/daily-planner"
          className="text-sm font-medium text-navy underline-offset-4 hover:underline"
        >
          Open Daily Planner →
        </Link>
      </div>
    </div>
  );
}
