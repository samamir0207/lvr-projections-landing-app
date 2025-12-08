import { localvrData } from "@shared/localvrData";
import aeHeadshot from "@assets/generated_images/kaci_wolkers_professional_headshot.png";

export default function LandingPage() {
  const { property, projections, trust, cta } = localvrData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
      <div className="max-w-[900px] mx-auto">
        
        {/* Header Section */}
        <section className="bg-[#f7f4f0] px-5 pt-5 pb-4" data-testid="section-header">
          <div className="text-center">
            <img 
              src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/logo02.png" 
              alt="LocalVR Logo" 
              className="mx-auto w-[200px]"
              data-testid="img-logo"
            />
            <div className="mt-8 text-center">
              <p className="text-[18px] font-bold text-[#333333] leading-[27px]" data-testid="text-headline">
                Your Custom Rental Projections Are Ready
              </p>
              <p className="text-[10px] font-bold text-[#333333] leading-[15px]" data-testid="text-subheadline">
                Prepared for you by your local expert {cta.aeName.split(' ')[0]}, using real performance data from homes like yours.
              </p>
            </div>
          </div>
        </section>

        {/* AE Contact Section */}
        <section className="bg-[#f7f4f0] px-5 py-5" data-testid="section-ae-contact">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="flex-shrink-0">
              <img 
                src={aeHeadshot}
                alt={cta.aeName}
                className="w-[119px] h-[119px] object-cover rounded-full"
                data-testid="img-ae-headshot"
              />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-bold text-[#333333] leading-[21px]" data-testid="text-ae-name">
                {cta.aeName}
              </p>
              <p className="text-[10px] font-bold italic text-[#333333] leading-[15px]" data-testid="text-ae-title">
                {cta.aeTitle}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-[10px] text-[#333333] flex items-center gap-2">
                  <img src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/99521615454511536_mhn.png" className="h-[22px]" alt="" />
                  <span>{cta.aePhone}</span>
                </p>
                <p className="text-[10px] text-[#333333] flex items-center gap-2">
                  <img src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/99521615454511536_mhn.png" className="h-[22px]" alt="" />
                  <span>{cta.aeEmail}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#333333] px-5 md:px-[180px] py-5" data-testid="section-stats">
          <div className="flex flex-wrap justify-center gap-8 md:gap-4">
            <div className="text-center w-[108px]">
              <p className="text-[16px] font-bold text-[#d3bda2] leading-[24px]">{trust.stats.homeownerSatisfaction.replace('%', '')}%</p>
              <p className="text-[10px] font-bold text-white leading-[12px]">Homeowner</p>
              <p className="text-[10px] font-bold text-white leading-[12px]">Retention</p>
            </div>
            <div className="text-center w-[108px]">
              <p className="text-[16px] font-bold text-[#d3bda2] leading-[24px]">10+ YEARS</p>
              <p className="text-[10px] font-bold text-white leading-[12px]">Managing High-End</p>
              <p className="text-[10px] font-bold text-white leading-[12px]">Vacation Rentals</p>
            </div>
            <div className="text-center w-[108px]">
              <p className="text-[16px] font-bold text-[#d3bda2] leading-[24px]">1:10 Ratio</p>
              <p className="text-[10px] font-bold text-white leading-[12px]">Home Care Experts to Properties Managed</p>
            </div>
          </div>
        </section>

        {/* Primary CTA */}
        <section className="bg-[#333333] px-5 pb-4" data-testid="section-primary-cta">
          <div className="text-center">
            <a 
              href={cta.scheduleCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#d3bda2] text-[#333333] text-[10px] font-bold py-[10px] px-5 rounded-full leading-[12px]"
              data-testid="button-primary-cta"
            >
              Review My Projection With An Expert
            </a>
          </div>
        </section>

        {/* Projected Earnings Section */}
        <section className="bg-[#f7f4f0] px-5 pt-5" data-testid="section-projection-intro">
          <div className="text-center py-5">
            <p className="text-[16px] font-bold text-[#333333] leading-[19.2px]">
              Your Projected Earnings for
            </p>
            <p className="text-[14px] font-bold italic text-[#d3bda2] leading-[16.8px] mt-1" data-testid="text-property-address">
              {property.address.split(',')[0]}
            </p>
            <p className="text-[10px] font-bold text-[#333333] leading-[12px]" data-testid="text-property-details">
              {property.bedrooms}BR | {property.bathrooms}BA | {property.squareFeet.toLocaleString()} sq ft | {property.market}
            </p>
            <div className="mt-4">
              <p className="text-[10px] text-[#333333] leading-[15px]">
                Based on our revenue experts' analysis, we estimate your home can earn
              </p>
              <p className="text-[10px] text-[#333333] leading-[15px]" data-testid="text-revenue-range">
                {formatCurrency(projections.lowRevenue)} to {formatCurrency(projections.highRevenue)} per year in rental revenue under professional management.
              </p>
            </div>
          </div>
        </section>

        {/* How This Breaks Down */}
        <section className="bg-white px-5 pt-5" data-testid="section-breakdown">
          <div className="text-center">
            <p className="text-[16px] font-bold text-[#333333] leading-[24px]">
              How this projection breaks down
            </p>
          </div>
        </section>

        {/* Three Icons Section */}
        <section className="bg-white px-5 md:px-[150px] py-5" data-testid="section-breakdown-icons">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a06.png" 
                alt="" 
                className="w-[35px] h-auto"
              />
              <p className="text-[10px] text-[#333333] leading-[15px] mt-2 pl-1">
                Built from more than a decade of performance data in your specific local rental market.
              </p>
            </div>
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a04.png" 
                alt="" 
                className="w-[35px] h-auto"
              />
              <p className="text-[10px] text-[#333333] leading-[15px] mt-2 pl-1">
                Built from more than a decade of performance data in your specific local rental market.
              </p>
            </div>
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a05.png" 
                alt="" 
                className="w-[35px] h-auto"
              />
              <p className="text-[10px] text-[#333333] leading-[15px] mt-2 pl-1">
                Built from more than a decade of performance data in your specific local rental market.
              </p>
            </div>
          </div>
        </section>

        {/* Revenue Chart Image */}
        <section className="bg-white" data-testid="section-chart">
          <div className="text-center pb-5">
            <img 
              src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/screenshot_20251207_at_92903am.png" 
              alt="Revenue Chart"
              className="max-w-full h-auto mx-auto"
              data-testid="img-chart"
            />
          </div>
        </section>

        {/* Gold CTA Banner */}
        <section className="bg-[#d3bda2] p-5" data-testid="section-gold-cta">
          <div className="text-center">
            <p className="text-[16px] font-bold text-[#333333] leading-[19.2px] mb-4">
              Want a local expert to walk you through these<br />
              numbers and what they mean for your home?
            </p>
            <a 
              href={cta.scheduleCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#333333] text-[#f7f4f0] text-[10px] font-bold py-[10px] px-5 rounded-full leading-[12px]"
              data-testid="button-gold-cta"
            >
              Review My Projection With An Expert
            </a>
          </div>
        </section>

        {/* Why You Can Trust Section */}
        <section className="bg-white px-5 pt-5" data-testid="section-trust-header">
          <div className="text-center">
            <p className="text-[16px] font-bold text-[#333333] leading-[24px]">
              Why You Can Trust These Projections
            </p>
          </div>
        </section>

        {/* Trust Pillars */}
        <section className="bg-white px-5 md:px-[150px] py-5" data-testid="section-trust-pillars">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a06.png" 
                alt="" 
                className="w-[35px] h-auto"
              />
              <div className="mt-2 pl-1">
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Real Data,</p>
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Not Guesswork</p>
                <p className="text-[10px] text-[#333333] leading-[15px] mt-1">
                  We use anonymized performance data from comparable homes we manage in your market, combined with third-party short-term rental market data.
                </p>
              </div>
            </div>
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a05.png" 
                alt="" 
                className="w-[35px] h-auto"
              />
              <div className="mt-2 pl-1">
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Market-Specific,</p>
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Not Nationwide Averages</p>
                <p className="text-[10px] text-[#333333] leading-[15px] mt-1">
                  Every projection incorporates local demand patterns, seasonality, events, and rate trends for your specific neighborhood.
                </p>
              </div>
            </div>
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a04.png" 
                alt="" 
                className="w-[35px] h-auto"
              />
              <div className="mt-2 pl-1">
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Luxury-Focused</p>
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Approach</p>
                <p className="text-[10px] text-[#333333] leading-[15px] mt-1">
                  Our LocalLuxe program focuses on high-value guests, premium pricing, and protecting your home's long-term value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="bg-[#f7f4f0] px-5 pt-5" data-testid="section-portfolio-header">
          <div className="text-center">
            <p className="text-[16px] font-bold text-[#333333] leading-[19.2px]">
              See Homes Like Yours in Our Collection
            </p>
            <p className="text-[10px] font-bold text-[#333333] leading-[12px]">
              We manage a curated collection of premium and luxury homes in 30A and other premier markets.
            </p>
          </div>
        </section>

        {/* Property Cards */}
        <section className="bg-[#f7f4f0] px-5 md:px-[150px] py-5" data-testid="section-portfolio-cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4">
                <img 
                  src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a_recovered07.jpg" 
                  alt="Property"
                  className="w-full h-auto"
                />
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-[#333333] leading-[15px]">
                    South Lake Escape | Indoor Pool + Movie Theater
                  </p>
                  <p className="text-[10px] text-[#333333] leading-[15px] mt-2">
                    South Lake Tahoe, CA<br />13 bedrooms | 15 bathrooms
                  </p>
                  <p className="text-[10px] text-[#333333] leading-[15px] mt-2 underline">
                    View Luxe Property
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Premier Service Benefits */}
        <section className="bg-[#333333] px-5 pt-5" data-testid="section-benefits-header">
          <div className="text-center">
            <p className="text-[16px] font-bold text-[#d3bda2] leading-[19.2px]">
              How Our Premier Service Benefits Your Home
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="bg-[#333333] px-5 md:px-[150px] py-5" data-testid="section-benefits-grid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a06.png" 
                alt="" 
                className="w-[35px] h-auto"
              />
              <div className="mt-2 pl-1">
                <p className="text-[11px] font-bold text-[#d3bda2] leading-[16.5px]">Dynamic Pricing</p>
                <p className="text-[10px] text-white leading-[15px] mt-1">
                  Our Local Pricing algorithm adjusts rates in real-time based on demand, events, and market conditions.
                </p>
              </div>
            </div>
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a05.png" 
                alt="" 
                className="w-[35px] h-auto"
              />
              <div className="mt-2 pl-1">
                <p className="text-[11px] font-bold text-[#d3bda2] leading-[16.5px]">Guest Screening</p>
                <p className="text-[10px] text-white leading-[15px] mt-1">
                  Three-level vetting process ensures only quality guests stay in your home.
                </p>
              </div>
            </div>
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a04.png" 
                alt="" 
                className="w-[35px] h-auto"
              />
              <div className="mt-2 pl-1">
                <p className="text-[11px] font-bold text-[#d3bda2] leading-[16.5px]">24/7 Support</p>
                <p className="text-[10px] text-white leading-[15px] mt-1">
                  Round-the-clock guest support and owner communication for peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section 
          className="bg-cover bg-center py-[100px] px-5"
          style={{ backgroundImage: 'url(https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/screenshot_20251207_at_84651pm.png)' }}
          data-testid="section-testimonial"
        >
          <div className="text-center">
            <img 
              src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/quote_icon.png" 
              alt="" 
              className="w-[49px] mx-auto mb-4"
            />
            <p className="text-[14px] text-white leading-[21px]">
              "LocalVR has everything those large companies did plus more<br />
              communication, customer service, and care for our home."
            </p>
            <p className="text-[14px] text-white leading-[21px]">- Judy</p>
          </div>
        </section>

        {/* Three Steps Section */}
        <section className="bg-white px-5 pt-5" data-testid="section-steps-header">
          <div className="text-center py-4">
            <p className="text-[16px] font-bold text-[#333333] leading-[19.2px]">
              From Projection to Bookings in Three Simple Steps
            </p>
          </div>
        </section>

        {/* Steps Grid */}
        <section className="bg-white px-5 md:px-[150px] pb-5" data-testid="section-steps-grid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="text-center">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a_recovered18.png" 
                alt="" 
                className="w-[35px] mx-auto"
              />
              <div className="mt-2">
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Review Your</p>
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Plan</p>
                <p className="text-[10px] text-[#333333] leading-[15px] mt-1">
                  We walk through your projection, assumptions, and your goals for the home.
                </p>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a_recovered20.png" 
                alt="" 
                className="w-[35px] mx-auto"
              />
              <div className="mt-2">
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Customize Your</p>
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Strategy</p>
                <p className="text-[10px] text-[#333333] leading-[15px] mt-1">
                  We tailor pricing, guest profile, marketing approach, and owner use around your home.
                </p>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a_recovered21.png" 
                alt="" 
                className="w-[35px] mx-auto"
              />
              <div className="mt-2">
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Locally Supported</p>
                <p className="text-[11px] font-bold text-[#333333] leading-[16.5px]">Launch</p>
                <p className="text-[10px] text-[#333333] leading-[15px] mt-1">
                  Your dedicated local team handles setup, listing, and guest management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AE CTA Section */}
        <section className="bg-[#f7f4f0] px-5 md:px-[110px] py-8" data-testid="section-ae-cta">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img 
              src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/screenshot_20251207_at_85628pm.png" 
              alt="Account Executive"
              className="w-full md:w-[311px]"
            />
            <div className="text-center md:text-left">
              <a 
                href={cta.scheduleCallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#d3bda2] text-[#333333] text-[12px] font-bold py-3 px-6 rounded-full"
                data-testid="button-ae-cta"
              >
                Schedule Your Revenue Review
              </a>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="bg-[#333333] px-5 pt-5" data-testid="section-faqs-header">
          <div className="text-center">
            <p className="text-[16px] font-bold text-[#d3bda2] leading-[24px]">
              FAQS
            </p>
          </div>
        </section>

        {/* FAQ Grid */}
        <section className="bg-[#333333] px-5 md:px-[100px] py-6 pb-10" data-testid="section-faqs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a_recovered.png" 
                alt="" 
                className="w-full"
              />
              <div className="py-2 px-3">
                <p className="text-[10px] font-bold text-white leading-[15px]">How accurate are these projections?</p>
                <p className="text-[10px] text-white leading-[15px] mt-1">
                  Our projections are based on actual performance from comparable homes we manage, plus third-party market data. They are intended to set realistic expectations, not to guarantee a specific outcome.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a_recovered.png" 
                alt="" 
                className="w-full"
              />
              <div className="py-2 px-3">
                <p className="text-[10px] font-bold text-white leading-[15px]">What fees do you charge?</p>
                <p className="text-[10px] text-white leading-[15px] mt-1">
                  We charge a management fee as a percentage of rental revenue. We do not get paid unless you earn rental revenue, which keeps our incentives aligned with yours.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a_recovered.png" 
                alt="" 
                className="w-full"
              />
              <div className="py-2 px-3">
                <p className="text-[10px] font-bold text-white leading-[15px]">How do you protect my home?</p>
                <p className="text-[10px] text-white leading-[15px] mt-1">
                  We use detailed inspections, guest screening, clear house rules, and proactive maintenance. We include $10,000 in damage protection for qualified reservations.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a_recovered.png" 
                alt="" 
                className="w-full"
              />
              <div className="py-2 px-3">
                <p className="text-[10px] font-bold text-white leading-[15px]">Can I still use my home?</p>
                <p className="text-[10px] text-white leading-[15px] mt-1">
                  Absolutely. We work with you to block dates for personal use. Many of our homeowners use their properties regularly while still earning strong rental income.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Footer */}
        <section className="bg-[#f7f4f0] px-5 py-8" data-testid="section-footer">
          <div className="text-center">
            <img 
              src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/logo02.png" 
              alt="LocalVR Logo" 
              className="mx-auto w-[150px] mb-4"
            />
            <p className="text-[10px] text-[#333333] leading-[15px] mb-4">
              {cta.aeName} | {cta.aeTitle}<br />
              {cta.aePhone} | {cta.aeEmail}
            </p>
            <a 
              href={cta.scheduleCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#d3bda2] text-[#333333] text-[10px] font-bold py-[10px] px-5 rounded-full leading-[12px]"
              data-testid="button-footer-cta"
            >
              Schedule Your Revenue Review Call
            </a>
            <p className="text-[8px] text-[#333333] leading-[12px] mt-6">
              © 2025 LocalVR. All rights reserved.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
