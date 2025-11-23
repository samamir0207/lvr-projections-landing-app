import { FileText, LineChart, CheckCircle } from "lucide-react";

export default function HowWeBuilt() {
  const steps = [
    {
      icon: FileText,
      title: "Property Details Collected",
      description: "We gathered comprehensive information about your property including size, location, amenities, and unique features."
    },
    {
      icon: LineChart,
      title: "Local Pricing™ Analysis",
      description: "Our proprietary algorithm analyzed comparable properties, market trends, and seasonal demand patterns specific to your area."
    },
    {
      icon: CheckCircle,
      title: "Internal Specialist Validation",
      description: "Our local market experts reviewed and validated the projections to ensure accuracy and market alignment."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background" data-testid="section-how-we-built">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4" data-testid="heading-how-we-built">
          How We Built Your Projection
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our three-step process combines data science with local market expertise
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="text-center"
              data-testid={`step-${index}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3" data-testid={`step-title-${index}`}>
                {step.title}
              </h3>
              <p className="text-muted-foreground" data-testid={`step-description-${index}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
