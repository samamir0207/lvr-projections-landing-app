# LocalVR Revenue Projections Landing Page

## Overview

This is a single-page application that generates custom vacation rental revenue projections for LocalVR properties. The application displays property details, annual revenue projections with low/high estimates, monthly revenue breakdowns, seasonal performance data, and trust-building content to encourage prospective clients to book a consultation call.

The application is built as a marketing landing page that presents data-driven revenue projections in a premium, clean aesthetic aligned with LocalVR's brand identity.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- Single font family (Inter) with varied weights for hierarchy
- Color palette: Charcoal gray (#636466) for text, Gold (#d4bda2) for accents/CTAs
- Consistent spacing units using Tailwind (4, 6, 8, 12, 16, 20)
- Component-based architecture with reusable UI elements in `/client/src/components`

**State & Data Management:**
- Static JSON data stored in `shared/localvrData.ts` for property and projection information
- No API calls currently - all data is hardcoded for demonstration purposes
- Client-side only rendering with no server-side state

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
- User schema defined but not actively used in current implementation

**Environment & Configuration:**
- Environment-based configuration (NODE_ENV)
- Database URL configuration present but not utilized (prepared for future use)
- Drizzle ORM configuration pointing to PostgreSQL (setup ready but not active)

### External Dependencies

**Database (Configured but Not Active):**
- Drizzle ORM v0.39.1 for type-safe database queries
- @neondatabase/serverless v0.10.4 for Postgres connection
- PostgreSQL dialect configured in `drizzle.config.ts`
- Schema defined in `shared/schema.ts` with user table
- Note: Database is configured but the application currently uses in-memory storage

**UI & Component Libraries:**
- @radix-ui/* packages (v1.x) for accessible UI primitives
- chart.js v4.5.1 for data visualization
- lucide-react for iconography
- react-hook-form with @hookform/resolvers for form handling
- date-fns v3.6.0 for date manipulation
- class-variance-authority and clsx for dynamic class composition

**Development Tools:**
- Replit-specific plugins for enhanced development experience
- TypeScript for type safety across the stack
- ESBuild for production bundling
- PostCSS with Tailwind and Autoprefixer

**Third-Party Services:**
- Calendly integration for booking calls (referenced in CTA URLs)
- Google Fonts for Inter font family

**Asset Management:**
- Static assets stored in `attached_assets/` directory
- Generated images (e.g., AE headshots) referenced from `@assets` alias
- Vite aliases configured for clean imports (@, @shared, @assets)