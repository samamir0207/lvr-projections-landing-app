import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const projections = pgTable("projections", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  aeSlug: varchar("ae_slug", { length: 255 }).notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectionSchema = createInsertSchema(projections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProjection = z.infer<typeof insertProjectionSchema>;
export type Projection = typeof projections.$inferSelect;

export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }),
  aeSlug: varchar("ae_slug", { length: 255 }),
  lid: varchar("lid", { length: 255 }),
  campaign: varchar("campaign", { length: 255 }),
  src: varchar("src", { length: 255 }),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

export interface ProjectionMeta {
  slug: string;
  homeownerFirstName: string;
  homeownerFullName: string;
}

export interface PropertyInfo {
  internalId: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  city: string;
  state: string;
  market: string;
  isLuxe: boolean;
}

export interface ProjectionEstimates {
  expectedRevenue: number;
  highRevenue: number;
  lowRevenue: number;
  disclaimer: string;
}

export interface MonthlyRevenueData {
  month: string;
  low: number;
  high: number;
}

export interface SeasonData {
  daysBooked: number;
  daysAvailable: number;
  occupancy: number;
  adr: number;
}

export interface Seasonality {
  peak: SeasonData;
  winter: SeasonData;
  highDemand: SeasonData;
  highShoulder: SeasonData;
  lowShoulder: SeasonData;
}

export interface SeasonalBreakdownItem {
  key: string;
  label: string;
  subtitle: string;
  daysBookedMin: number;
  daysBookedMax: number;
  daysAvailable: number;
  occupancyMinPct: number;
  occupancyMaxPct: number;
  adrMin: number;
  adrMax: number;
}

export interface AINarrativePlaceholders {
  summary: string;
  insights: string;
  optimizationTips: string;
}

export interface TrustStats {
  homeownerSatisfaction: string;
  guestReviews: string;
  higherRevenue: string;
  localTeam: boolean;
}

export interface TrustSection {
  stats: TrustStats;
  pillars: string[];
}

export interface CTAInfo {
  aeId?: string;
  aeSlug: string;
  scheduleCallUrl: string;
  aeName: string;
  aeTitle: string;
  aePhone: string;
  aeEmail: string;
  aeHeadshotUrl?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface ComparableProperty {
  image: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: string;
  propertyUrl: string;
}

export interface ProjectionData {
  meta: ProjectionMeta;
  property: PropertyInfo;
  projections: ProjectionEstimates;
  monthlyRevenue: MonthlyRevenueData[];
  seasonality: Seasonality;
  seasonalBreakdown: SeasonalBreakdownItem[];
  aiNarrativePlaceholders: AINarrativePlaceholders;
  trust: TrustSection;
  cta: CTAInfo;
  testimonials: Testimonial[];
  benefits: Benefit[];
  comparableProperties: ComparableProperty[];
}

export interface PropertyProjectionInput {
  homeownerFirstName: string;
  homeownerFullName: string;
  property: {
    internalId?: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    city: string;
    state: string;
    market?: string;
    isLuxe?: boolean;
  };
  projections: {
    expectedRevenue: number;
    highRevenue: number;
    lowRevenue: number;
  };
  monthlyRevenue: MonthlyRevenueData[];
  seasonalBreakdown: SeasonalBreakdownItem[];
}

export interface MarketDefaults {
  cta: CTAInfo;
  trust: TrustSection;
  testimonials: Testimonial[];
  benefits: Benefit[];
  comparableProperties: ComparableProperty[];
  seasonality: Seasonality;
  aiNarrativePlaceholders: AINarrativePlaceholders;
  projectionDisclaimer: string;
}
