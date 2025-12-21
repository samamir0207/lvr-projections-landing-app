import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { ProjectionData, InsertEvent } from "@shared/schema";
import { updateLeadProjectionUrl, createClickTrackingTask, createFormSubmissionTask } from "./salesforce";
import { buildFormSubmissionEmail, sendEmail } from "./email";

const projectionDataSchema = z.object({
  meta: z.object({
    slug: z.string(),
    homeownerFirstName: z.string(),
    homeownerFullName: z.string(),
    leadId: z.string()
  }),
  property: z.object({
    internalId: z.string().optional(),
    address: z.string(),
    bedrooms: z.number(),
    bathrooms: z.number(),
    squareFeet: z.number().optional(),
    city: z.string(),
    state: z.string(),
    market: z.string().optional(),
    isLuxe: z.boolean().optional()
  }),
  projections: z.object({
    expectedRevenue: z.number(),
    highRevenue: z.number(),
    lowRevenue: z.number(),
    disclaimer: z.string().optional()
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
  }).optional(),
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
  })).optional(),
  aiNarrativePlaceholders: z.object({
    summary: z.string(),
    insights: z.string(),
    optimizationTips: z.string()
  }).optional(),
  trust: z.object({
    stats: z.object({
      homeownerSatisfaction: z.string(),
      guestReviews: z.string(),
      higherRevenue: z.string(),
      localTeam: z.boolean()
    }),
    pillars: z.array(z.string())
  }).optional(),
  cta: z.object({
    aeId: z.string().optional(),
    aeSlug: z.string(),
    scheduleCallUrl: z.string().optional(),
    aeName: z.string(),
    aeTitle: z.string(),
    aePhone: z.string(),
    aeEmail: z.string(),
    aeHeadshotUrl: z.string().optional()
  }),
  testimonials: z.array(z.object({
    quote: z.string(),
    name: z.string()
  })).optional(),
  benefits: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string()
  })).optional(),
  comparableProperties: z.array(z.object({
    image: z.string(),
    title: z.string(),
    location: z.string(),
    bedrooms: z.number(),
    bathrooms: z.string(),
    propertyUrl: z.string()
  })).optional()
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
  aeSlug: z.string().optional(),
  aeId: z.string().optional(),
  aeEmail: z.string().optional(),
  leadId: z.string().optional(),
  campaign: z.string().optional()
});

function getBaseUrl(): string {
  if (process.env.PUBLIC_DOMAIN) {
    return `https://${process.env.PUBLIC_DOMAIN}`;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  return 'http://localhost:5000';
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/t", async (req: Request, res: Response) => {
    try {
      const { lid, slug, ae } = req.query;
      
      if (!lid || !slug || !ae) {
        return res.status(400).send("Missing required parameters: lid, slug, ae");
      }
      
      const leadId = String(lid);
      const projectionSlug = String(slug);
      const aeSlug = String(ae);
      
      await storage.logEvent({
        event: "projection_link_click",
        slug: projectionSlug,
        aeSlug: aeSlug,
        lid: leadId,
        campaign: null,
        src: "sf_email",
        meta: {
          ip: req.ip,
          userAgent: req.headers['user-agent']
        }
      });
      
      console.log(`[Tracking] Click tracked for Lead ${leadId}, slug ${projectionSlug}`);
      
      createClickTrackingTask(leadId, projectionSlug).catch(err => {
        console.error('[Tracking] Failed to create Salesforce Task:', err);
      });
      
      const redirectUrl = `/${aeSlug}/${projectionSlug}?lid=${encodeURIComponent(leadId)}&src=sf_email`;
      return res.redirect(302, redirectUrl);
    } catch (error) {
      console.error("Error in tracking redirect:", error);
      return res.status(500).send("Internal server error");
    }
  });

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
      const leadId = data.meta.leadId;
      
      const existing = await storage.getProjectionBySlug(slug);
      
      if (existing) {
        await storage.updateProjection(slug, data);
      } else {
        await storage.createProjection(slug, aeSlug, data);
      }
      
      const baseUrl = getBaseUrl();
      const publicUrl = `${baseUrl}/${aeSlug}/${slug}`;
      const trackingUrl = `${baseUrl}/t?lid=${encodeURIComponent(leadId)}&slug=${encodeURIComponent(slug)}&ae=${encodeURIComponent(aeSlug)}`;
      
      updateLeadProjectionUrl(leadId, trackingUrl).catch(err => {
        console.error('[Salesforce] Failed to update Lead:', err);
      });
      
      return res.json({ 
        ok: true, 
        publicUrl,
        trackingUrl,
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
        aeSlug: formData.aeSlug,
        aeId: formData.aeId,
        aeEmail: formData.aeEmail,
        leadId: formData.leadId,
        campaign: formData.campaign
      });
      
      await storage.logEvent({
        event: "projection_form_submit",
        slug: formData.slug || null,
        aeSlug: formData.aeSlug || null,
        lid: formData.leadId || null,
        campaign: formData.campaign || null,
        src: null,
        meta: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      });
      
      let projectionData: ProjectionData | null = null;
      if (formData.slug) {
        projectionData = await storage.getProjectionBySlug(formData.slug);
      }
      
      if (formData.aeEmail && projectionData) {
        const baseUrl = getBaseUrl();
        const emailPayload = buildFormSubmissionEmail({
          homeownerName: formData.name,
          homeownerEmail: formData.email,
          homeownerPhone: formData.phone,
          message: formData.message,
          propertyAddress: projectionData.property.address,
          propertyCity: projectionData.property.city,
          propertyMarket: projectionData.property.market,
          projectionLow: projectionData.projections.lowRevenue,
          projectionExpected: projectionData.projections.expectedRevenue,
          projectionHigh: projectionData.projections.highRevenue,
          projectionPageUrl: `${baseUrl}/${formData.aeSlug}/${formData.slug}`,
          leadId: formData.leadId
        });
        emailPayload.to = formData.aeEmail;
        emailPayload.replyTo = formData.aeEmail;
        
        sendEmail(emailPayload).catch(err => {
          console.error('[Email] Failed to send notification:', err);
        });
      }
      
      if (formData.leadId) {
        createFormSubmissionTask(
          formData.leadId, 
          formData.slug || 'unknown',
          formData.message
        ).catch(err => {
          console.error('[Salesforce] Failed to create form submission Task:', err);
        });
      }
      
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
