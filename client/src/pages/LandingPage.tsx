import { localvrData } from "@shared/localvrData";
import aeHeadshot from "@assets/generated_images/kaci_wolkers_professional_headshot.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function LandingPage() {
  const { property, projections, trust, cta, monthlyRevenue, seasonalBreakdown } = localvrData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = {
    labels: monthlyRevenue.map(m => m.month),
    datasets: [
      {
        label: 'Low Estimate',
        data: monthlyRevenue.map(m => m.low),
        backgroundColor: '#d3bda2',
        borderRadius: 2,
      },
      {
        label: 'High Estimate',
        data: monthlyRevenue.map(m => m.high),
        backgroundColor: '#333333',
        borderRadius: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: { dataset: { label: string }; parsed: { y: number } }) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#333333',
          font: {
            size: 11,
          }
        }
      },
      y: {
        grid: {
          color: '#e5e5e5',
          drawBorder: false,
        },
        ticks: {
          color: '#333333',
          font: {
            size: 11,
          },
          callback: function(value: number) {
            return '$' + (value / 1000) + 'k';
          }
        },
        max: 25000,
      }
    }
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
              <p className="text-[22px] font-bold text-[#333333] leading-[30px]" data-testid="text-headline">
                Your Custom Rental Projections Are Ready
              </p>
              <p className="text-[14px] font-bold text-[#333333] leading-[21px]" data-testid="text-subheadline">
                Prepared for you by your local expert {cta.aeName.split(' ')[0]}, using real performance data from homes like yours.
              </p>
            </div>
          </div>
        </section>

        {/* AE Contact Section */}
        <section className="bg-[#f7f4f0] px-5 py-5" data-testid="section-ae-contact">
          <div className="flex flex-col md:flex-row items-center justify-center gap-5">
            <div className="flex-shrink-0">
              <img 
                src={aeHeadshot}
                alt={cta.aeName}
                className="w-[119px] h-[119px] object-cover rounded-full"
                data-testid="img-ae-headshot"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[14px] font-bold text-[#333333] leading-[21px]" data-testid="text-ae-name">
                {cta.aeName}
              </p>
              <p className="text-[10px] font-bold italic text-[#333333] leading-[15px]" data-testid="text-ae-title">
                {cta.aeTitle}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-[10px] text-[#333333] flex items-center justify-center md:justify-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                    <path d="M12 18h.01"/>
                  </svg>
                  <span>{cta.aePhone}</span>
                </p>
                <a 
                  href={`mailto:${cta.aeEmail}`}
                  className="text-[10px] text-[#333333] flex items-center justify-center md:justify-start gap-2 hover:underline"
                  data-testid="link-ae-email"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span>{cta.aeEmail}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#333333] px-5 py-8" data-testid="section-stats">
          <div className="flex flex-wrap justify-center items-start w-full pl-8">
            <div className="text-center px-6 md:px-10">
              <p className="text-[20px] font-bold text-[#d3bda2] leading-[28px]">{trust.stats.homeownerSatisfaction.replace('%', '')}%</p>
              <p className="text-[12px] font-bold text-white leading-[16px]">Homeowner</p>
              <p className="text-[12px] font-bold text-white leading-[16px]">Retention</p>
            </div>
            <div className="hidden md:block w-[1px] h-[60px] bg-[#d3bda2]/50"></div>
            <div className="text-center px-6 md:px-10">
              <p className="text-[20px] font-bold text-[#d3bda2] leading-[28px]">10+ Years</p>
              <p className="text-[12px] font-bold text-white leading-[16px]">Managing High-End</p>
              <p className="text-[12px] font-bold text-white leading-[16px]">Vacation Rentals</p>
            </div>
            <div className="hidden md:block w-[1px] h-[60px] bg-[#d3bda2]/50"></div>
            <div className="text-center px-6 md:px-10">
              <p className="text-[20px] font-bold text-[#d3bda2] leading-[28px]">1:10 Ratio</p>
              <p className="text-[12px] font-bold text-white leading-[16px]">Home Care Experts to</p>
              <p className="text-[12px] font-bold text-white leading-[16px]">Properties Managed</p>
            </div>
          </div>
        </section>

        {/* Primary CTA */}
        <section className="bg-[#333333] px-5 pb-6 pt-2" data-testid="section-primary-cta">
          <div className="flex justify-center">
            <a 
              href={cta.scheduleCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#d3bda2] text-[#333333] text-[12px] font-bold py-[12px] px-6 rounded-full leading-[14px]"
              data-testid="button-primary-cta"
            >
              Review My Projections Now
            </a>
          </div>
        </section>

        {/* Projected Earnings Section */}
        <section className="bg-[#f7f4f0] px-5 py-10" data-testid="section-projection-intro">
          <div className="text-center max-w-[600px] mx-auto">
            <p className="text-[20px] font-bold text-[#333333] leading-[28px]">
              Your Projected Earnings for
            </p>
            <p className="text-[18px] font-bold italic text-[#d3bda2] leading-[24px] mt-2" data-testid="text-property-address">
              {property.address.split(',')[0]}
            </p>
            <p className="text-[13px] text-[#333333]/70 leading-[18px] mt-1" data-testid="text-property-details">
              {property.bedrooms} Bedrooms | {property.bathrooms} Bathrooms | {property.squareFeet.toLocaleString()} sq ft
            </p>
            
            <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
              <p className="text-[13px] text-[#333333] leading-[20px]">
                Based on our revenue experts' analysis, we estimate your home can earn
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="text-[28px] font-bold text-[#d3bda2]" data-testid="text-low-revenue">{formatCurrency(projections.lowRevenue)}</span>
                <span className="text-[16px] text-[#333333]/60">to</span>
                <span className="text-[28px] font-bold text-[#d3bda2]" data-testid="text-high-revenue">{formatCurrency(projections.highRevenue)}</span>
              </div>
              <p className="text-[13px] text-[#333333] leading-[20px] mt-2">
                per year in rental revenue under LocalVR's professional management.
              </p>
            </div>
          </div>
        </section>

        {/* How This Breaks Down - Side by Side Layout */}
        <section className="bg-white px-5 md:px-8 py-10" data-testid="section-breakdown">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Title and Icons */}
            <div className="md:w-[220px] flex-shrink-0">
              <p className="text-[22px] font-bold text-[#333333] leading-[30px] mb-8">
                How This Projection Breaks Down
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <img 
                    src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a06.png" 
                    alt="" 
                    className="w-[28px] h-auto flex-shrink-0 mt-1"
                  />
                  <p className="text-[13px] text-[#333333] leading-[20px]">
                    Built from more than a decade of performance data in your specific local rental market.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <img 
                    src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a04.png" 
                    alt="" 
                    className="w-[28px] h-auto flex-shrink-0 mt-1"
                  />
                  <p className="text-[13px] text-[#333333] leading-[20px]">
                    Powered by LocalVR's proprietary Local Pricing algorithm for dynamic rate optimization.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <img 
                    src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a05.png" 
                    alt="" 
                    className="w-[28px] h-auto flex-shrink-0 mt-1"
                  />
                  <p className="text-[13px] text-[#333333] leading-[20px]">
                    Seasonal demand patterns analyzed for peak, shoulder, and off-peak periods.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Chart and Table */}
            <div className="flex-1" data-testid="section-chart">
              {/* Bar Chart */}
              <div className="h-[280px] mb-8">
                <Bar data={chartData} options={chartOptions as any} />
              </div>
              
              {/* Seasonal Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]" data-testid="table-seasonal">
                  <thead>
                    <tr className="border-b border-[#333333]">
                      <th className="text-left py-2 pr-2 font-bold text-[#333333]"></th>
                      {seasonalBreakdown.map((season) => (
                        <th key={season.key} className="text-center py-2 px-2 font-bold text-[#333333]">
                          <div>{season.label}</div>
                          <div className="font-normal text-[10px] text-[#333333]/60 italic">{season.subtitle}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#e5e5e5]">
                      <td className="py-3 pr-2 font-bold text-[#333333]">Days Booked</td>
                      {seasonalBreakdown.map((season) => (
                        <td key={season.key} className="text-center py-3 px-2 text-[#333333]">
                          {season.daysBookedMin}-{season.daysBookedMax}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-[#e5e5e5]">
                      <td className="py-3 pr-2 font-bold text-[#333333]">Days Available</td>
                      {seasonalBreakdown.map((season) => (
                        <td key={season.key} className="text-center py-3 px-2 text-[#333333]">
                          {season.daysAvailable}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-[#e5e5e5]">
                      <td className="py-3 pr-2 font-bold text-[#333333]">Occupancy</td>
                      {seasonalBreakdown.map((season) => (
                        <td key={season.key} className="text-center py-3 px-2 text-[#333333]">
                          {season.occupancyMinPct}% - {season.occupancyMaxPct}%
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 font-bold text-[#333333]">Average Daily Rate</td>
                      {seasonalBreakdown.map((season) => (
                        <td key={season.key} className="text-center py-3 px-2 text-[#333333]">
                          ${season.adrMin.toLocaleString()} - ${season.adrMax.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Disclaimer */}
              <p className="text-[9px] text-[#333333]/60 leading-[14px] mt-6 text-center">
                Projections are estimates based on historical performance in comparable homes and current market conditions. Actual performance may vary due to home condition, regulations, owner use, pricing decisions, and broader market trends. This is not a financial guarantee.
              </p>
            </div>
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
              Review My Projections Now
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
