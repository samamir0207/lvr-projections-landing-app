import { 
  type User, 
  type InsertUser, 
  type ProjectionData, 
  type Projection, 
  type InsertProjection,
  type InsertEvent,
  type AnalyticsEvent,
  projections,
  analyticsEvents,
  users
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProjectionBySlug(slug: string): Promise<ProjectionData | null>;
  getProjectionByAeAndSlug(aeSlug: string, slug: string): Promise<ProjectionData | null>;
  getProjectionWithMeta(slug: string): Promise<Projection | null>;
  createProjection(slug: string, aeSlug: string, data: ProjectionData): Promise<Projection>;
  updateProjection(slug: string, aeSlug: string, data: ProjectionData): Promise<Projection | null>;
  
  logEvent(event: InsertEvent): Promise<AnalyticsEvent>;
  getEventsBySlug(slug: string): Promise<AnalyticsEvent[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProjectionBySlug(slug: string): Promise<ProjectionData | null> {
    const [projection] = await db.select().from(projections).where(eq(projections.slug, slug));
    if (!projection) return null;
    return projection.data as ProjectionData;
  }

  async getProjectionByAeAndSlug(aeSlug: string, slug: string): Promise<ProjectionData | null> {
    const [projection] = await db.select().from(projections)
      .where(eq(projections.slug, slug));
    if (!projection) return null;
    
    if (projection.aeSlug !== aeSlug) {
      return null;
    }
    
    return projection.data as ProjectionData;
  }

  async getProjectionWithMeta(slug: string): Promise<Projection | null> {
    const [projection] = await db.select().from(projections).where(eq(projections.slug, slug));
    return projection || null;
  }

  async createProjection(slug: string, aeSlug: string, data: ProjectionData): Promise<Projection> {
    const [projection] = await db.insert(projections).values({
      slug,
      aeSlug,
      data
    }).returning();
    return projection;
  }

  async updateProjection(slug: string, aeSlug: string, data: ProjectionData): Promise<Projection | null> {
    const [projection] = await db.update(projections)
      .set({ data, aeSlug, updatedAt: new Date() })
      .where(eq(projections.slug, slug))
      .returning();
    return projection || null;
  }

  async logEvent(event: InsertEvent): Promise<AnalyticsEvent> {
    const [logged] = await db.insert(analyticsEvents).values(event).returning();
    return logged;
  }

  async getEventsBySlug(slug: string): Promise<AnalyticsEvent[]> {
    return db.select().from(analyticsEvents).where(eq(analyticsEvents.slug, slug));
  }
}

export const storage = new DatabaseStorage();
