import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

// Short codes per service, used in order IDs (FNX-<CODE>-1001).
// Keys are service names, matched ignoring case and punctuation.
const SERVICE_CODES: Record<string, string> = {
  // Home & Property Maintenance
  "AC servicing & repair": "AC",
  "Carpentry & handyman services": "CARP",
  "Curtain, blinds & wallpaper installation": "CURTAIN",
  "Gypsum & ceiling works": "GYPSUM",
  "Painting & waterproofing (per room)": "PAINT",
  "Plumbing & electrical repairs": "PLUMB",
  "Waterproofing & sealing / Masonry & tiling": "MASON",
  // Appliances & Equipment Maintenance
  "Appliance diagnostics (washer/fridge/oven)": "APPL",
  "Security system & CCTV check": "CCTV",
  "Smart thermostat & IoT device setup": "THERMO",
  "Water heater & pump service": "HEATER",
  // Cleaning & Hygiene Services
  "3-seater sofa cleaning": "SOFA3",
  "L-shaped sofa cleaning": "SOFAL",
  "Single armchair cleaning": "CHAIR",
  "Dining chair cleaning": "DCHAIR",
  "Carpet cleaning (per m²)": "CARPET",
  "Mattress cleaning (single)": "MATT",
  "Deep cleaning (flat)": "CLEAN",
  "Kitchen/bathroom deep sanitize": "SANIT",
  "Pest control": "PEST",
  "Pressure washing for outdoor": "WASH",
  "Water tank cleaning": "TANK",
  // Outdoor & Landscaping
  "Exterior façade cleaning": "FACADE",
  "Garden care & irrigation maintenance": "GARDEN",
  "Grass cutting, trimming, planting": "GRASS",
  "Outdoor lighting installation": "LIGHT",
  "Pest & outdoor disinfection": "DISINF",
  "Pool service (monthly)": "POOL",
  // Corporate & Facility Management
  "AMC for apartments (annual)": "AMC",
  "Elevator & generator maintenance coordination": "LIFT",
  "Energy inspections": "ENERGY",
  "HVAC predictive servicing (per unit/month)": "HVAC",
  "Office maintenance & cleaning": "OFFICE",
  // Smart Technology & AI Integration
  "AI predictive alerts": "AI",
  "App-based booking & monitoring": "APP",
  "Automated scheduling & chat-less approvals": "AUTO",
  "IoT sensor installation": "IOT",
  "Remote diagnostics & smart reporting": "REMOTE",
  // Specialty & On-Demand Services
  "Emergency 24/7 call-out": "SOS",
  "Glass & aluminum works": "GLASS",
  "Renovation & refurbishment projects": "RENOV",
  "Signage & lighting installation": "SIGN",
  "Soundproofing & insulation": "SOUND",
  "Vehicle parking gate automation repair": "GATE",
  // VIP Yacht Maintenance & Management
  "Antifouling (per ft)": "FOUL",
  "Captain's Care Plan (per ft/month)": "CAPTAIN",
  "Electrical & navigation systems servicing": "YELEC",
  "GRP polish & repair (per ft)": "GRP",
  "Monthly wash/detail (per ft/month)": "YWASH",
  "Scheduled marina check-ups & emergency response": "MARINA",
  "Water systems, pumps & pipe maintenance": "YWATER",
  "Yacht mechanical servicing": "YMECH",
  // Luxury Watch Care
  "Automatic service": "WAUTO",
  "Battery replacement": "WBATT",
  "Full Rolex service": "ROLEX",
  "Polishing (Rolex steel)": "RPOL",
  "Quartz repair": "WQUARTZ",
};

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const SERVICE_CODE_LOOKUP = new Map(
  Object.entries(SERVICE_CODES).map(([name, code]) => [normalizeKey(name), code])
);

const MIXED_CODE = "MIX";
const GENERAL_CODE = "GEN";
const PAYMENT_LINK_CODE = "PAY";
// Order numbers start at 1001 so every ID has at least four digits.
const ORDER_NUMBER_OFFSET = 1000;
const MAX_NAME_LENGTH = 20;

/** Atomically increments and returns the next number for a counter key. */
async function nextNumber(tx: Tx, key: string): Promise<number> {
  const counter = await tx.idCounter.upsert({
    where: { key },
    create: { key, value: 1 },
    update: { value: { increment: 1 } },
  });
  return counter.value;
}

/** Order ID like FNX-AC-1001. All orders share one running number. */
async function generateOrderCode(tx: Tx, code: string): Promise<string> {
  const number = await nextNumber(tx, "booking");
  return `FNX-${code}-${ORDER_NUMBER_OFFSET + number}`;
}

/** Code for one service. Unknown (e.g. newly added) services use GEN. */
export function serviceCode(serviceName?: string | null): string {
  if (!serviceName) return GENERAL_CODE;
  return SERVICE_CODE_LOOKUP.get(normalizeKey(serviceName)) ?? GENERAL_CODE;
}

/** Booking ID like FNX-AC-1001. Bookings with more than one distinct service use MIX. */
export async function generateBookingCode(
  tx: Tx,
  serviceNames: Array<string | null | undefined>
): Promise<string> {
  const codes = [...new Set(serviceNames.filter((name): name is string => !!name).map(serviceCode))];
  const code = codes.length > 1 ? MIXED_CODE : codes[0] ?? GENERAL_CODE;
  return generateOrderCode(tx, code);
}

/** Order ID for a paid custom payment link, like FNX-PAY-1001. */
export async function generatePaymentLinkCode(tx: Tx): Promise<string> {
  return generateOrderCode(tx, PAYMENT_LINK_CODE);
}

/** Order ID for a plan purchase or renewal: FNX-LITE-1001, FNX-PRO-1001, FNX-MAX-1001. */
export async function generatePlanCode(tx: Tx, plan: "FIXLITE" | "FIXPRO" | "FIXMAX"): Promise<string> {
  const codes = { FIXLITE: "LITE", FIXPRO: "PRO", FIXMAX: "MAX" } as const;
  return generateOrderCode(tx, codes[plan]);
}

/** Order ID for a plan upgrade payment, like FNX-UPG-1001. */
export async function generateUpgradeCode(tx: Tx): Promise<string> {
  return generateOrderCode(tx, "UPG");
}

/** Booking ID for a plan preventive check, like FNX-CHECK-1001. */
export async function generatePreventiveCheckCode(tx: Tx): Promise<string> {
  return generateOrderCode(tx, "CHECK");
}

/** Customer ID like HARSHALTARWALE001: full name (letters/digits only) + running number. */
export async function generateCustomerCode(tx: Tx, fullName: string): Promise<string> {
  const base =
    fullName
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, MAX_NAME_LENGTH) || "USER";
  const number = await nextNumber(tx, `customer:${base}`);
  return `${base}${String(number).padStart(3, "0")}`;
}
