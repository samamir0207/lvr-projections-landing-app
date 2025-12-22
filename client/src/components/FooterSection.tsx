import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";

interface FooterSectionProps {
  aeName: string;
  aeTitle: string;
  aePhone: string;
  aeEmail: string;
  aeHeadshotUrl?: string;
  ctaUrl: string;
}

export default function FooterSection({ aeName, aeTitle, aePhone, aeEmail, aeHeadshotUrl, ctaUrl }: FooterSectionProps) {
  return (
    <footer className="py-16 bg-background border-t border-border" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
              <img 
                src={aeHeadshotUrl || "/assets/ae-headshot-default.png"}
                alt={aeName}
                className="w-full h-full object-cover object-center"
                data-testid="img-ae-headshot"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="text-ae-name">
                {aeName}
              </h3>
              <p className="text-muted-foreground mb-4" data-testid="text-ae-title">
                {aeTitle}
              </p>
              <div className="space-y-2">
                <a 
                  href={`tel:${aePhone}`} 
                  className="flex items-center gap-2 text-foreground hover-elevate active-elevate-2 p-2 rounded-md"
                  data-testid="link-ae-phone"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{aePhone}</span>
                </a>
                <a 
                  href={`mailto:${aeEmail}`} 
                  className="flex items-center gap-2 text-foreground hover-elevate active-elevate-2 p-2 rounded-md"
                  data-testid="link-ae-email"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{aeEmail}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <Button 
              size="lg"
              className="text-base font-semibold px-8"
              asChild
              data-testid="button-cta-footer"
            >
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                Schedule Your Call
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-8">
              © 2025 LocalVR. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
