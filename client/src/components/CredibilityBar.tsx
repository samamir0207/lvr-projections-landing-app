import { Star, MessageSquare, TrendingUp, MapPin } from "lucide-react";

interface CredibilityBarProps {
  homeownerSatisfaction: string;
  guestReviews: string;
  higherRevenue: string;
  localTeam: boolean;
}

export default function CredibilityBar({ homeownerSatisfaction, guestReviews, higherRevenue, localTeam }: CredibilityBarProps) {
  const stats = [
    { icon: Star, label: "Homeowner Satisfaction", value: homeownerSatisfaction },
    { icon: MessageSquare, label: "Guest Reviews", value: guestReviews },
    { icon: TrendingUp, label: "Higher Revenue", value: higherRevenue },
    { icon: MapPin, label: "Local Team", value: localTeam ? "Available" : "N/A" }
  ];

  return (
    <section className="bg-card py-12 border-y border-border" data-testid="section-credibility">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center"
              data-testid={`stat-${index}`}
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1" data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
