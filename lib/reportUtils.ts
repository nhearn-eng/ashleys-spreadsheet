import { prisma } from "./prisma";
import { isOverdue, isToday, startOfToday, daysSince } from "./utils";

export type UrgentItem = {
  id: string;
  label: string;
  source: string;
  reason: string;
};

export type WaitingItem = {
  id: string;
  label: string;
  source: string;
  detail: string;
};

/** Everything the dashboard needs, in one round of queries. */
export async function getDashboardData(userId: string) {
  const [issues, prospects, meetings, opportunities, priorities, plan] =
    await Promise.all([
      prisma.customerIssue.findMany({ where: { userId } }),
      prisma.prospect.findMany({ where: { userId } }),
      prisma.meetingLog.findMany({ where: { userId } }),
      prisma.opportunity.findMany({ where: { userId } }),
      prisma.weeklyPriority.findMany({ where: { userId } }),
      prisma.dailyPlan.findUnique({
        where: { userId_date: { userId, date: startOfToday() } },
      }),
    ]);

  const openIssues = issues.filter((i) => i.status !== "Closed");
  const highIssues = openIssues.filter((i) => i.priority === "High");
  const followUpsDueToday = prospects.filter(
    (p) => p.nextFollowUp && (isToday(p.nextFollowUp) || isOverdue(p.nextFollowUp))
  );
  const crmReminders = meetings.filter((m) => !m.crmUpdated);

  // Urgent = high priority, due today, overdue, or CRM not updated.
  const urgent: UrgentItem[] = [];
  for (const i of openIssues) {
    if (i.priority === "High")
      urgent.push({ id: `i-${i.id}`, label: `${i.customer}: ${i.issue}`, source: "Issue", reason: "High priority" });
    else if (i.dueDate && isOverdue(i.dueDate))
      urgent.push({ id: `i-${i.id}`, label: `${i.customer}: ${i.issue}`, source: "Issue", reason: "Overdue" });
    else if (i.dueDate && isToday(i.dueDate))
      urgent.push({ id: `i-${i.id}`, label: `${i.customer}: ${i.issue}`, source: "Issue", reason: "Due today" });
  }
  for (const p of followUpsDueToday)
    urgent.push({ id: `p-${p.id}`, label: `${p.company} follow-up`, source: "Prospect", reason: isOverdue(p.nextFollowUp!) ? "Overdue" : "Due today" });
  for (const o of opportunities)
    if (o.dueDate && (isOverdue(o.dueDate) || isToday(o.dueDate)) && !["Won", "Lost", "Closed"].includes(o.status))
      urgent.push({ id: `o-${o.id}`, label: `${o.customer}: ${o.opportunity}`, source: "Opportunity", reason: isOverdue(o.dueDate) ? "Overdue" : "Due today" });

  // Waiting On = items parked on someone else.
  const waiting: WaitingItem[] = [];
  for (const i of openIssues)
    if (i.status.startsWith("Waiting") || i.status === "Escalated")
      waiting.push({ id: `wi-${i.id}`, label: `${i.customer}: ${i.issue}`, source: "Issue", detail: i.waitingOn || i.status });
  for (const pr of priorities)
    if (pr.status === "Waiting")
      waiting.push({ id: `wp-${pr.id}`, label: pr.task, source: "Priority", detail: pr.category });
  for (const o of opportunities)
    if (o.status === "In Progress" || o.status === "Customer Contacted")
      waiting.push({ id: `wo-${o.id}`, label: `${o.customer}: ${o.opportunity}`, source: "Opportunity", detail: o.status });

  const scorecardActuals: Record<string, number> = {
    outreach: prospects.filter((p) => p.lastContact && isToday(p.lastContact)).length,
    followUps: followUpsDueToday.length,
    meetings: meetings.filter((m) => m.date && isToday(m.date)).length,
    quotes: prospects.filter((p) => p.status === "Proposal Sent").length,
    issues: openIssues.length,
    crm: meetings.filter((m) => m.crmUpdated).length,
  };

  return {
    plan,
    counts: {
      openIssues: openIssues.length,
      highIssues: highIssues.length,
      followUpsDueToday: followUpsDueToday.length,
      crmReminders: crmReminders.length,
    },
    urgent,
    waiting,
    scorecardActuals,
  };
}

function inRange(date: Date | null | undefined, from: Date, to: Date) {
  if (!date) return false;
  return date >= from && date <= to;
}

export type DateRange = { from: Date; to: Date; label: string };

