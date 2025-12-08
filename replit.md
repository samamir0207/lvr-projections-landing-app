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

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Separate development (`index-dev.ts`) and production (`index-prod.ts`) entry points
- Development mode includes Vite middleware for HMR (Hot Module Replacement)
- Production mode serves pre-built static assets from `dist/public`

**API Structure:**
- Route registration system in `server/routes.ts` (currently minimal)
- `/api` prefix convention for all API routes
- HTTP server creation using Node's native `http` module

**Storage Layer:**
- In-memory storage implementation (`MemStorage`) for development
- Interface-based storage design (`IStorage`) for future database integration

### External Dependencies

**Database (Configured but Not Active):**
- Drizzle ORM v0.39.1 for type-safe database queries
- @neondatabase/serverless v0.10.4 for Postgres connection
- PostgreSQL dialect configured in `drizzle.config.ts`

**UI & Component Libraries:**
- @radix-ui/* packages (v1.x) for accessible UI primitives
- chart.js v4.5.1 for data visualization
- lucide-react for iconography
- react-hook-form with @hookform/resolvers for form handling

**Third-Party Services:**
- Calendly integration for booking calls (referenced in CTA URLs)

**Asset Management:**
- Static assets stored in `attached_assets/` directory
- Property images referenced via `@assets` alias
- AE headshots stored in attached_assets

## Recent Changes

- **Dec 8, 2025**: Converted landing page to template-driven architecture
  - Added ProjectionData interface with all data blocks
  - Implemented getProjectionBySlug() for multi-property support
  - LandingPage now accepts data prop for complete customization
  - Personalized headline uses homeowner's first name
  - Testimonials, comparable properties now data-driven
