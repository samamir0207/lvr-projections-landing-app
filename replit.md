# LocalVR Revenue Projections Landing Page

## Overview

This is a template-driven single-page application that generates custom vacation rental revenue projections for LocalVR properties. The application displays property details, annual revenue projections with low/high estimates, monthly revenue breakdowns, seasonal performance data, and trust-building content to encourage prospective clients to book a consultation call.

The application is built as a marketing landing page template that can render any property whose data is provided via JSON, presenting data-driven revenue projections in a premium, clean aesthetic aligned with LocalVR's brand identity.

## User Preferences

Preferred communication style: Simple, everyday language.

## Template System

### Two-Layer Data Architecture

The template uses a two-layer data system to separate fixed Kaci/30A content from dynamic property data:

**Fixed Content (KACI_30A_DEFAULTS)** - Never changes between projections:
- Kaci's AE info (name, title, phone, email, Calendly URL)
- Trust stats and value pillars
- Testimonials from happy homeowners
- Service benefits
- Comparable property cards (30A portfolio)
- Seasonality patterns for 30A market
- AI narrative placeholders

**Dynamic Content (PropertyProjectionInput)** - Changes per homeowner:
- Homeowner first name and full name
- Property address, bedrooms, bathrooms, square feet, city, state
- Revenue projections (expected, low, high)
- Monthly revenue breakdown
- Seasonal breakdown specific to the property

### Data Loading

- `shared/localvrData.ts` exports:
  - `createProjection(input)`: Creates full ProjectionData by merging dynamic input with Kaci's fixed defaults
  - `getProjectionBySlug(slug)`: Returns ProjectionData by URL slug
  - `getDefaultProjection()`: Returns default sample data
  - `getAllProjections()`: Returns all available projections
  - `KACI_30A_DEFAULTS`: Direct access to fixed defaults (for reference)

### Adding New Properties

To add a new property projection, use the `createProjection()` helper:

```typescript
const newProjection = createProjection({
  homeownerFirstName: "Sarah",
  homeownerFullName: "Sarah Johnson",
  property: {
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
  monthlyRevenue: [...],  // 12 months of data
  seasonalBreakdown: [...]  // 5 seasons of data
});
```

Kaci's contact info, testimonials, comparable properties, and 30A branding are automatically included.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management

**UI Component Library:**
- Shadcn/ui components with Radix UI primitives for accessible, composable UI elements
- Tailwind CSS for utility-first styling with custom design tokens
- Chart.js with react-chartjs-2 for data visualization (monthly revenue charts)
- Custom CSS variables for theming (defined in `index.css`)

