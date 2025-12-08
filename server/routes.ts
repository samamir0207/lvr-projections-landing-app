import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { ProjectionData, InsertEvent } from "@shared/schema";

const projectionDataSchema = z.object({
  meta: z.object({
    slug: z.string(),
    homeownerFirstName: z.string(),
    homeownerFullName: z.string()
  }),
  property: z.object({
    internalId: z.string(),
    address: z.string(),
    bedrooms: z.number(),
    bathrooms: z.number(),
    squareFeet: z.number(),
    city: z.string(),
    state: z.string(),
    market: z.string(),
    isLuxe: z.boolean()
  }),
  projections: z.object({
    expectedRevenue: z.number(),
    highRevenue: z.number(),
    lowRevenue: z.number(),
    disclaimer: z.string()
  }),
  monthlyRevenue: z.array(z.object({
    month: z.string(),
    low: z.number(),
    high: z.number()
  })),
  seasonality: z.object({
    peak: z.object({ daysBooked: z.number(), daysAvailable: z.number(), occupancy: z.number(), adr: z.number() }),
    winter: z.object({ daysBooked: z.number(), daysAvailable: z.number(), occupancy: z.number(), adr: z.number() }),
    highDemand: z.object({ daysBooked: z.number(), daysAvailable: z.number(), occupancy: z.number(), adr: z.number() }),
    highShoulder: z.object({ daysBooked: z.number(), daysAvailable: z.number(), occupancy: z.number(), adr: z.number() }),
    lowShoulder: z.object({ daysBooked: z.number(), daysAvailable: z.number(), occupancy: z.number(), adr: z.number() })
  }),
  seasonalBreakdown: z.array(z.object({
    key: z.string(),
    label: z.string(),
    subtitle: z.string(),
    daysBookedMin: z.number(),
    daysBookedMax: z.number(),
    daysAvailable: z.number(),
    occupancyMinPct: z.number(),
    occupancyMaxPct: z.number(),
    adrMin: z.number(),
    adrMax: z.number()
  })),
  aiNarrativePlaceholders: z.object({
    summary: z.string(),
    insights: z.string(),
    optimizationTips: z.string()
  }),
  trust: z.object({
    stats: z.object({
      homeownerSatisfaction: z.string(),
      guestReviews: z.string(),
      higherRevenue: z.string(),
      localTeam: z.boolean()
    }),
    pillars: z.array(z.string())
  }),
  cta: z.object({
    aeId: z.string().optional(),
    aeSlug: z.string(),
    scheduleCallUrl: z.string(),
    aeName: z.string(),
    aeTitle: z.string(),
    aePhone: z.string(),
    aeEmail: z.string(),
    aeHeadshotUrl: z.string().optional()
  }),
  testimonials: z.array(z.object({
    quote: z.string(),
    name: z.string()
  })),
  benefits: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string()
  })),
  comparableProperties: z.array(z.object({
    image: z.string(),
    title: z.string(),
    location: z.string(),
    bedrooms: z.number(),
    bathrooms: z.string(),
    propertyUrl: z.string()
  }))
});

const eventSchema = z.object({
  event: z.string(),
  slug: z.string().optional(),
  aeSlug: z.string().optional(),
  lid: z.string().optional(),
  campaign: z.string().optional(),
  src: z.string().optional(),
  meta: z.record(z.any()).optional()
});

const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  slug: z.string().optional(),
  aeId: z.string().optional(),
  aeEmail: z.string().optional(),
  leadId: z.string().optional(),
  campaign: z.string().optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/projections", async (req: Request, res: Response) => {
    try {
      const parsed = projectionDataSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          ok: false, 
          error: "Invalid projection data", 
          details: parsed.error.flatten() 
        });
      }
      
      const data = parsed.data as ProjectionData;
      const slug = data.meta.slug;
      const aeSlug = data.cta.aeSlug;
      
      const existing = await storage.getProjectionBySlug(slug);
      
      if (existing) {
        await storage.updateProjection(slug, data);
      } else {
        await storage.createProjection(slug, aeSlug, data);
      }
      
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : 'http://localhost:5000';
      
      const publicUrl = `${baseUrl}/${aeSlug}/${slug}`;
      
      return res.json({ 
        ok: true, 
        publicUrl,
        slug,
        aeSlug
      });
    } catch (error) {
      console.error("Error creating projection:", error);
      return res.status(500).json({ ok: false, error: "Internal server error" });
    }
  });

  app.get("/api/projections/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const data = await storage.getProjectionBySlug(slug);
      
      if (!data) {
        return res.status(404).json({ ok: false, error: "Projection not found" });
      }
      
      return res.json({ ok: true, data });
    } catch (error) {
      console.error("Error fetching projection:", error);
      return res.status(500).json({ ok: false, error: "Internal server error" });
    }
  });

  app.get("/api/projections/:aeSlug/:slug", async (req: Request, res: Response) => {
    try {
      const { aeSlug, slug } = req.params;
      const data = await storage.getProjectionByAeAndSlug(aeSlug, slug);
      
      if (!data) {
        return res.status(404).json({ ok: false, error: "Projection not found" });
      }
      
      return res.json({ ok: true, data });
    } catch (error) {
      console.error("Error fetching projection:", error);
      return res.status(500).json({ ok: false, error: "Internal server error" });
    }
  });

  app.post("/api/events", async (req: Request, res: Response) => {
    try {
      const parsed = eventSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ ok: false, error: "Invalid event data" });
      }
      
      const eventData: InsertEvent = {
        event: parsed.data.event,
        slug: parsed.data.slug || null,
        aeSlug: parsed.data.aeSlug || null,
        lid: parsed.data.lid || null,
        campaign: parsed.data.campaign || null,
        src: parsed.data.src || null,
        meta: parsed.data.meta || null
      };
      
      const logged = await storage.logEvent(eventData);
      
      console.log(`[Analytics] ${eventData.event}:`, {
        slug: eventData.slug,
        aeSlug: eventData.aeSlug,
        lid: eventData.lid,
        campaign: eventData.campaign,
        meta: eventData.meta
      });
      
      return res.json({ ok: true, eventId: logged.id });
    } catch (error) {
      console.error("Error logging event:", error);
      return res.status(500).json({ ok: false, error: "Internal server error" });
    }
  });

  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const parsed = contactFormSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          ok: false, 
          error: "Invalid form data",
          details: parsed.error.flatten()
        });
      }
      
      const formData = parsed.data;
      
      console.log(`[Contact Form] New submission:`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        slug: formData.slug,
        aeId: formData.aeId,
        aeEmail: formData.aeEmail,
        leadId: formData.leadId,
        campaign: formData.campaign
      });
      
      await storage.logEvent({
        event: "projection_form_submit",
        slug: formData.slug || null,
        aeSlug: formData.aeId || null,
        lid: formData.leadId || null,
        campaign: formData.campaign || null,
        src: null,
        meta: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      });
      
      return res.json({ 
        ok: true, 
        message: "Form submitted successfully. The account executive will be notified." 
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      return res.status(500).json({ ok: false, error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