export function resolveRange(preset: string, fromStr?: string, toStr?: string): DateRange {
  const today = startOfToday();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  if (preset === "today") return { from: today, to: end, label: "Today" };
  if (preset === "month") {
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from, to: end, label: "This Month" };
  }
  if (preset === "custom" && fromStr && toStr) {
    const from = new Date(fromStr);
    from.setHours(0, 0, 0, 0);
    const to = new Date(toStr);
    to.setHours(23, 59, 59, 999);
    return { from, to, label: "Custom Range" };
  }
  // default: this week (Mon–now)
  const from = new Date(today);
  const dow = (from.getDay() + 6) % 7; // Mon = 0
  from.setDate(from.getDate() - dow);
  return { from, to: end, label: "This Week" };
}

/** All reporting-portal metrics for a date range. */
export async function getReportData(userId: string, range: DateRange) {
  const [issues, prospects, customers, meetings, opportunities, priorities, market] =
    await Promise.all([
      prisma.customerIssue.findMany({ where: { userId } }),
      prisma.prospect.findMany({ where: { userId } }),
      prisma.customer.findMany({ where: { userId } }),
      prisma.meetingLog.findMany({ where: { userId } }),
      prisma.opportunity.findMany({ where: { userId } }),
      prisma.weeklyPriority.findMany({ where: { userId } }),
      prisma.marketIntelligence.findMany({ where: { userId } }),
    ]);

  const { from, to } = range;
  const openIssues = issues.filter((i) => i.status !== "Closed");

  const salesActivity = {
    "New prospects added": prospects.filter((p) => inRange(p.createdAt, from, to)).length,
    "Follow-ups due": prospects.filter((p) => inRange(p.nextFollowUp, from, to)).length,
    "Proposals sent": prospects.filter((p) => p.status === "Proposal Sent").length,
    "Meetings logged": meetings.filter((m) => inRange(m.date, from, to)).length,
    "Active opportunities": opportunities.filter((o) => !["Won", "Lost", "Closed"].includes(o.status)).length,
    "Won opportunities": opportunities.filter((o) => o.status === "Won").length,
    "Lost opportunities": opportunities.filter((o) => o.status === "Lost").length,
  };

  const ages = openIssues.map((i) => daysSince(i.dateOpened));
  const customerIssueReport = {
    "Open issues": openIssues.length,
    "High priority": openIssues.filter((i) => i.priority === "High").length,
    Escalated: issues.filter((i) => i.status === "Escalated").length,
    "Waiting on customer": issues.filter((i) => i.status === "Waiting on Customer").length,
    "Waiting on trade": issues.filter((i) => i.status === "Waiting on Trade").length,
    "Closed issues": issues.filter((i) => i.status === "Closed").length,
    "Avg. issue age (days)": ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0,
  };

  const marketReport = {
    "Active GRI announcements": market.filter((m) => m.surchargeType === "GRI" && m.status !== "Expired").length,
    "Active PSS announcements": market.filter((m) => m.surchargeType === "PSS" && m.status !== "Expired").length,
    "Customer notification needed": market.filter((m) => m.status === "Customer Notification Needed").length,
    "Upcoming effective dates": market.filter((m) => m.effectiveDate && m.effectiveDate >= from).length,
  };

  const crmHygiene = {
    "Meetings not updated in CRM": meetings.filter((m) => !m.crmUpdated).length,
    "Follow-ups overdue": prospects.filter((p) => p.nextFollowUp && isOverdue(p.nextFollowUp)).length,
    "Customers missing next meeting": customers.filter((c) => !c.nextMeeting).length,
    "Prospects missing next follow-up": prospects.filter((p) => !p.nextFollowUp).length,
    "Open tasks overdue": priorities.filter((p) => p.status !== "Completed" && p.dueDate && isOverdue(p.dueDate)).length,
  };

  const executive = {
    topCompleted: priorities.filter((p) => p.status === "Completed").map((p) => p.task),
    openRisks: openIssues.filter((i) => i.priority === "High").map((i) => `${i.customer}: ${i.issue}`),
    marketUpdates: market.filter((m) => m.status !== "Expired").map((m) => `${m.surchargeType} on ${m.trade} (${m.amount})`),
    opportunities: opportunities.filter((o) => !["Won", "Lost", "Closed"].includes(o.status)).map((o) => `${o.customer}: ${o.opportunity}`),
    crmCleanup: meetings.filter((m) => !m.crmUpdated).map((m) => `${m.customer} — ${m.meetingType} on ${m.date?.toLocaleDateString() ?? ""}`),
  };

  return { salesActivity, customerIssueReport, marketReport, crmHygiene, executive };
}
