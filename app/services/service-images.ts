import { slugify } from "@/app/utils/slugify";

export type ServiceImageMeta = {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
};

const serviceImages: Record<string, ServiceImageMeta> = {
  "ac-servicing-and-repair": {
    src: "/services/ac.webp",
    alt: "Technician servicing an indoor air conditioning unit",
    credit: "Local",
    creditUrl: "#",
  },
  "plumbing-and-electrical-repairs": {
    src: "/services/Plumbing-electrical-repairs.webp",
    alt: "Plumber working on indoor piping under a sink",
    credit: "Local",
    creditUrl: "#",
  },
  "painting-and-waterproofing-per-room": {
    src: "/services/Painting-waterproofing.webp",
    alt: "Painter rolling fresh paint on an interior wall",
    credit: "Local",
    creditUrl: "#",
  },
  "carpentry-and-handyman-services": {
    src: "/services/Carpentry-handyman-services.webp",
    alt: "Carpenter measuring timber on a workbench",
    credit: "Local",
    creditUrl: "#",
  },
  "gypsum-and-ceiling-works": {
    src: "/services/Gypsum-ceiling-works.webp",
    alt: "Construction workers installing ceiling panels",
    credit: "Local",
    creditUrl: "#",
  },
  "curtain-blinds-and-wallpaper-installation": {
    src: "/services/Curtain-blinds-wallpaper.webp",
    alt: "Living room with sunlit curtains and cozy decor",
    credit: "Local",
    creditUrl: "#",
  },
  "waterproofing-and-sealing-masonry-and-tiling": {
    src: "/services/Waterproofing-sealing-Masonry.webp",
    alt: "Tile installer applying grout on floor tiles",
    credit: "Local",
    creditUrl: "#",
  },
  "appliance-diagnostics-washer-fridge-oven": {
    src: "/services/appliance-diagnostics.webp",
    alt: "Technician inspecting a modern washing machine",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1581579186989-2ab05aa3d51d",
  },
  "water-heater-and-pump-service": {
    src: "/services/water_heater.webp",
    alt: "Engineer adjusting valves in a boiler room",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1517244683847-7456b63c5969",
  },
  "smart-thermostat-and-iot-device-setup": {
    src: "/services/iot-setup.webp",
    alt: "Smart home thermostat displaying temperature",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1496180470118-1d51c0d0ed9b",
  },
  "security-system-and-cctv-check": {
    src: "/services/Security-system-CCTV-check.webp",
    alt: "Modern CCTV security camera on building exterior",
    credit: "Local",
    creditUrl: "#",
  },
  "dining-chair-cleaning": {
    src: "/services/chair-cleaning.webp",
    alt: "Cleaner wiping down a dining chair with cloth",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1578575437130-527eed3abbec",
  },
  "single-armchair-cleaning": {
    src: "/services/single-armchair.webp",
    alt: "Professional cleaning service vacuuming an armchair",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1581579186989-2ab05aa3d51d",
  },
  "3-seater-sofa-cleaning": {
    src: "/services/sofa-cleaning.webp",
    alt: "Technician deep cleaning a large fabric sofa",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1616628182501-8933d0c8b1d0",
  },
  "l-shaped-sofa-cleaning": {
    src: "/services/L-sofa.webp",
    alt: "Cozy living room featuring an L-shaped sofa",
    credit: "Local",
    creditUrl: "#",
  },
  "carpet-cleaning-per-m": {
    src: "/services/carpet-cleaning.webp",
    alt: "Professional using equipment to clean a carpet",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1602524206267-13e76a3cec16",
  },
  "mattress-cleaning-single": {
    src: "/services/Mattress-cleaning.webp",
    alt: "Cleaner sanitizing a mattress with steam equipment",
    credit: "Local",
    creditUrl: "#",
  },
  "deep-cleaning-flat": {
    src: "/services/Deep-cleaning-(flat).webp",
    alt: "Cleaning crew sanitizing a modern apartment",
    credit: "Local",
    creditUrl: "#",
  },
  "kitchen-bathroom-deep-sanitize": {
    src: "/services/sanitize.webp",
    alt: "Cleaner disinfecting a bathroom sink with spray",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1582719478148-9ff3a0bbbc03",
  },
  "water-tank-cleaning": {
    src: "/services/Water-tank-cleaning.webp",
    alt: "Industrial worker inspecting a large water tank",
    credit: "Local",
    creditUrl: "#",
  },
  "pest-control": {
    src: "/services/pest-control.webp",
    alt: "Pest control technician spraying exterior perimeter",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1571171637578-0418e3aa4741",
  },
  "pressure-washing-for-outdoor": {
    src: "/services/Pressure-washing.webp",
    alt: "Worker pressure washing an outdoor patio",
    credit: "Local",
    creditUrl: "#",
  },
  "garden-care-and-irrigation-maintenance": {
    src: "/services/Garden-maintenance.webp",
    alt: "Gardener tending to lush greenery outdoors",
    credit: "Local",
    creditUrl: "#",
  },
  "pool-service-monthly": {
    src: "/services/pool.webp",
    alt: "Pool technician cleaning a residential swimming pool",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1576519885213-4b1d1b1cace5",
  },
  "exterior-fa-ade-cleaning": {
    src: "/services/hvac.webp",
    alt: "Workers suspended cleaning a building facade",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1548199973-03cce0bbc87b",
  },
  "pest-and-outdoor-disinfection": {
    src: "/services/Pest-outdoor-disinfection.webp",
    alt: "Technician fogging outdoor garden area",
    credit: "Local",
    creditUrl: "#",
  },
  "grass-cutting-trimming-planting": {
    src: "/services/Grass-cutting.webp",
    alt: "Gardener mowing a bright green lawn",
    credit: "Local",
    creditUrl: "#",
  },
  "outdoor-lighting-installation": {
    src: "/services/Outdoor-lighting-installation.webp",
    alt: "Electrician installing modern outdoor lighting fixtures",
    credit: "Local",
    creditUrl: "#",
  },
  "amc-for-apartments-annual": {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    alt: "Maintenance engineer checking residential HVAC system",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1582719478250-c89cae4dc85b",
  },
  "office-maintenance-and-cleaning": {
    src: "/services/office-cleaning.webp",
    alt: "Janitorial team cleaning a modern office workspace",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1585421514738-01798e348b17",
  },
  "hvac-predictive-servicing-per-unit-month": {
    src: "/services/HVAC-predictive-servicing .webp",
    alt: "Engineer inspecting HVAC rooftop units",
    credit: "Local",
    creditUrl: "#",
  },
  "energy-inspections": {
    src: "/services/energy.webp",
    alt: "Energy auditor reviewing building performance data",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1584278867479-7a9d6755c042",
  },
  "elevator-and-generator-maintenance-coordination": {
    src: "/services/elevator.webp",
    alt: "Technician servicing a commercial elevator system",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1558002038-1055907df827",
  },
  "iot-sensor-installation": {
    src: "/services/IoT-sensor-installation.webp",
    alt: "Installer setting up IoT sensors on a smart device",
    credit: "Local",
    creditUrl: "#",
  },
  "ai-predictive-alerts": {
    src: "/services/AI-predictive-alerts.webp",
    alt: "Abstract visualization of artificial intelligence network",
    credit: "Local",
    creditUrl: "#",
  },
  "remote-diagnostics-and-smart-reporting": {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
    alt: "Technician using tablet for remote diagnostics",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1517245386807-bb43f82c33c4",
  },
  "app-based-booking-and-monitoring": {
    src: "/services/App-based-booking.webp",
    alt: "Smartphone displaying maintenance booking app",
    credit: "Local",
    creditUrl: "#",
  },
  "automated-scheduling-and-chat-less-approvals": {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    alt: "Digital calendar with automated reminders",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1516321318423-f06f85e504b3",
  },
  "glass-and-aluminum-works": {
    src: "/services/glass-works.webp",
    alt: "Glazier installing aluminum framed glass panels",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1505843755163-3acb89f1cb63",
  },
  "signage-and-lighting-installation": {
    src: "/services/lighting-installation.webp",
    alt: "Technician installing illuminated commercial signage",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1509395176047-4a66953fd231",
  },
  "soundproofing-and-insulation": {
    src: "/services/Soundproofing-insulation.webp",
    alt: "Worker applying insulation materials to walls",
    credit: "Local",
    creditUrl: "#",
  },
  "emergency-24-7-call-out": {
    src: "/services/emergancy.webp",
    alt: "Emergency technician driving with flashing lights at night",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1501707305551-9b2adda5e527",
  },
  "vehicle-parking-gate-automation-repair": {
    src: "/services/parking-gate-automation.webp",
    alt: "Technician repairing automated parking gate",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1529429617124-aee301d7e4a3",
  },
  "renovation-and-refurbishment-projects": {
    src: "/services/renovation.webp",
    alt: "Home renovation in progress with tools and plans",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/photos/photo-1503389152951-9f343605f61e",
  },
  "monthly-wash-detail-per-ft-month": {
    src: "/services/Monthly-wash-detail.webp",
    alt: "Crew washing a luxury yacht at the marina",
    credit: "Local",
    creditUrl: "#",
  },
  "antifouling-per-ft": {
    src: "/services/Antifouling.webp",
    alt: "Boat hull being treated with antifouling paint",
    credit: "Local",
    creditUrl: "#",
  },
  "grp-polish-and-repair-per-ft": {
    src: "/services/GRP-polish-repair.webp",
    alt: "Marine technician polishing a yacht surface",
    credit: "Local",
    creditUrl: "#",
  },
  "captain-s-care-plan-per-ft-month": {
    src: "/services/Captain-Care.webp",
    alt: "Captain steering a yacht through calm waters",
    credit: "Local",
    creditUrl: "#",
  },
  "yacht-mechanical-servicing": {
    src: "/services/Yacht-mechanical-servicing.webp",
    alt: "Marine engineer servicing yacht engine components",
    credit: "Local",
    creditUrl: "#",
  },
  "electrical-and-navigation-systems-servicing": {
    src: "/services/Electrical-navigation.webp",
    alt: "Technician wiring marine electrical navigation systems",
    credit: "Local",
    creditUrl: "#",
  },
  "water-systems-pumps-and-pipe-maintenance": {
    src: "/services/Water-systems-pumps.webp",
    alt: "Technician inspecting marine water pump system",
    credit: "Local",
    creditUrl: "#",
  },
  "scheduled-marina-check-ups-and-emergency-response": {
    src: "/services/marina-checkup.webp",
    alt: "Yacht marina at sunset with maintenance crew",
    credit: "Local",
    creditUrl: "#",
  },
  "quartz-repair": {
    src: "/services/Quartz-repair.webp",
    alt: "Watchmaker repairing a quartz movement",
    credit: "Local",
    creditUrl: "#",
  },
  "automatic-service": {
    src: "/services/automatic-service.webp",
    alt: "Detailed close-up of automatic watch gears",
    credit: "Local",
    creditUrl: "#",
  },
  "full-rolex-service": {
    src: "/services/Full-Rolex-service.webp",
    alt: "Luxury watch maintenance on a workbench",
    credit: "Local",
    creditUrl: "#",
  },
  "battery-replacement": {
    src: "/services/Battery-replacement.webp",
    alt: "Technician replacing watch battery components",
    credit: "Local",
    creditUrl: "#",
  },
  "polishing-rolex-steel": {
    src: "/services/Polishing.webp",
    alt: "Professional polishing a stainless steel luxury watch",
    credit: "Local",
    creditUrl: "#",
  },
};

export function getServiceImage(name: string): ServiceImageMeta | null {
  const slug = slugify(name);
  return serviceImages[slug] ?? null;
}


