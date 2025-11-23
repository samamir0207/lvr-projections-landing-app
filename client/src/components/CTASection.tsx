import { Button } from "@/components/ui/button";

interface CTASectionProps {
  ctaUrl: string;
}

export default function CTASection({ ctaUrl }: CTASectionProps) {
  return (
    <section className="py-20 md:py-32 bg-foreground" data-testid="section-cta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background mb-6" data-testid="heading-cta">
          Ready to See How Much More Your Home Can Earn?
        </h2>
        <p className="text-lg md:text-xl text-background/80 mb-8">
          Schedule a call with our local team to discuss your property's potential
        </p>
        <Button 
          size="lg"
          className="text-base font-semibold px-10 py-6 text-lg"
          asChild
          data-testid="button-cta-main"
        >
          <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
            Book Your Revenue Review Call
          </a>
        </Button>
      </div>
    </section>
  );
}
