# LocalVR Revenue Projections Landing Page - Design Guidelines

## Brand Identity

**Typography:**
- Font Family: Inter (single font family throughout)
- Use varied weights for hierarchy (Regular, Medium, Semibold, Bold)

**Color Palette:**
- Primary Text: Charcoal Gray (#636466)
- Accent/CTA: Gold (#d4bda2)
- Backgrounds: White
- CTA Section Background: Charcoal Gray (#636466) with white text
- Chart Bars: Gold (#d4bda2)
- Chart Labels: Charcoal Gray (#636466)

**Design Philosophy:**
Premium, clean, data-focused aesthetic that communicates trust and sophistication.

## Layout System

**Spacing:** Use consistent Tailwind units of 4, 6, 8, 12, 16, 20 for padding and margins (p-4, py-12, mb-8, etc.)

**Container Widths:**
- Max-width: 7xl for main content sections
- Full-width for CTA sections with inner containers

## Section Structure (Exact Order)

### 1. Hero Section
- Property address as prominent headline
- Property stats (beds/baths/sqft) displayed inline with icons
- Main headline: "Your Custom Vacation Rental Revenue Projection"
- Subheadline: "Powered by Local Pricing™, the engine trusted by 500+ luxury homeowners."
- Gold CTA button: "Schedule Your Revenue Review Call"
- Clean layout, no background image, white background

### 2. Quick Credibility Bar
- Single horizontal row with 4 stats
- Icons with stat numbers and labels
- Stats: 98% Homeowner Satisfaction | 10,000+ Guest Reviews | 25% Higher Revenue | Local Team Available
- Charcoal icons, gold accent on hover

### 3. How We Built Your Projection
- Three-column grid (responsive: stack on mobile)
- Icon + Title + Description for each step:
  1. Property Details Collected
  2. Local Pricing™ Analysis
  3. Internal Specialist Validation
- Gold icons with charcoal text

### 4. Projection Summary
- Large, prominent revenue numbers in gold
- Expected Revenue (center, largest)
- High Revenue and Low Revenue (flanking)
- Include disclaimer text below in smaller charcoal text
- Gold CTA button: "Schedule Your Revenue Review Call"

### 5. Seasonality Performance Table
- Clean white table with gold header row
- Columns: Season | Days Booked | Days Available | Occupancy % | ADR
- Rows: Peak, Winter, High Demand, High Shoulder, Low Shoulder
- Alternating subtle row backgrounds for readability
- Mobile: horizontal scroll or stacked card layout

### 6. Monthly Revenue Chart
- Full-width chart container
- Gold bars for each month (Jan-Dec)
- Charcoal axis labels and gridlines
- Responsive canvas sizing
- Y-axis shows revenue values, X-axis shows month abbreviations

### 7. AI Narrative
- Three distinct sections with headings:
  1. Summary (placeholder text for AI-generated content)
  2. Key Insights (placeholder text)
  3. Optimization Opportunities (placeholder text)
- Each section in its own container with subtle visual separation
- Use placeholder text like "AI-generated summary will appear here..."

### 8. Trust & Operations Section
- Heading: "Why Homes Like Yours Earn More With LocalVR"
- Grid layout (2-3 columns on desktop, 1 on mobile)
- 7 pillars with small gold icons:
  - Local Pricing™ dynamic algorithm
  - Local operations team in every market
  - 24/7 guest support
  - Hotel-grade housekeeping
  - Three-tier inspection
  - Three-level guest vetting
  - Owner performance portal with real-time insights

### 9. Large CTA Section
- Full-width charcoal (#636466) background
- White text with generous padding (py-20)
- Headline: "Ready to See How Much More Your Home Can Earn?"
- Large gold button: "Book Your Revenue Review Call"
- Center-aligned content

### 10. Footer
- Two-column layout (stacks on mobile)
- Left: AE headshot (circular), name, title, phone, email
- Right: Final CTA button
- Charcoal text on white background
- Professional, clean spacing

## Component Specifications

**Buttons:**
- Gold background (#d4bda2)
- Charcoal text (#636466)
- Rounded corners (rounded-lg)
- Generous padding (px-8 py-4)
- Hover state: slightly darker gold
- Font weight: Semibold

**Icons:**
- Use Heroicons via CDN
- Gold for accents and credibility markers
- Charcoal for informational icons

**Tables:**
- Clean borders with subtle charcoal strokes
- Gold header row with white text
- Alternating row backgrounds (white and very light gray)

**Chart (Chart.js):**
- Bar chart type
- Gold bars with slight transparency
- Charcoal gridlines and labels
- Responsive configuration

## Images

**AE Headshot:**
- Location: Footer section, left column
- Style: Circular crop, professional presentation
- Size: 150px diameter on desktop, 120px on mobile
- Border: Subtle gold border (2px)

**No Hero Image:** This design uses a clean, text-based hero without background imagery to maintain focus on data and projections.

## Responsive Behavior

- Desktop (lg): Full multi-column layouts
- Tablet (md): 2-column grids, reduced spacing
- Mobile (base): Single column, stacked sections, horizontal scroll for table

**Critical Breakpoints:**
- Credibility bar: 4 columns → 2 columns → stacked
- Projection summary: 3 across → stacked
- Seasonality table: Horizontal scroll or card view on mobile
- Trust pillars: 3 columns → 2 columns → 1 column