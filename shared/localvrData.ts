import type { ProjectionData, PropertyProjectionInput, MarketDefaults } from "./schema";

// AE headshot mapping: email -> headshot image path
// Add new team members here with their headshot paths
export const AE_HEADSHOTS: Record<string, string> = {
  "kaci.wolkers@golocalvr.com": "/assets/ae-headshot-kaci-wolkers.png",
  "tyler.ramey@golocalvr.com": "/assets/ae-headshot-tyler-ramey.png",
};

// Get headshot URL for an AE by email, with fallback to default
export function getAeHeadshotUrl(email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  return AE_HEADSHOTS[normalizedEmail] || "/assets/ae-headshot-default.png";
}

function generateSlug(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export const KACI_30A_DEFAULTS: MarketDefaults = {
  cta: {
    aeId: "kaci-wolkers-001",
    aeSlug: "kaci-wolkers",
    scheduleCallUrl: "https://calendly.com/kaci-wolkers",
    aeName: "Kaci Wolkers",
    aeTitle: "Account Executive, LocalVR 30A",
    aePhone: "(850) 641-1001",
    aeEmail: "kaci.wolkers@golocalvr.com",
    aeHeadshotUrl: "/assets/ae-headshot-kaci-wolkers.png"
  },

  trust: {
    stats: {
      homeownerSatisfaction: "90%",
      guestReviews: "10,000+",
      higherRevenue: "25%",
      localTeam: true
    },
    pillars: [
      "Local Pricing™ dynamic algorithm",
      "Local operations team in every market",
      "24/7 guest support",
      "Hotel-grade housekeeping",
      "Three-tier inspection",
      "Three-level guest vetting",
      "Owner performance portal with real-time insights"
    ]
  },

  testimonials: [
    {
      quote: "Switching to LocalVR was the best decision we've made. Their local team is responsive, proactive, and truly cares about our home.",
      name: "Marc"
    },
    {
      quote: "The revenue projections were spot-on. We exceeded our expectations in the first year.",
      name: "Beth"
    },
    {
      quote: "Professional management with a personal touch. They treat our property like it's their own.",
      name: "Lucy"
    }
  ],

  benefits: [
    {
      title: "Elite Guest Matchmaking",
      description: "Three-level guest vetting ensures only qualified, respectful guests stay in your home.",
      icon: "users"
    },
    {
      title: "Premium Home Protection",
      description: "Three-tier inspection system and $10,000 damage protection for qualified reservations.",
      icon: "shield"
    },
    {
      title: "Tailored Management",
      description: "Dedicated local team with 1:10 ratio of home care experts to properties managed.",
      icon: "home"
    }
  ],

  comparableProperties: [
    {
      image: "property1",
      title: "8BR Escape with Pool, Hot Tub and Game Room",
      location: "Destin, FL",
      bedrooms: 8,
      bathrooms: "8.5",
      propertyUrl: "https://stay.golocalvr.com/property/67546fef23c1900012d5832c"
    },
    {
      image: "property2",
      title: "New 30A Retreat Beach Access Hot Tub & Guest Suite",
      location: "Seacrest Beach, FL",
      bedrooms: 6,
      bathrooms: "6.5",
      propertyUrl: "https://stay.golocalvr.com/property/67fff22502fdee0013294d94"
    },
    {
      image: "property3",
      title: "Gulf Coast Retreat with Pool < 1 Mile to Beach",
      location: "Blue Mountain Beach, FL",
      bedrooms: 4,
      bathrooms: "4",
      propertyUrl: "https://stay.golocalvr.com/property/674e3ee2acd0240012a693d3"
    }
  ],

  seasonality: {
    peak: {
      daysBooked: 16,
      daysAvailable: 16,
      occupancy: 1.0,
      adr: 947
    },
    winter: {
      daysBooked: 79,
      daysAvailable: 79,
      occupancy: 0.49,
      adr: 403
    },
    highDemand: {
      daysBooked: 71,
      daysAvailable: 99,
      occupancy: 0.71,
      adr: 875
    },
    highShoulder: {
      daysBooked: 11,
      daysAvailable: 71,
      occupancy: 0.11,
      adr: 683
    },
    lowShoulder: {
      daysBooked: 57,
      daysAvailable: 99,
      occupancy: 0.57,
      adr: 583
    }
  },

  aiNarrativePlaceholders: {
    summary: "Based on our comprehensive market analysis and proprietary Local Pricing™ algorithm, your property is positioned in one of the most desirable vacation rental markets in the Southeast. The combination of your property's premium location, bedroom configuration, and current market dynamics suggests strong revenue potential year-round with particular strength during peak summer months.",
    insights: "Our data reveals several key factors driving revenue potential for your property. The market experiences exceptional demand during summer months (June-July), where occupancy rates consistently reach near-full capacity. Your property's proximity to the beach and high-end amenities align perfectly with the luxury traveler segment that dominates this market. Additionally, the winter season shows steady shoulder demand, providing year-round income stability that many coastal markets lack.",
    optimizationTips: "To maximize your revenue potential, we recommend focusing on three strategic areas: First, maintaining premium presentation standards to justify higher ADR during peak periods. Second, implementing dynamic pricing adjustments during shoulder seasons to capture additional bookings while maintaining strong margins. Third, leveraging our three-tier inspection and hotel-grade housekeeping standards to maintain consistently high guest ratings, which directly correlate with booking conversion rates and allow for premium pricing year-round."
  },

  projectionDisclaimer: "These projections are based on historical performance of comparable properties, market seasonality trends, and LocalVR's pricing algorithm. Actual results may vary."
};

export function createProjection(input: PropertyProjectionInput): ProjectionData {
  const defaults = KACI_30A_DEFAULTS;
  
  return {
    meta: {
      slug: generateSlug(input.property.address),
      homeownerFirstName: input.homeownerFirstName,
      homeownerFullName: input.homeownerFullName,
      leadId: input.leadId || ''
    },
    property: {
      internalId: input.property.internalId || `LVR-30A-${Date.now()}`,
      address: input.property.address,
      bedrooms: input.property.bedrooms,
      bathrooms: input.property.bathrooms,
      squareFeet: input.property.squareFeet,
      city: input.property.city,
      state: input.property.state,
      market: input.property.market || "30A - Florida",
      isLuxe: input.property.isLuxe || false
    },
    projections: {
      expectedRevenue: input.projections.expectedRevenue,
      highRevenue: input.projections.highRevenue,
      lowRevenue: input.projections.lowRevenue,
      disclaimer: defaults.projectionDisclaimer
    },
    monthlyRevenue: input.monthlyRevenue,
    seasonality: defaults.seasonality,
    seasonalBreakdown: input.seasonalBreakdown,
    aiNarrativePlaceholders: defaults.aiNarrativePlaceholders,
    trust: defaults.trust,
    cta: defaults.cta,
    testimonials: defaults.testimonials,
    benefits: defaults.benefits,
    comparableProperties: defaults.comparableProperties
  };
}

const templatePlaceholder = createProjection({
  homeownerFirstName: "[First Name]",
  homeownerFullName: "[Homeowner Full Name]",
  property: {
    internalId: "[Property ID]",
    address: "[Property Address]",
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    city: "[City]",
    state: "[ST]"
  },
  projections: {
    expectedRevenue: 0,
    highRevenue: 0,
    lowRevenue: 0
  },
  monthlyRevenue: [
    { month: "Jan", low: 0, high: 0 },
    { month: "Feb", low: 0, high: 0 },
    { month: "Mar", low: 0, high: 0 },
    { month: "Apr", low: 0, high: 0 },
    { month: "May", low: 0, high: 0 },
    { month: "Jun", low: 0, high: 0 },
    { month: "Jul", low: 0, high: 0 },
    { month: "Aug", low: 0, high: 0 },
    { month: "Sep", low: 0, high: 0 },
    { month: "Oct", low: 0, high: 0 },
    { month: "Nov", low: 0, high: 0 },
    { month: "Dec", low: 0, high: 0 }
  ],
  seasonalBreakdown: [
    {
      key: "peak_days",
      label: "Peak Days",
      subtitle: "NYE, Memorial Day, 4th of July, Christmas",
      daysBookedMin: 0,
      daysBookedMax: 0,
      daysAvailable: 0,
      occupancyMinPct: 0,
      occupancyMaxPct: 0,
      adrMin: 0,
      adrMax: 0
    },
    {
      key: "winter_season",
      label: "Winter Season",
      subtitle: "Dec 1–Feb 28",
      daysBookedMin: 0,
      daysBookedMax: 0,
      daysAvailable: 0,
      occupancyMinPct: 0,
      occupancyMaxPct: 0,
      adrMin: 0,
      adrMax: 0
    },
    {
      key: "high_demand",
      label: "High Demand",
      subtitle: "Spring Break, May 20–Aug 15, Labor Day, Thanksgiving",
      daysBookedMin: 0,
      daysBookedMax: 0,
      daysAvailable: 0,
      occupancyMinPct: 0,
      occupancyMaxPct: 0,
      adrMin: 0,
      adrMax: 0
    },
    {
      key: "high_shoulder",
      label: "High Shoulder",
      subtitle: "Mar 1–May 19",
      daysBookedMin: 0,
      daysBookedMax: 0,
      daysAvailable: 0,
      occupancyMinPct: 0,
      occupancyMaxPct: 0,
      adrMin: 0,
      adrMax: 0
    },
    {
      key: "low_shoulder",
      label: "Low Shoulder",
      subtitle: "Aug 16–Nov 30",
      daysBookedMin: 0,
      daysBookedMax: 0,
      daysAvailable: 0,
      occupancyMinPct: 0,
      occupancyMaxPct: 0,
      adrMin: 0,
      adrMax: 0
    }
  ]
});

const sarahProjection = createProjection({
  homeownerFirstName: "Sarah",
  homeownerFullName: "Sarah Johnson",
  property: {
    internalId: "LVR-30A-RE1282",
    address: "456 Beachside Dr, Seacrest Beach, FL 32461",
    bedrooms: 5,
    bathrooms: 5,
    squareFeet: 3200,
    city: "Seacrest Beach",
    state: "FL"
  },
  projections: {
    expectedRevenue: 145000,
    highRevenue: 175000,
    lowRevenue: 115000
  },
  monthlyRevenue: [
    { month: "Jan", low: 11000, high: 24000 },
    { month: "Feb", low: 12000, high: 26000 },
    { month: "Mar", low: 9000, high: 22000 },
    { month: "Apr", low: 5000, high: 9000 },
    { month: "May", low: 3000, high: 7000 },
    { month: "Jun", low: 10000, high: 14000 },
    { month: "Jul", low: 13000, high: 21000 },
    { month: "Aug", low: 11000, high: 15000 },
    { month: "Sep", low: 8000, high: 12000 },
    { month: "Oct", low: 7000, high: 13000 },
    { month: "Nov", low: 9000, high: 14000 },
    { month: "Dec", low: 10000, high: 20000 }
  ],
  seasonalBreakdown: [
    {
      key: "peak_days",
      label: "Peak Days",
      subtitle: "NYE, Memorial Day, 4th of July, Christmas",
      daysBookedMin: 14,
      daysBookedMax: 16,
      daysAvailable: 16,
      occupancyMinPct: 88,
      occupancyMaxPct: 100,
      adrMin: 850,
      adrMax: 1250
    },
    {
      key: "winter_season",
      label: "Winter Season",
      subtitle: "Dec 1–Feb 28",
      daysBookedMin: 12,
      daysBookedMax: 18,
      daysAvailable: 79,
      occupancyMinPct: 15,
      occupancyMaxPct: 23,
      adrMin: 375,
      adrMax: 525
    },
    {
      key: "high_demand",
      label: "High Demand",
      subtitle: "Spring Break, May 20–Aug 15, Labor Day, Thanksgiving",
      daysBookedMin: 62,
      daysBookedMax: 90,
      daysAvailable: 98,
      occupancyMinPct: 63,
      occupancyMaxPct: 92,
      adrMin: 650,
      adrMax: 950
    },
    {
      key: "high_shoulder",
      label: "High Shoulder",
      subtitle: "Mar 1–May 19",
      daysBookedMin: 38,
      daysBookedMax: 55,
      daysAvailable: 82,
      occupancyMinPct: 46,
      occupancyMaxPct: 67,
      adrMin: 520,
      adrMax: 780
    },
    {
      key: "low_shoulder",
      label: "Low Shoulder",
      subtitle: "Aug 16–Nov 30",
      daysBookedMin: 35,
      daysBookedMax: 52,
      daysAvailable: 90,
      occupancyMinPct: 39,
      occupancyMaxPct: 58,
      adrMin: 400,
      adrMax: 580
    }
  ]
});

const projectionsMap: Record<string, ProjectionData> = {
  [templatePlaceholder.meta.slug]: templatePlaceholder,
  [sarahProjection.meta.slug]: sarahProjection
};

export function getProjectionBySlug(slug: string): ProjectionData | null {
  return projectionsMap[slug] || null;
}

export function getDefaultProjection(): ProjectionData {
  return templatePlaceholder;
}

export function getAllProjections(): ProjectionData[] {
  return Object.values(projectionsMap);
}

export const localvrData = templatePlaceholder;
