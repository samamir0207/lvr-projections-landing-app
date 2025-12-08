# LocalVR Revenue Projections Landing Page

## Overview

This is a template-driven single-page application that generates custom vacation rental revenue projections for LocalVR properties. The application displays property details, annual revenue projections with low/high estimates, monthly revenue breakdowns, seasonal performance data, and trust-building content to encourage prospective clients to book a consultation call.

The application is built as a marketing landing page template that can render any property whose data is provided via JSON, presenting data-driven revenue projections in a premium, clean aesthetic aligned with LocalVR's brand identity.

## User Preferences

Preferred communication style: Simple, everyday language.

## Template System

### ProjectionData Interface

The application uses a strongly-typed `ProjectionData` interface defined in `shared/schema.ts` that includes:

- **meta**: Slug, homeowner first name, homeowner full name
- **property**: Address, bedrooms, bathrooms, square feet, city, state, market
- **projections**: Expected, low, and high revenue estimates with disclaimer
- **monthlyRevenue**: Array of monthly low/high revenue data
- **seasonalBreakdown**: Seasonal performance metrics
- **trust**: Company stats and value pillars
- **cta**: Account executive info (name, title, phone, email, Calendly URL)
- **testimonials**: Array of homeowner testimonials
- **benefits**: Service benefits with icons
- **comparableProperties**: Similar properties in the portfolio

### Data Loading

- `shared/localvrData.ts` exports:
  - `getProjectionBySlug(slug)`: Returns ProjectionData by URL slug
  - `getDefaultProjection()`: Returns default sample data
  - `localvrData`: Direct access to sample data

### Adding New Properties

To add a new property projection:
1. Create a new ProjectionData object with all required fields
2. Add it to the `projectionsMap` in `shared/localvrData.ts`
3. The page will automatically render with the new data when accessed

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