**Design System:**
- Color palette: Cream (#f7f4f0) background, Charcoal (#333333) for text, Gold (#d3bda2) for accents/CTAs
- Consistent spacing units using Tailwind
- Component-based architecture with reusable UI elements

**State & Data Management:**
- Template data loaded from `shared/localvrData.ts`
- LandingPage accepts optional `data: ProjectionData` prop
- Falls back to default projection if no data provided

**Frontend Routes:**
- `/` - Default landing page with placeholder data
- `/:aeSlug/:slug` - Dynamic projection page that fetches data from API

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Separate development (`index-dev.ts`) and production (`index-prod.ts`) entry points
- Development mode includes Vite middleware for HMR (Hot Module Replacement)
- Production mode serves pre-built static assets from `dist/public`

**API Endpoints:**
- `POST /api/projections` - Creates or updates a projection from Google Sheets, returns `{ ok: true, publicUrl, slug, aeSlug }`
- `GET /api/projections/:aeSlug/:slug` - Returns projection data for dynamic rendering
- `POST /api/events` - Logs analytics events to database
- `POST /api/contact` - Submits contact form and logs to database

**Storage Layer:**
- PostgreSQL database with Drizzle ORM
- Neon serverless driver with WebSocket support (`ws` package)
- `DatabaseStorage` class implements `IStorage` interface

**Database Schema:**
- `projections` table: id, slug, aeSlug, data (JSONB), createdAt, updatedAt
- `analytics_events` table: id, event, slug, aeSlug, lid, campaign, src, meta (JSONB), timestamp

### Analytics & Tracking

**Google Tag Manager Integration:**
- GTM container placeholder in `client/index.html`
- Replace `GTM-XXXXXXX` with actual container ID

**Event Tracking (`client/src/lib/analytics.ts`):**
- `initPageView()` - Tracks page views with URL parameters
- `trackCTAClick(ctaId)` - Tracks CTA button clicks
- `trackFormSubmit()` - Tracks contact form submissions
- `trackTimeOnPage()` - Tracks time spent on page

**Tracked Events:**
- `projection_page_view` - Fired on page load
- `projection_cta_click` - Fired on CTA button clicks
- `projection_form_submit` - Fired on form submission
- `projection_time_on_page` - Fired on page unload

### External Dependencies

**Database:**
- Drizzle ORM v0.39.1 for type-safe database queries
- @neondatabase/serverless v0.10.4 for Postgres connection
- `ws` package for WebSocket support in Node.js

**UI & Component Libraries:**
- @radix-ui/* packages (v1.x) for accessible UI primitives
- chart.js v4.5.1 for data visualization
- lucide-react for iconography
- react-hook-form with @hookform/resolvers for form handling

**Third-Party Services:**
- Calendly integration for booking calls (referenced in CTA URLs)
- Google Tag Manager for analytics (placeholder configured)

**Asset Management:**
- Static assets stored in `attached_assets/` directory
- Property images referenced via `@assets` alias
- AE headshots stored in attached_assets

## Google Sheets Integration

To create a projection from Google Sheets, POST to `/api/projections`:

```bash
curl -X POST https://your-domain.replit.app/api/projections \
  -H "Content-Type: application/json" \
  -d '{
    "meta": { "slug": "property-slug", "homeownerFirstName": "John", "homeownerFullName": "John Smith" },
    "property": { ... },
    "projections": { ... },
    ...
  }'
```

Response:
```json
{
  "ok": true,
  "publicUrl": "https://your-domain.replit.app/kaci-wolkers/property-slug",
  "slug": "property-slug",
  "aeSlug": "kaci-wolkers"
}
```

## Recent Changes

- **Dec 23, 2025**: Fixed market-specific content rendering for all 7 markets
  - Comparable property images now use direct paths from MARKET_COMPARABLE_PROPERTIES (/assets/comp-{market}-{1,2,3}.{jpg,png})
  - Form images now use MARKET_FORM_IMAGES[marketCode] instead of hardcoded default
  - Season subtitles (date ranges) are now applied from MARKET_SEASON_SUBTITLES based on property.market
  - All market images stored in client/public/assets/ directory (30A, BC, PC, TE, VA, BS, LT)
  - Frontend no longer uses lookup table for property images; uses comp.image path directly

- **Dec 23, 2025**: Fixed critical aeSlug bug in projection updates
  - Bug: When a projection was updated (same slug, different AE), the database ae_slug column was not being updated
  - This caused page loads to fail with 404 because getProjectionByAeAndSlug validates that stored aeSlug matches URL
  - Fix: updateProjection() now takes aeSlug parameter and updates the column along with data
  - Added enhanced logging to track input vs normalized aeSlug values

- **Dec 22, 2025**: Improved Salesforce task creation logic for tracking links
  - Added `viewer=ae` parameter support: AE preview links don't create Salesforce tasks
  - Added 14-day age threshold: Tasks only created when projection is 14+ days old (indicates organic interest)
  - AE preview clicks logged as separate `projection_ae_preview` event for analytics
  - Google Sheets Apps Script now generates both Lead URL (for homeowner) and Preview URL (for AE)

- **Dec 8, 2025**: Added database storage, API endpoints, and analytics tracking
  - Created PostgreSQL database with projections and analytics_events tables
  - Implemented POST /api/projections for Google Sheets integration
  - Added dynamic routing with /:aeSlug/:slug pattern
  - Integrated Google Tag Manager with client-side analytics module
  - Implemented comprehensive event tracking (page views, CTA clicks, form submissions, time on page)
  - Added WebSocket configuration for Neon database connection
  - Built contact form with hidden tracking fields (slug, aeId, leadId, campaign)

- **Dec 8, 2025 (earlier)**: Converted landing page to template-driven architecture
  - Added ProjectionData interface with all data blocks
  - Implemented getProjectionBySlug() for multi-property support
  - LandingPage now accepts data prop for complete customization
  - Personalized headline uses homeowner's first name
  - Testimonials, comparable properties now data-driven
