import {
  PRIORITY_OPTIONS,
  ISSUE_STATUS_OPTIONS,
  PROSPECT_STATUS_OPTIONS,
  SURCHARGE_TYPE_OPTIONS,
  MARKET_STATUS_OPTIONS,
  OPPORTUNITY_STATUS_OPTIONS,
  MEETING_TYPE_OPTIONS,
  WEEKLY_CATEGORY_OPTIONS,
  WEEKLY_STATUS_OPTIONS,
  INSIGHT_CATEGORY_OPTIONS,
  SENTIMENT_OPTIONS,
} from "./constants";

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "date"
  | "email"
  | "boolean";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  full?: boolean; // span both columns in the 2-col form grid
}

export type ColumnType =
  | "text"
  | "truncate"
  | "date"
  | "priority"
  | "status"
  | "yesno";

export type StatusKind =
  | "issue"
  | "prospect"
  | "market"
  | "opportunity"
  | "weekly";

export interface ColumnDef {
  key: string;
  label: string;
  type?: ColumnType;
  statusKind?: StatusKind;
}

// Prisma delegate names (camelCase model names).
export type PrismaModel =
  | "customerIssue"
  | "prospect"
  | "customer"
  | "marketIntelligence"
  | "opportunity"
  | "meetingLog"
  | "weeklyPriority"
  | "marketInsight";

export interface ResourceDef {
  key: string; // route segment + identifier
  model: PrismaModel;
  title: string;
  singular: string;
  description: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  searchKeys: string[];
  filterField?: { key: string; label: string; options: readonly string[] };
  priorityFilter?: boolean;
  defaultOrderBy: Record<string, "asc" | "desc">;
}

