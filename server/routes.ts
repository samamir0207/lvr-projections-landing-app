import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { ProjectionData, InsertEvent } from "@shared/schema";
import { KACI_30A_DEFAULTS } from "@shared/localvrData";
import { updateLeadProjectionUrl, createClickTrackingTask, createFormSubmissionTask } from "./salesforce";
import { buildFormSubmissionEmail, sendEmail } from "./email";

// Flexible schema that accepts Apps Script format and transforms it
const projectionInputSchema = z.object({
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
  // Accept either format for projections
  projections: z.object({
    expectedRevenue: z.number().optional(),
    highRevenue: z.number().optional(),
    lowRevenue: z.number().optional(),
    expectedAnnualRevenue: z.number().optional(),
    highAnnualRevenue: z.number().optional(),
    lowAnnualRevenue: z.number().optional(),
    disclaimer: z.string().optional()
  }),
  monthlyRevenue: z.array(z.object({
    month: z.string(),
    low: z.number(),
    high: z.number()
  })),
  // Accept either seasonalBreakdown array or seasonality object with seasons array
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
  seasonality: z.object({
    seasons: z.array(z.object({
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
    })).optional()
  }).optional(),
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
    aeCalendarUrl: z.string().optional(),
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

// Transform input to normalized ProjectionData format with defaults for optional fields
function normalizeProjectionInput(input: z.infer<typeof projectionInputSchema>): ProjectionData {
  // Normalize projections - prefer new names, fall back to Annual names
  const projections = {
    expectedRevenue: input.projections.expectedRevenue ?? input.projections.expectedAnnualRevenue ?? 0,
    highRevenue: input.projections.highRevenue ?? input.projections.highAnnualRevenue ?? 0,
    lowRevenue: input.projections.lowRevenue ?? input.projections.lowAnnualRevenue ?? 0,
    disclaimer: input.projections.disclaimer || "Projections are estimates based on market data and comparable properties."
  };

  // Normalize seasonalBreakdown - prefer direct array, fall back to seasonality.seasons
  const seasonalBreakdown = input.seasonalBreakdown || input.seasonality?.seasons || [];

  // Normalize CTA - scheduleCallUrl can come as aeCalendarUrl, merge with defaults
  const cta = {
    ...KACI_30A_DEFAULTS.cta,
    ...input.cta,
    scheduleCallUrl: input.cta.scheduleCallUrl || input.cta.aeCalendarUrl || KACI_30A_DEFAULTS.cta.scheduleCallUrl
  };

  // Use defaults for optional fields if not provided
  const trust = input.trust || KACI_30A_DEFAULTS.trust;
  const testimonials = input.testimonials || KACI_30A_DEFAULTS.testimonials;
  const benefits = input.benefits || KACI_30A_DEFAULTS.benefits;
  const comparableProperties = input.comparableProperties || KACI_30A_DEFAULTS.comparableProperties;

  return {
    meta: input.meta,
    property: input.property,
    projections,
    monthlyRevenue: input.monthlyRevenue,
    seasonalBreakdown,
    aiNarrativePlaceholders: input.aiNarrativePlaceholders,
    trust,
    cta,
    testimonials,
    benefits,
    comparableProperties
  } as ProjectionData;
}

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
  return 'https://projections.golocalvr.com';
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
      console.log('[API] POST /api/projections received:', JSON.stringify(req.body, null, 2).slice(0, 500));
      
      const parsed = projectionInputSchema.safeParse(req.body);
      
      if (!parsed.success) {
        console.error('[API] Validation failed:', JSON.stringify(parsed.error.flatten(), null, 2));
        return res.status(400).json({ 
          ok: false, 
          error: "Invalid projection data", 
          details: parsed.error.flatten() 
        });
      }
      
      // Transform to normalized format
      const data = normalizeProjectionInput(parsed.data);
      const slug = data.meta.slug;
      const aeSlug = data.cta.aeSlug;
      const leadId = data.meta.leadId;
      
      console.log(`[API] Creating projection: slug=${slug}, aeSlug=${aeSlug}, leadId=${leadId}`);
      
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
          projectionPageUrl: `${baseUrl}/${projectionData.cta.aeSlug}/${formData.slug}`,
          leadId: formData.leadId
        });
        // TESTING: Override recipient to sam@golocalvr.com (TODO: revert after testing)
        emailPayload.to = 'sam@golocalvr.com';
        emailPayload.replyTo = formData.email;
        
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
