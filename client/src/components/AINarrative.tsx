import { Sparkles, Lightbulb, Target } from "lucide-react";

interface AINarrativeProps {
  summary: string;
  insights: string;
  optimizationTips: string;
}

export default function AINarrative({ summary, insights, optimizationTips }: AINarrativeProps) {
  const sections = [
    {
      icon: Sparkles,
      title: "Market Summary",
      content: summary,
      testId: "summary"
    },
    {
      icon: Lightbulb,
      title: "Key Insights",
      content: insights,
      testId: "insights"
    },
    {
      icon: Target,
      title: "Optimization Opportunities",
      content: optimizationTips,
      testId: "optimization"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background" data-testid="section-ai-narrative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4" data-testid="heading-ai-narrative">
          Expert Analysis
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Deep insights into your property's revenue potential
        </p>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="bg-card p-8 rounded-md border border-card-border"
              data-testid={`narrative-${section.testId}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3" data-testid={`narrative-title-${section.testId}`}>
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`narrative-content-${section.testId}`}>
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