export const RESOURCES: Record<string, ResourceDef> = {
  "customer-issues": {
    key: "customer-issues",
    model: "customerIssue",
    title: "Customer Issues",
    singular: "Issue",
    description: "Track service problems from open to close.",
    searchKeys: ["customer", "contact", "issue"],
    priorityFilter: true,
    filterField: { key: "status", label: "Status", options: ISSUE_STATUS_OPTIONS },
    defaultOrderBy: { dueDate: "asc" },
    fields: [
      { name: "dateOpened", label: "Date Opened", type: "date" },
      { name: "customer", label: "Customer", type: "text", required: true },
      { name: "contact", label: "Contact", type: "text" },
      { name: "priority", label: "Priority", type: "select", options: PRIORITY_OPTIONS },
      { name: "status", label: "Status", type: "select", options: ISSUE_STATUS_OPTIONS },
      { name: "dueDate", label: "Due Date", type: "date" },
      { name: "issue", label: "Issue", type: "textarea", required: true, full: true },
      { name: "waitingOn", label: "Waiting On", type: "text" },
      { name: "nextAction", label: "Next Action", type: "text" },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
    columns: [
      { key: "dateOpened", label: "Opened", type: "date" },
      { key: "customer", label: "Customer" },
      { key: "contact", label: "Contact" },
      { key: "issue", label: "Issue", type: "truncate" },
      { key: "priority", label: "Priority", type: "priority" },
      { key: "waitingOn", label: "Waiting On" },
      { key: "nextAction", label: "Next Action", type: "truncate" },
      { key: "dueDate", label: "Due", type: "date" },
      { key: "status", label: "Status", type: "status", statusKind: "issue" },
    ],
  },

  prospects: {
    key: "prospects",
    model: "prospect",
    title: "Prospect Pipeline",
    singular: "Prospect",
    description: "Move companies from research to active customer.",
    searchKeys: ["company", "contact", "industry", "email"],
    filterField: { key: "status", label: "Status", options: PROSPECT_STATUS_OPTIONS },
    defaultOrderBy: { nextFollowUp: "asc" },
    fields: [
      { name: "company", label: "Company", type: "text", required: true },
      { name: "industry", label: "Industry", type: "text" },
      { name: "contact", label: "Contact", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "status", label: "Status", type: "select", options: PROSPECT_STATUS_OPTIONS },
      { name: "lastContact", label: "Last Contact", type: "date" },
      { name: "nextFollowUp", label: "Next Follow Up", type: "date" },
      { name: "lastTouchpoint", label: "Last Touchpoint", type: "text", full: true },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
    columns: [
      { key: "company", label: "Company" },
      { key: "industry", label: "Industry" },
      { key: "contact", label: "Contact" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "lastContact", label: "Last Contact", type: "date" },
      { key: "nextFollowUp", label: "Next Follow Up", type: "date" },
      { key: "status", label: "Status", type: "status", statusKind: "prospect" },
    ],
  },

  customers: {
    key: "customers",
    model: "customer",
    title: "Customer Master List",
    singular: "Customer",
    description: "Your book of business and its key details.",
    searchKeys: ["customer", "mainContact", "tradeLane"],
    defaultOrderBy: { customer: "asc" },
    fields: [
      { name: "customer", label: "Customer", type: "text", required: true },
      { name: "mainContact", label: "Main Contact", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "tradeLane", label: "Trade Lane", type: "text" },
      { name: "annualVolume", label: "Annual Volume", type: "text", placeholder: "e.g. 400 FEU" },
      { name: "lastMeeting", label: "Last Meeting", type: "date" },
      { name: "nextMeeting", label: "Next Meeting", type: "date" },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
    columns: [
      { key: "customer", label: "Customer" },
      { key: "mainContact", label: "Main Contact" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "tradeLane", label: "Trade Lane" },
      { key: "annualVolume", label: "Annual Volume" },
      { key: "lastMeeting", label: "Last Meeting", type: "date" },
      { key: "nextMeeting", label: "Next Meeting", type: "date" },
    ],
  },

  "market-intelligence": {
    key: "market-intelligence",
    model: "marketIntelligence",
    title: "Market Intelligence",
    singular: "Announcement",
    description: "GRI, PSS, surcharges and service changes by trade.",
    searchKeys: ["trade", "surchargeType", "customersImpacted", "namedAccountImpact"],
    filterField: { key: "status", label: "Status", options: MARKET_STATUS_OPTIONS },
    defaultOrderBy: { effectiveDate: "asc" },
    fields: [
      { name: "dateAnnounced", label: "Date Announced", type: "date" },
      { name: "trade", label: "Trade", type: "text", required: true, placeholder: "Asia–US East Coast" },
      { name: "surchargeType", label: "Surcharge Type", type: "select", options: SURCHARGE_TYPE_OPTIONS },
      { name: "amount", label: "Amount", type: "text", placeholder: "$1,000/FEU" },
      { name: "effectiveDate", label: "Effective Date", type: "date" },
      { name: "expirationDate", label: "Expiration Date", type: "date" },
      { name: "status", label: "Status", type: "select", options: MARKET_STATUS_OPTIONS },
      { name: "actionRequired", label: "Action Required", type: "text" },
      { name: "customersImpacted", label: "Customers Impacted", type: "textarea", full: true, placeholder: "Comma-separated customer names" },
      { name: "namedAccountImpact", label: "Named Account Impact", type: "textarea", full: true },
      { name: "talkingPoints", label: "Talking Points", type: "textarea", full: true },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
    columns: [
      { key: "dateAnnounced", label: "Announced", type: "date" },
      { key: "trade", label: "Trade" },
      { key: "surchargeType", label: "Type" },
      { key: "amount", label: "Amount" },
      { key: "effectiveDate", label: "Effective", type: "date" },
      { key: "customersImpacted", label: "Customers Impacted", type: "truncate" },
      { key: "status", label: "Status", type: "status", statusKind: "market" },
    ],
  },

  opportunities: {
    key: "opportunities",
    model: "opportunity",
    title: "Opportunity Tracker",
    singular: "Opportunity",
    description: "Turn market changes into proactive sales moves.",
    searchKeys: ["customer", "opportunity", "trade", "trigger"],
    filterField: { key: "status", label: "Status", options: OPPORTUNITY_STATUS_OPTIONS },
    defaultOrderBy: { dueDate: "asc" },
    fields: [
      { name: "customer", label: "Customer", type: "text", required: true },
      { name: "trade", label: "Trade", type: "text" },
      { name: "status", label: "Status", type: "select", options: OPPORTUNITY_STATUS_OPTIONS },
      { name: "dueDate", label: "Due Date", type: "date" },
      { name: "opportunity", label: "Opportunity", type: "textarea", required: true, full: true },
      { name: "trigger", label: "Trigger", type: "textarea", full: true, placeholder: "e.g. Customer exposed to upcoming GRI." },
      { name: "action", label: "Action", type: "textarea", full: true },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
    columns: [
      { key: "customer", label: "Customer" },
      { key: "trade", label: "Trade" },
      { key: "opportunity", label: "Opportunity", type: "truncate" },
      { key: "trigger", label: "Trigger", type: "truncate" },
      { key: "dueDate", label: "Due", type: "date" },
      { key: "status", label: "Status", type: "status", statusKind: "opportunity" },
    ],
  },

  meetings: {
    key: "meetings",
    model: "meetingLog",
    title: "Meeting & Visit Log",
    singular: "Meeting",
    description: "Every touchpoint, and whether the CRM caught up.",
    searchKeys: ["customer", "contact", "discussion"],
    filterField: { key: "meetingType", label: "Type", options: MEETING_TYPE_OPTIONS },
    defaultOrderBy: { date: "desc" },
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "customer", label: "Customer", type: "text", required: true },
      { name: "contact", label: "Contact", type: "text" },
      { name: "meetingType", label: "Meeting Type", type: "select", options: MEETING_TYPE_OPTIONS },
      { name: "followUpNeeded", label: "Follow Up Needed", type: "boolean" },
      { name: "followUpDueDate", label: "Follow Up Due Date", type: "date" },
      { name: "crmUpdated", label: "CRM Updated", type: "boolean" },
      { name: "discussion", label: "Discussion", type: "textarea", full: true },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
    columns: [
      { key: "date", label: "Date", type: "date" },
      { key: "customer", label: "Customer" },
      { key: "contact", label: "Contact" },
      { key: "meetingType", label: "Type" },
      { key: "discussion", label: "Discussion", type: "truncate" },
      { key: "followUpNeeded", label: "Follow Up", type: "yesno" },
      { key: "crmUpdated", label: "CRM Updated", type: "yesno" },
    ],
  },

  "market-insights": {
    key: "market-insights",
    model: "marketInsight",
    title: "Shipping Market Insights",
    singular: "Insight",
    description: "What you're hearing across the market.",
    searchKeys: ["title", "tradeLane", "category", "notes"],
    filterField: { key: "category", label: "Category", options: INSIGHT_CATEGORY_OPTIONS },
    defaultOrderBy: { date: "desc" },
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "category", label: "Category", type: "select", options: INSIGHT_CATEGORY_OPTIONS },
      { name: "sentiment", label: "Direction", type: "select", options: SENTIMENT_OPTIONS },
      { name: "tradeLane", label: "Trade Lane", type: "text" },
      { name: "title", label: "Insight", type: "textarea", required: true, full: true },
      { name: "sourceUrl", label: "Source URL", type: "text", full: true, placeholder: "https://…" },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
    columns: [
      { key: "date", label: "Date", type: "date" },
      { key: "category", label: "Category" },
      { key: "tradeLane", label: "Trade Lane" },
      { key: "title", label: "Insight", type: "truncate" },
    ],
  },

  "weekly-priorities": {
    key: "weekly-priorities",
    model: "weeklyPriority",
    title: "Weekly Priorities",
    singular: "Priority",
    description: "The handful of things that must move this week.",
    searchKeys: ["task", "category"],
    filterField: { key: "status", label: "Status", options: WEEKLY_STATUS_OPTIONS },
    defaultOrderBy: { dueDate: "asc" },
    fields: [
      { name: "task", label: "Task", type: "text", required: true, full: true },
      { name: "category", label: "Category", type: "select", options: WEEKLY_CATEGORY_OPTIONS },
      { name: "status", label: "Status", type: "select", options: WEEKLY_STATUS_OPTIONS },
      { name: "dueDate", label: "Due Date", type: "date" },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
    columns: [
      { key: "task", label: "Task" },
      { key: "category", label: "Category" },
      { key: "dueDate", label: "Due", type: "date" },
      { key: "status", label: "Status", type: "status", statusKind: "weekly" },
    ],
  },
};

export function getResource(key: string): ResourceDef {
  const r = RESOURCES[key];
  if (!r) throw new Error(`Unknown resource: ${key}`);
  return r;
}
