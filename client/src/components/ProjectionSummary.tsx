import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ProjectionSummaryProps {
  expectedRevenue: number;
  highRevenue: number;
  lowRevenue: number;
  disclaimer: string;
  ctaUrl: string;
}

export default function ProjectionSummary({ expectedRevenue, highRevenue, lowRevenue, disclaimer, ctaUrl }: ProjectionSummaryProps) {
  return (
    <section className="py-16 md:py-24 bg-card border-y border-border" data-testid="section-projection-summary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4" data-testid="heading-projection">
          Annual Revenue Projection
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Based on current market conditions and historical performance data
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center" data-testid="projection-low">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Conservative</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-foreground" data-testid="value-low">
              ${lowRevenue.toLocaleString()}
            </div>
          </div>

          <div className="text-center" data-testid="projection-expected">
            <div className="mb-2">
              <span className="text-sm font-semibold text-primary">Expected Revenue</span>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2" data-testid="value-expected">
              ${expectedRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">per year</div>
          </div>

          <div className="text-center" data-testid="projection-high">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Optimistic</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-foreground" data-testid="value-high">
              ${highRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center mb-8 max-w-3xl mx-auto" data-testid="text-disclaimer">
          {disclaimer}
        </p>

        <div className="text-center">
          <Button 
            size="lg"
            className="text-base font-semibold px-8"
            asChild
            data-testid="button-cta-projection"
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
