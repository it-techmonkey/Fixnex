import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

// Short codes per service, used in booking IDs (FNX-<CODE>-0001).
// Keys are service names, matched ignoring case and punctuation.
const SERVICE_CODES: Record<string, string> = {
  // Home & Property Maintenance
  "AC servicing & repair": "AC",
  "Carpentry & handyman services": "CARPENT",
  "Curtain, blinds & wallpaper installation": "CURTAIN",
  "Gypsum & ceiling works": "GYPSUM",
  "Painting & waterproofing (per room)": "PAINT",
  "Plumbing & electrical repairs": "PLUMB",
  "Waterproofing & sealing / Masonry & tiling": "WPROOF",
  // Appliances & Equipment Maintenance
  "Appliance diagnostics (washer/fridge/oven)": "APPDIAG",
  "Security system & CCTV check": "CCTV",
  "Smart thermostat & IoT device setup": "THERMO",
  "Water heater & pump service": "WHEATER",
  // Cleaning & Hygiene Services
  "3-seater sofa cleaning": "SOFA3",
  "L-shaped sofa cleaning": "SOFAL",
  "Single armchair cleaning": "ARMCHAIR",
  "Dining chair cleaning": "DCHAIR",
  "Carpet cleaning (per m²)": "CARPET",
  "Mattress cleaning (single)": "MATTRESS",
  "Deep cleaning (flat)": "DEEPCLEAN",
  "Kitchen/bathroom deep sanitize": "KBSANITIZE",
  "Pest control": "PEST",
  "Pressure washing for outdoor": "PRESSWASH",
  "Water tank cleaning": "TANK",
  // Outdoor & Landscaping
  "Exterior façade cleaning": "FACADE",
  "Garden care & irrigation maintenance": "GARDEN",
  "Grass cutting, trimming, planting": "GRASS",
  "Outdoor lighting installation": "OUTLIGHT",
  "Pest & outdoor disinfection": "OUTPEST",
  "Pool service (monthly)": "POOL",
  // Corporate & Facility Management
  "AMC for apartments (annual)": "AMC",
  "Elevator & generator maintenance coordination": "ELEVGEN",
  "Energy inspections": "ENERGY",
  "HVAC predictive servicing (per unit/month)": "HVAC",
  "Office maintenance & cleaning": "OFFICE",
  // Smart Technology & AI Integration
  "AI predictive alerts": "AIALERT",
  "App-based booking & monitoring": "APPBOOK",
  "Automated scheduling & chat-less approvals": "AUTOSCHED",
  "IoT sensor installation": "IOT",
  "Remote diagnostics & smart reporting": "REMOTE",
  // Specialty & On-Demand Services
  "Emergency 24/7 call-out": "EMERG",
  "Glass & aluminum works": "GLASS",
  "Renovation & refurbishment projects": "RENOV",
  "Signage & lighting installation": "SIGN",
  "Soundproofing & insulation": "SOUND",
  "Vehicle parking gate automation repair": "GATE",
  // VIP Yacht Maintenance & Management
  "Antifouling (per ft)": "ANTIFOUL",
  "Captain's Care Plan (per ft/month)": "CAPTAIN",
  "Electrical & navigation systems servicing": "YELEC",
  "GRP polish & repair (per ft)": "GRP",
  "Monthly wash/detail (per ft/month)": "YWASH",
  "Scheduled marina check-ups & emergency response": "MARINA",
  "Water systems, pumps & pipe maintenance": "YWATER",
  "Yacht mechanical servicing": "YMECH",
  // Luxury Watch Care
  "Automatic service": "WATCHAUTO",
  "Battery replacement": "WATCHBATT",
  "Full Rolex service": "ROLEXFULL",
  "Polishing (Rolex steel)": "ROLEXPOL",
  "Quartz repair": "WATCHQRTZ",
};

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const SERVICE_CODE_LOOKUP = new Map(
  Object.entries(SERVICE_CODES).map(([name, code]) => [normalizeKey(name), code])
);

const MIXED_CODE = "MIX";
const GENERAL_CODE = "GEN";
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

/** Code for one service. Unknown (e.g. newly added) services fall back to letters from the name. */
export function serviceCode(serviceName?: string | null): string {
  if (!serviceName) return GENERAL_CODE;
  const known = SERVICE_CODE_LOOKUP.get(normalizeKey(serviceName));
  if (known) return known;
  return serviceName.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 8) || GENERAL_CODE;
}

/** Booking ID like FNX-AC-0042. Bookings with more than one distinct service use MIX. */
export async function generateBookingCode(
  tx: Tx,
  serviceNames: Array<string | null | undefined>
): Promise<string> {
  const codes = [...new Set(serviceNames.filter((name): name is string => !!name).map(serviceCode))];
  const code = codes.length > 1 ? MIXED_CODE : codes[0] ?? GENERAL_CODE;
  const number = await nextNumber(tx, "booking");
  return `FNX-${code}-${String(number).padStart(4, "0")}`;
}

/** Customer ID like HARSHALTARWALE001: full name (letters/digits only) + running number. */
export async function generateCustomerCode(tx: Tx, fullName: string): Promise<string> {
  const base =
    fullName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, MAX_NAME_LENGTH) || "USER";
  const number = await nextNumber(tx, `customer:${base}`);
  return `${base}${String(number).padStart(3, "0")}`;
}
