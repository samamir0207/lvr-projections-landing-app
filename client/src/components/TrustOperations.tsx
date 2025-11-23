import { CheckCircle2 } from "lucide-react";

interface TrustOperationsProps {
  pillars: string[];
}

export default function TrustOperations({ pillars }: TrustOperationsProps) {
  return (
    <section className="py-16 md:py-24 bg-card border-y border-border" data-testid="section-trust">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4" data-testid="heading-trust">
          Why Homes Like Yours Earn More With LocalVR
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our comprehensive approach to property management maximizes your revenue while protecting your investment
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 p-6 bg-background rounded-md"
              data-testid={`pillar-${index}`}
            >
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground font-medium" data-testid={`pillar-text-${index}`}>
                {pillar}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
