import {
  LayoutDashboard,
  CalendarCheck,
  AlertCircle,
  Search,
  Users,
  Newspaper,
  Target,
  NotebookPen,
  ListChecks,
  BarChart3,
  FileDown,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "Sales Command Center";

// Single-user MVP: every record is owned by this id. The seeded User row uses it.
export const SINGLE_USER_ID = "single-user";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/daily-planner", label: "Daily Planner", icon: CalendarCheck },
  { href: "/customer-issues", label: "Customer Issues", icon: AlertCircle },
  { href: "/prospects", label: "Prospect Pipeline", icon: Search },
  { href: "/customers", label: "Customer Master List", icon: Users },
  { href: "/market-intelligence", label: "Market Intelligence", icon: Newspaper },
  { href: "/opportunities", label: "Opportunity Tracker", icon: Target },
  { href: "/meetings", label: "Meeting & Visit Log", icon: NotebookPen },
  { href: "/weekly-priorities", label: "Weekly Priorities", icon: ListChecks },
  { href: "/reporting", label: "Reporting Portal", icon: BarChart3 },
  { href: "/exports", label: "PDF Exports", icon: FileDown },
  { href: "/settings", label: "Settings", icon: Settings },
];

// --- Dropdown option lists (single source of truth) ------------------------

export const PRIORITY_OPTIONS = ["High", "Medium", "Low"] as const;

export const ISSUE_STATUS_OPTIONS = [
  "Open",
  "Waiting on Customer",
  "Waiting on Trade",
  "Escalated",
  "Closed",
] as const;

export const PROSPECT_STATUS_OPTIONS = [
  "Researching",
  "Initial Outreach",
  "Follow Up #1",
  "Follow Up #2",
  "Meeting Scheduled",
  "Proposal Sent",
  "Active Customer",
  "Closed",
] as const;

export const SURCHARGE_TYPE_OPTIONS = [
  "GRI",
  "PSS",
  "EIS",
  "FAK Adjustment",
  "BAF",
  "Congestion Surcharge",
  "Equipment Imbalance",
  "Blank Sailing",
  "Service Change",
  "Other",
] as const;

export const MARKET_STATUS_OPTIONS = [
  "Need Review",
  "Customer Notification Needed",
  "Customer Notified",
  "Monitoring",
  "Expired",
] as const;

export const OPPORTUNITY_STATUS_OPTIONS = [
  "Open",
  "In Progress",
  "Customer Contacted",
  "Meeting Scheduled",
  "Won",
  "Lost",
  "Closed",
] as const;

export const MEETING_TYPE_OPTIONS = [
  "Call",
  "In Person",
  "Teams",
  "Lunch",
  "Site Visit",
] as const;

export const YES_NO_OPTIONS = ["Yes", "No"] as const;

export const WEEKLY_CATEGORY_OPTIONS = [
  "Customer",
  "Prospecting",
  "Internal",
  "CRM",
  "Reporting",
  "Market Intelligence",
  "Expenses",
] as const;

export const WEEKLY_STATUS_OPTIONS = [
  "Not Started",
  "In Progress",
  "Waiting",
  "Completed",
] as const;

// Dashboard scorecard rows: key + label + which model drives the auto "actual".
export const SCORECARD_ROWS = [
  { key: "outreach", label: "New Customer Outreach", defaultGoal: 5 },
  { key: "followUps", label: "Follow-Up Calls", defaultGoal: 5 },
  { key: "meetings", label: "Meetings Scheduled", defaultGoal: 2 },
  { key: "quotes", label: "Quotes Submitted", defaultGoal: 3 },
  { key: "issues", label: "Open Customer Issues", defaultGoal: 0 },
  { key: "crm", label: "CRM Updated", defaultGoal: 1 },
] as const;

export const WORK_BLOCKS = [
  { time: "9:00 – 10:30", label: "Email + Market Intelligence" },
  { time: "10:30 – 1:00", label: "New Customer Outreach" },
  { time: "1:00 – 2:00", label: "Lunch / Break" },
  { time: "2:00 – 4:30", label: "Customer Issues" },
  { time: "4:30 – 5:30", label: "CRM + Expenses" },
] as const;

export const SHUTDOWN_CHECKLIST = [
  { key: "inboxProcessed", label: "Inbox processed" },
  { key: "trackerUpdated", label: "Customer tracker updated" },
  { key: "prospectsUpdated", label: "Prospect follow-ups updated" },
  { key: "crmUpdated", label: "CRM updated" },
  { key: "tomorrowTop3", label: "Tomorrow's top 3 written" },
  { key: "expensesChecked", label: "Expense reports checked (esp. Friday)" },
] as const;
