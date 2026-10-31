// Plan rules shared by the server and the website. No database access here.
import pricingData from "@/app/db/pricing.json";
import { serviceCode } from "@/lib/readableIds";

export type PlanTierName = "FIXLITE" | "FIXPRO" | "FIXMAX";
export type PlanId = "fixlite" | "fixpro" | "fixmax";
export type PropertyTypeId = "apartment" | "family" | "villa";
export type Coverage = "INCLUDED" | "MEMBER" | "NORMAL";

export const PLAN_ID_TO_TIER: Record<PlanId, PlanTierName> = {
  fixlite: "FIXLITE",
  fixpro: "FIXPRO",
  fixmax: "FIXMAX",
};

export const PLAN_NAMES: Record<PlanTierName, string> = {
  FIXLITE: "FixLite",
  FIXPRO: "FixPro",
  FIXMAX: "FixMax",
};

/** Short code used in plan order IDs, e.g. FNX-PRO-1010. */
export const PLAN_CODES: Record<PlanTierName, string> = {
  FIXLITE: "LITE",
  FIXPRO: "PRO",
  FIXMAX: "MAX",
};

// Property repairs: included in every plan (FixLite: limited visits per month).
const REPAIR_CODES = ["AC", "PLUMB", "CARP", "GYPSUM", "CURTAIN", "APPL", "HEATER", "CCTV", "THERMO"];
// Emergency 24/7 call-out: included + priority for FixPro and FixMax.
const EMERGENCY_CODES = ["SOS"];
// Pool, garden, grass and smart home: included for FixMax only.
const FIXMAX_EXTRA_CODES = ["POOL", "GARDEN", "GRASS", "IOT"];

type PlanRule = {
  /** Included visits per month; null = unlimited. */
  visitsPerMonth: number | null;
  included: Set<string>;
  priority: Set<string>;
  preventiveCheck: boolean;
};

export const PLAN_RULES: Record<PlanTierName, PlanRule> = {
  FIXLITE: {
    visitsPerMonth: 2,
    included: new Set(REPAIR_CODES),
    priority: new Set(),
    preventiveCheck: false,
  },
  FIXPRO: {
    visitsPerMonth: null,
    included: new Set([...REPAIR_CODES, ...EMERGENCY_CODES]),
    priority: new Set(EMERGENCY_CODES),
    preventiveCheck: true,
  },
  FIXMAX: {
    visitsPerMonth: null,
    included: new Set([...REPAIR_CODES, ...EMERGENCY_CODES, ...FIXMAX_EXTRA_CODES]),
    priority: new Set(EMERGENCY_CODES),
    preventiveCheck: true,
  },
};

/** Pay for next month from this many days before the current month ends. */
export const RENEW_WINDOW_DAYS = 5;
/** One preventive check per this many days (FixPro / FixMax). */
export const PREVENTIVE_CHECK_INTERVAL_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

export const isServiceIncluded = (plan: PlanTierName, serviceName?: string | null) =>
  PLAN_RULES[plan].included.has(serviceCode(serviceName));

export const isPriorityService = (plan: PlanTierName, serviceName?: string | null) =>
  PLAN_RULES[plan].priority.has(serviceCode(serviceName));

export const PROPERTY_TYPES = pricingData.propertyTypes as Array<{
  id: PropertyTypeId;
  label: string;
  startingPrice: number;
}>;

export const isPropertyType = (value: unknown): value is PropertyTypeId =>
  PROPERTY_TYPES.some((t) => t.id === value);

export const propertyLabel = (id?: string | null) =>
  PROPERTY_TYPES.find((t) => t.id === id)?.label ?? id ?? "-";

type CatalogPlan = {
  id: PlanId;
  plan: string;
  type: "subscription" | "enquiry";
  features: string[];
  excluded?: string[];
  prices: Record<PropertyTypeId, number | null>;
};

export const PLAN_CATALOG = pricingData.plans as CatalogPlan[];

export const catalogPlan = (tier: PlanTierName) =>
  PLAN_CATALOG.find((p) => PLAN_ID_TO_TIER[p.id] === tier);

