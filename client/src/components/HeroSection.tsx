import { Home, Bed, Bath, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  ctaUrl: string;
}

export default function HeroSection({ address, bedrooms, bathrooms, squareFeet, ctaUrl }: HeroSectionProps) {
  return (
    <section className="bg-background py-16 md:py-24" data-testid="section-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground" data-testid="text-property-address">
              {address}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2" data-testid="text-bedrooms">
              <Bed className="w-4 h-4" />
              <span>{bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2" data-testid="text-bathrooms">
              <Bath className="w-4 h-4" />
              <span>{bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-2" data-testid="text-sqft">
              <Maximize className="w-4 h-4" />
              <span>{squareFeet.toLocaleString()} sqft</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="heading-main">
            Your Custom Vacation Rental Revenue Projection
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="text-subheadline">
            Powered by Local Pricing™, the engine trusted by 500+ luxury homeowners.
          </p>

          <Button 
            size="lg"
            className="text-base font-semibold px-8"
            asChild
            data-testid="button-cta-hero"
          >
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              Schedule Your Revenue Review Call
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
