// Realistic fake ocean-freight data for local development and demos.
// buildSeed() returns records with concrete Dates relative to "today" so the
// overdue / due-today highlighting is visible immediately after seeding.

function day(offset: number): Date {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

export function buildSeed() {
  const customers = [
    {
      customer: "ABC Imports",
      mainContact: "Dana Whitfield",
      phone: "(212) 555-0148",
      email: "dana@abcimports.com",
      tradeLane: "Asia – US East Coast",
      annualVolume: "1,200 FEU",
      lastMeeting: day(-14),
      nextMeeting: day(9),
      notes: "Furniture and home goods importer. Sensitive to transit reliability.",
    },
    {
      customer: "Coastal Home Goods",
      mainContact: "Marcus Lee",
      phone: "(704) 555-0193",
      email: "marcus@coastalhome.com",
      tradeLane: "Asia – US East Coast",
      annualVolume: "800 FEU",
      lastMeeting: day(-6),
      nextMeeting: day(4),
      notes: "Requesting additional origin free time this quarter.",
    },
    {
      customer: "Atlantic Retail Group",
      mainContact: "Priya Nair",
      phone: "(617) 555-0177",
      email: "priya@atlanticretail.com",
      tradeLane: "North Europe – US East Coast",
      annualVolume: "2,000 FEU",
      lastMeeting: day(-30),
      nextMeeting: day(15),
      notes: "Largest account. Quarterly business reviews.",
    },
    {
      customer: "Harbor Wellness",
      mainContact: "Sofia Alvarez",
      phone: "(305) 555-0132",
      email: "sofia@harborwellness.com",
      tradeLane: "Asia – US West Coast",
      annualVolume: "450 FEU",
      lastMeeting: day(-3),
      nextMeeting: day(20),
      notes: "Nutraceuticals; temperature-sensitive on some SKUs.",
    },
    {
      customer: "Summit Furniture Co.",
      mainContact: "Greg Thompson",
      phone: "(415) 555-0166",
      email: "greg@summitfurniture.com",
      tradeLane: "Asia – US West Coast",
      annualVolume: "600 FEU",
      lastMeeting: day(-45),
      nextMeeting: day(2),
      notes: "Price-driven. Watching spot rate direction closely.",
    },
  ];

  const customerIssues = [
    {
      dateOpened: day(-5),
      customer: "Coastal Home Goods",
      contact: "Marcus Lee",
      issue: "Requesting additional origin free time",
      priority: "High",
      waitingOn: "Trade",
      nextAction: "Follow up with trade for approval",
      dueDate: day(-1),
      status: "Waiting on Trade",
      notes: "Customer under pressure from their supplier's loading schedule.",
    },
    {
      dateOpened: day(-2),
      customer: "ABC Imports",
      contact: "Dana Whitfield",
      issue: "Two containers rolled at origin",
      priority: "High",
      waitingOn: "Trade",
      nextAction: "Confirm next available sailing and notify customer",
      dueDate: day(0),
      status: "Escalated",
      notes: "",
    },
    {
      dateOpened: day(-9),
      customer: "Atlantic Retail Group",
      contact: "Priya Nair",
      issue: "Invoice discrepancy on detention charges",
      priority: "Medium",
      waitingOn: "Internal",
      nextAction: "Send corrected invoice to AP",
      dueDate: day(3),
      status: "Open",
      notes: "",
    },
    {
      dateOpened: day(-20),
      customer: "Harbor Wellness",
      contact: "Sofia Alvarez",
      issue: "Reefer temperature deviation reported",
      priority: "Low",
      waitingOn: "Customer",
      nextAction: "Awaiting customer's QA sign-off",
      dueDate: day(-3),
      status: "Waiting on Customer",
      notes: "Product cleared QA; closing pending confirmation.",
    },
    {
      dateOpened: day(-40),
      customer: "Summit Furniture Co.",
      contact: "Greg Thompson",
      issue: "Documentation delay on prior shipment",
      priority: "Low",
      waitingOn: "",
      nextAction: "None — resolved",
      dueDate: day(-30),
      status: "Closed",
      notes: "Resolved; docs reissued.",
    },
  ];

  const prospects = [
    {
      company: "Meridian Textiles",
      industry: "Apparel",
      contact: "Alan Cho",
      phone: "(213) 555-0110",
      email: "alan@meridiantextiles.com",
      lastContact: day(-8),
      nextFollowUp: day(0),
      lastTouchpoint: "Intro call — interested in East Coast service",
      status: "Follow Up #1",
      notes: "Currently with a competitor; contract renews in Q4.",
    },
    {
      company: "Northwind Electronics",
      industry: "Consumer Electronics",
      contact: "Rita Gomez",
      phone: "(408) 555-0122",
      email: "rita@northwind.com",
      lastContact: day(-15),
      nextFollowUp: day(-2),
      lastTouchpoint: "Sent capabilities deck",
      status: "Initial Outreach",
      notes: "High volume potential; sensitive to transit time.",
    },
    {
      company: "Cedar & Oak Furnishings",
      industry: "Furniture",
      contact: "Tom Bradley",
      phone: "(503) 555-0187",
      email: "tom@cedaroak.com",
      lastContact: day(-3),
      nextFollowUp: day(5),
      lastTouchpoint: "Requested a quote for Asia–USWC",
      status: "Proposal Sent",
      notes: "",
    },
    {
      company: "Blue Ridge Organics",
      industry: "Food & Beverage",
      contact: "Nina Patel",
      phone: "(828) 555-0155",
      email: "nina@blueridgeorganics.com",
      lastContact: day(-25),
      nextFollowUp: day(1),
      lastTouchpoint: "Met at industry expo",
      status: "Researching",
      notes: "Reefer needs; evaluating carriers.",
    },
  ];

  const marketIntelligence = [
    {
      dateAnnounced: day(-4),
      trade: "Asia – US East Coast",
      surchargeType: "GRI",
      amount: "$1,000/FEU",
      effectiveDate: day(24),
      expirationDate: null,
      customersImpacted: "ABC Imports, Coastal Home Goods",
      actionRequired: "Notify impacted accounts before effective date",
      status: "Customer Notification Needed",
      namedAccountImpact:
        "ABC Imports and Coastal Home Goods both ship weekly on this lane.",
      talkingPoints:
        "Lock in space early; discuss quarterly agreement to smooth rate volatility.",
      notes: "",
    },
    {
      dateAnnounced: day(-2),
      trade: "Asia – US West Coast",
      surchargeType: "PSS",
      amount: "$600/FEU",
      effectiveDate: day(12),
      expirationDate: day(60),
      customersImpacted: "Harbor Wellness, Summit Furniture Co.",
      actionRequired: "Review exposure and advise",
      status: "Need Review",
      namedAccountImpact: "Summit is price-driven — expect pushback.",
      talkingPoints: "Peak season capacity; recommend booking 3 weeks out.",
      notes: "",
    },
    {
      dateAnnounced: day(-30),
      trade: "North Europe – US East Coast",
      surchargeType: "Congestion Surcharge",
      amount: "$350/FEU",
      effectiveDate: day(-10),
      expirationDate: day(-1),
      customersImpacted: "Atlantic Retail Group",
      actionRequired: "None — expired",
      status: "Expired",
      namedAccountImpact: "",
      talkingPoints: "",
      notes: "Congestion eased at destination port.",
    },
  ];

  const opportunities = [
    {
      customer: "ABC Imports",
      trade: "Asia – US East Coast",
      opportunity: "Propose a fixed quarterly rate agreement",
      trigger: "Customer exposed to upcoming GRI.",
      action: "Draft agreement and schedule review",
      dueDate: day(6),
      status: "In Progress",
      notes: "",
    },
    {
      customer: "Summit Furniture Co.",
      trade: "Asia – US West Coast",
      opportunity: "Offer early-booking program ahead of PSS",
      trigger: "PSS effective in two weeks.",
      action: "Call Greg with peak-season plan",
      dueDate: day(2),
      status: "Open",
      notes: "",
    },
    {
      customer: "Atlantic Retail Group",
      trade: "North Europe – US East Coast",
      opportunity: "Expand share on second trade lane",
      trigger: "Positive QBR feedback.",
      action: "Present lane comparison",
      dueDate: day(18),
      status: "Customer Contacted",
      notes: "",
    },
  ];

  const meetings = [
    {
      date: day(-6),
      customer: "Coastal Home Goods",
      contact: "Marcus Lee",
      meetingType: "Call",
      discussion: "Reviewed free-time request and next steps",
      followUpNeeded: true,
      followUpDueDate: day(0),
      crmUpdated: false,
      notes: "Needs CRM update.",
    },
    {
      date: day(-3),
      customer: "Harbor Wellness",
      contact: "Sofia Alvarez",
      meetingType: "Teams",
      discussion: "Quarterly check-in; reefer performance",
      followUpNeeded: false,
      followUpDueDate: null,
      crmUpdated: true,
      notes: "",
    },
    {
      date: day(-14),
      customer: "ABC Imports",
      contact: "Dana Whitfield",
      meetingType: "In Person",
      discussion: "Annual review and volume forecast",
      followUpNeeded: true,
      followUpDueDate: day(-2),
      crmUpdated: false,
      notes: "Follow-up overdue.",
    },
  ];

  const weeklyPriorities = [
    {
      task: "Notify GRI-impacted accounts (ABC, Coastal)",
      category: "Customer",
      dueDate: day(1),
      status: "In Progress",
      notes: "",
    },
    {
      task: "Send Cedar & Oak proposal follow-up",
      category: "Prospecting",
      dueDate: day(0),
      status: "Not Started",
      notes: "",
    },
    {
      task: "Update CRM after this week's meetings",
      category: "CRM",
      dueDate: day(2),
      status: "Waiting",
      notes: "",
    },
    {
      task: "Submit weekly expense report",
      category: "Expenses",
      dueDate: day(-1),
      status: "Not Started",
      notes: "Friday deadline.",
    },
  ];

  const dailyPlan = {
    date: (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    top1: "Notify GRI-impacted accounts",
    top2: "Resolve ABC rolled containers",
    top3: "Send Cedar & Oak proposal follow-up",
    mustDo: "Call Marcus at Coastal re: free time.\nConfirm next sailing for ABC.",
    shouldDo: "Prep for Summit early-booking call.",
    wouldBeNice: "Tidy prospect pipeline stages.",
    notes: "Peak season pressure building on West Coast.",
    inboxProcessed: false,
    trackerUpdated: false,
    prospectsUpdated: false,
    crmUpdated: false,
    tomorrowTop3: false,
    expensesChecked: false,
    scorecard: {
      outreach: { goal: 5, actual: 2 },
      followUps: { goal: 5, actual: 3 },
      meetings: { goal: 2, actual: 1 },
      quotes: { goal: 3, actual: 1 },
      issues: { goal: 0, actual: 3 },
      crm: { goal: 1, actual: 0 },
    },
  };

  const rateSnapshots = [
    // Asia–USEC: trending up
    { tradeLane: "Asia – US East Coast", amount: 3050, date: day(-21), notes: "" },
    { tradeLane: "Asia – US East Coast", amount: 3120, date: day(-14), notes: "" },
    { tradeLane: "Asia – US East Coast", amount: 3240, date: day(-7), notes: "GRI held." },
    // Asia–USWC: trending down
    { tradeLane: "Asia – US West Coast", amount: 2100, date: day(-21), notes: "" },
    { tradeLane: "Asia – US West Coast", amount: 2060, date: day(-14), notes: "" },
    { tradeLane: "Asia – US West Coast", amount: 2010, date: day(-7), notes: "" },
    // N.Europe–USEC: flat
    { tradeLane: "North Europe – US East Coast", amount: 1875, date: day(-21), notes: "" },
    { tradeLane: "North Europe – US East Coast", amount: 1880, date: day(-14), notes: "" },
    { tradeLane: "North Europe – US East Coast", amount: 1880, date: day(-7), notes: "" },
  ];

  const marketInsights = [
    {
      date: day(-1),
      title: "Blank sailings tightening capacity on Asia–USWC ahead of peak.",
      tradeLane: "Asia – US West Coast",
      category: "Capacity",
      sentiment: "Up",
      sourceUrl: "",
      notes: "Three announced over the next month — expect rate firming.",
    },
    {
      date: day(-3),
      title: "LA/Long Beach dwell times steady at ~4 days.",
      tradeLane: "Asia – US West Coast",
      category: "Ports",
      sentiment: "Steady",
      sourceUrl: "",
      notes: "No congestion pressure right now.",
    },
    {
      date: day(-5),
      title: "GRI holding on Asia–USEC; spot up ~4% week-over-week.",
      tradeLane: "Asia – US East Coast",
      category: "Rates",
      sentiment: "Up",
      sourceUrl: "",
      notes: "Good moment to pitch quarterly agreements.",
    },
    {
      date: day(-8),
      title: "BAF expected to ease next month as bunker prices soften.",
      tradeLane: "",
      category: "Fuel / BAF",
      sentiment: "Down",
      sourceUrl: "",
      notes: "",
    },
  ];

  const marketTheme = {
    month: new Date().toISOString().slice(0, 7),
    blankSailings: "3 announced on Asia–USWC over the next month.",
    capacity: "Tightening ahead of peak season.",
    spotRateDirection: "Upward on both Asia lanes.",
    equipmentSituation: "Balanced at origin; watch USWC empties.",
    keyCustomerRisks: "Summit price-sensitivity; ABC reliability expectations.",
    talkingPoints: "Book early, consider quarterly agreements, secure equipment.",
  };

  return {
    customers,
    customerIssues,
    prospects,
    marketIntelligence,
    opportunities,
    meetings,
    weeklyPriorities,
    dailyPlan,
    marketTheme,
    rateSnapshots,
    marketInsights,
  };
}