/** Listed monthly price, or null when the plan is quote-based (FixMax). */
export function listedMonthlyPrice(tier: PlanTierName, propertyType: PropertyTypeId): number | null {
  const price = catalogPlan(tier)?.prices?.[propertyType];
  return typeof price === "number" && price > 0 ? price : null;
}

/** Same day next month; clamps to the month's last day (31 Jan -> 28/29 Feb). */
export function addOneMonth(date: Date): Date {
  const result = new Date(date.getTime());
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + 1);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);

/** Prices are always rounded to fils (2 decimals). */
export const toMoney = (value: number) => Math.round(value * 100) / 100;

export const parsePrice = (value: unknown): number | null => {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/** Dates are shown in Dubai time everywhere. */
export const formatPlanDate = (value: Date | string | null | undefined) => {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dubai",
  }).format(date);
};

export const formatAed = (value: number | string | null | undefined) => {
  const n = parsePrice(value);
  return n === null ? String(value ?? "-") : `AED ${n.toFixed(2)}`;
};

/** Visit time slots (same as the service booking page). */
export const TIME_SLOTS = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

/** Today's date in Dubai as YYYY-MM-DD. */
export const dubaiToday = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(now);

// Dubai areas offered when choosing where a service or plan property is.
export const DUBAI_AREAS = [
  "Al Barsha", "Al Furjan", "Al Jaddaf", "Al Karama", "Al Khawaneej", "Al Mamzar", "Al Mankhool",
  "Al Mizhar", "Al Muhaisnah", "Al Nahda", "Al Qouz", "Al Quoz Industrial", "Al Qusais",
  "Al Rashidiya", "Al Rigga", "Al Safa", "Al Satwa", "Al Sufouh", "Al Wasl", "Al Warqa",
  "Arabian Ranches", "Arabian Ranches 2", "Arabian Ranches 3", "Barsha Heights (TECOM)",
  "Business Bay", "City Walk", "Culture Village", "Damac Hills", "Damac Hills 2", "Deira",
  "Discovery Gardens", "Downtown Dubai", "Dubai Creek Harbour", "Dubai Festival City",
  "Dubai Healthcare City", "Dubai Hills Estate", "Dubai Internet City", "Dubai Investment Park",
  "Dubai Marina", "Dubai Media City", "Dubai Production City", "Dubai Silicon Oasis", "Dubai South",
  "Dubai Sports City", "Dubai Studio City", "Dubailand", "Emirates Hills", "Emirates Living",
  "Green Community", "Greens", "International City", "Jebel Ali", "Jumeirah",
  "Jumeirah Beach Residence (JBR)", "Jumeirah Golf Estates", "Jumeirah Islands",
  "Jumeirah Lake Towers (JLT)", "Jumeirah Park", "Jumeirah Village Circle (JVC)",
  "Jumeirah Village Triangle (JVT)", "Mirdif", "Motor City", "Mudon", "Palm Jumeirah", "Reem",
  "Remraam", "Springs", "The Gardens", "The Greens", "The Lakes", "The Meadows",
  "The Sustainable City", "The Views", "Town Square", "Trade Centre", "Umm Suqeim",
  "Victory Heights", "Waterfront",
];

/** Short list of what a plan includes, shown on the confirm page and My Plan. */
export function planBenefitSummary(tier: PlanTierName): string[] {
  const rule = PLAN_RULES[tier];
  const lines = [
    rule.visitsPerMonth === null
      ? "Unlimited included repair visits on your plan property"
      : `${rule.visitsPerMonth} included repair visits a month on your plan property`,
    "Included repairs: AC, plumbing & electrical, carpentry & handyman, gypsum & ceiling, curtains & blinds, appliances, water heater & pump, CCTV, thermostat",
  ];
  if (tier === "FIXLITE") lines.push("Emergency call-outs at member price");
  else lines.push("Emergency 24/7 call-outs included, with priority");
  if (tier === "FIXMAX") lines.push("Pool, garden, grass and smart home services included");
  if (rule.preventiveCheck) lines.push("One preventive check every 3 months");
  lines.push("Member price on every other service and on other properties");
  lines.push("Labour included, parts charged at cost");
  return lines;
}
