import HeroSection from "@/components/HeroSection";
import CredibilityBar from "@/components/CredibilityBar";
import HowWeBuilt from "@/components/HowWeBuilt";
import ProjectionSummary from "@/components/ProjectionSummary";
import SeasonalityTable from "@/components/SeasonalityTable";
import MonthlyRevenueChart from "@/components/MonthlyRevenueChart";
import AINarrative from "@/components/AINarrative";
import TrustOperations from "@/components/TrustOperations";
import CTASection from "@/components/CTASection";
import FooterSection from "@/components/FooterSection";
import { localvrData } from "@shared/localvrData";

export default function LandingPage() {
  const { property, projections, seasonality, monthlyRevenue, aiNarrativePlaceholders, trust, cta } = localvrData;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection 
        address={property.address}
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        squareFeet={property.squareFeet}
        ctaUrl={cta.scheduleCallUrl}
      />

      <CredibilityBar 
        homeownerSatisfaction={trust.stats.homeownerSatisfaction}
        guestReviews={trust.stats.guestReviews}
        higherRevenue={trust.stats.higherRevenue}
        localTeam={trust.stats.localTeam}
      />

      <HowWeBuilt />

      <ProjectionSummary 
        expectedRevenue={projections.expectedRevenue}
        highRevenue={projections.highRevenue}
        lowRevenue={projections.lowRevenue}
        disclaimer={projections.disclaimer}
        ctaUrl={cta.scheduleCallUrl}
      />

      <SeasonalityTable 
        peak={seasonality.peak}
        winter={seasonality.winter}
        highDemand={seasonality.highDemand}
        highShoulder={seasonality.highShoulder}
        lowShoulder={seasonality.lowShoulder}
      />

      <MonthlyRevenueChart monthlyRevenue={monthlyRevenue} />

      <AINarrative 
        summary={aiNarrativePlaceholders.summary}
        insights={aiNarrativePlaceholders.insights}
        optimizationTips={aiNarrativePlaceholders.optimizationTips}
      />

      <TrustOperations pillars={trust.pillars} />

      <CTASection ctaUrl={cta.scheduleCallUrl} />

      <FooterSection 
        aeName={cta.aeName}
        aeTitle={cta.aeTitle}
        aePhone={cta.aePhone}
        aeEmail={cta.aeEmail}
        ctaUrl={cta.scheduleCallUrl}
      />
    </div>
  );
}
