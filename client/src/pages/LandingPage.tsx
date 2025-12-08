import { useState } from "react";
import { localvrData } from "@shared/localvrData";
import aeHeadshot from "@assets/generated_images/kaci_wolkers_professional_headshot.png";
import property1Image from "@assets/17_(1)_1765163999447.jpg";
import property2Image from "@assets/14_1765164174413.jpg";
import property3Image from "@assets/IMG_2398_(1)_1765164502296.jpg";
import { UserCheck, ShieldCheck, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
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

const testimonials = [
  {
    quote: "Switching to LocalVR was the best decision we've made. Their local team is responsive, proactive, and truly cares about our home.",
    name: "Marc"
  },
  {
    quote: "You weren't one of the big companies. You were growing, but still small enough to feel personal.",
    name: "Beth"
  },
  {
    quote: "I'm very impressed with LocalVR's ability to generate revenue. They have exceeded my expectations and I not only cover the mortgage and expenses, but I am cash-flowing significantly more on this property than I would with other property managers.",
    name: "Lucy"
  }
];

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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

        {/* Combined Projected Earnings & Breakdown Section */}
        <section className="bg-[#f7f4f0] px-5 md:px-8 py-10" data-testid="section-projection-breakdown">
          {/* Unified Projections Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Card Header with Property Info */}
            <div className="text-center py-8 px-6 border-b border-[#e5e5e5]">
              <p className="text-[22px] font-bold text-[#333333] leading-[30px]">
                Your Projected Earnings for
              </p>
              <p className="text-[20px] font-bold italic text-[#d3bda2] leading-[28px] mt-2" data-testid="text-property-address">
                {property.address.split(',')[0]}
              </p>
              <p className="text-[13px] text-[#333333]/70 leading-[18px] mt-1" data-testid="text-property-details">
                {property.bedrooms} Bedrooms | {property.bathrooms} Bathrooms | {property.squareFeet.toLocaleString()} sq ft
              </p>
            </div>
            
            {/* Revenue Estimate Highlight */}
            <div className="text-center py-6 px-6 bg-[#333333]">
              <p className="text-[13px] text-white/80 mb-2">Estimated Annual Revenue</p>
              <div className="inline-flex items-center gap-3">
                <span className="text-[28px] font-bold text-[#d3bda2]" data-testid="text-low-revenue">{formatCurrency(projections.lowRevenue)}</span>
                <span className="text-[16px] text-white/60">to</span>
                <span className="text-[28px] font-bold text-[#d3bda2]" data-testid="text-high-revenue">{formatCurrency(projections.highRevenue)}</span>
              </div>
            </div>
            
            {/* Chart and Table Content */}
            <div className="p-6">
              <div data-testid="section-chart">
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
                        <td key={season.key} className="text-center py-3 px-2 text-[#333333] whitespace-nowrap">
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
        <section className="bg-white px-5 pt-8" data-testid="section-trust-header">
          <div className="text-center">
            <p className="text-[22px] font-bold text-[#333333] leading-[30px]">
              Why You Can Trust These Projections
            </p>
          </div>
        </section>

        {/* Trust Pillars */}
        <section className="bg-white px-5 md:px-[100px] py-8" data-testid="section-trust-pillars">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a06.png" 
                alt="" 
                className="w-[40px] h-auto"
              />
              <div className="mt-3 pl-1">
                <p className="text-[14px] font-bold text-[#333333] leading-[20px]">Real Data,</p>
                <p className="text-[14px] font-bold text-[#333333] leading-[20px]">Not Guesswork</p>
                <p className="text-[12px] text-[#333333] leading-[18px] mt-2">
                  We use anonymized performance data from comparable homes we manage in your market, combined with third-party short-term rental market data.
                </p>
              </div>
            </div>
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a05.png" 
                alt="" 
                className="w-[40px] h-auto"
              />
              <div className="mt-3 pl-1">
                <p className="text-[14px] font-bold text-[#333333] leading-[20px]">Market-Specific,</p>
                <p className="text-[14px] font-bold text-[#333333] leading-[20px]">Not Nationwide Averages</p>
                <p className="text-[12px] text-[#333333] leading-[18px] mt-2">
                  Every projection incorporates local demand patterns, seasonality, events, and rate trends for your specific neighborhood.
                </p>
              </div>
            </div>
            <div className="text-left">
              <img 
                src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/rental_projection_ready_page_1262025a04.png" 
                alt="" 
                className="w-[40px] h-auto"
              />
              <div className="mt-3 pl-1">
                <p className="text-[14px] font-bold text-[#333333] leading-[20px]">Luxury-Focused</p>
                <p className="text-[14px] font-bold text-[#333333] leading-[20px]">Approach</p>
                <p className="text-[12px] text-[#333333] leading-[18px] mt-2">
                  Our LocalLuxe program focuses on high-value guests, premium pricing, and protecting your home's long-term value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="bg-[#f7f4f0] px-5 pt-10" data-testid="section-portfolio-header">
          <div className="text-center">
            <p className="text-[20px] font-bold text-[#333333] leading-[24px]">
              See Homes Like Yours in Our Collection
            </p>
            <p className="text-[13px] text-[#333333] leading-[16px] mt-2">
              We manage a curated collection of premium and luxury homes across the Emerald Coast.
            </p>
          </div>
        </section>

        {/* Property Cards */}
        <section className="bg-[#f7f4f0] px-5 md:px-[100px] py-8" data-testid="section-portfolio-cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Property 1 */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <img 
                src={property1Image}
                alt="8BR Escape with Pool, Hot Tub and Game Room"
                className="w-full h-auto rounded"
              />
              <div className="mt-4">
                <p className="text-[14px] font-bold text-[#333333] leading-[18px]">
                  8BR Escape with Pool, Hot Tub and Game Room
                </p>
                <p className="text-[13px] text-[#333333]/70 leading-[18px] mt-3">
                  Destin, FL<br />8 bedrooms | 8.5 bathrooms
                </p>
                <a 
                  href="https://stay.golocalvr.com/property/67546fef23c1900012d5832c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#d3bda2] font-medium leading-[18px] mt-3 underline block hover:text-[#333333] transition-colors"
                >
                  View Property
                </a>
              </div>
            </div>
            
            {/* Property 2 */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <img 
                src={property3Image}
                alt="New 30A Retreat Beach Access"
                className="w-full h-auto rounded"
              />
              <div className="mt-4">
                <p className="text-[14px] font-bold text-[#333333] leading-[18px]">
                  New 30A Retreat Beach Access Hot Tub & Guest Suite
                </p>
                <p className="text-[13px] text-[#333333]/70 leading-[18px] mt-3">
                  Seacrest Beach, FL<br />6 bedrooms | 6.5 bathrooms
                </p>
                <a 
                  href="https://stay.golocalvr.com/property/67fff22502fdee0013294d94"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#d3bda2] font-medium leading-[18px] mt-3 underline block hover:text-[#333333] transition-colors"
                >
                  View Property
                </a>
              </div>
            </div>
            
            {/* Property 3 */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <img 
                src={property2Image}
                alt="Gulf Coast Retreat with Pool"
                className="w-full h-auto rounded"
              />
              <div className="mt-4">
                <p className="text-[14px] font-bold text-[#333333] leading-[18px]">
                  Gulf Coast Retreat with Pool &lt; 1 Mile to Beach
                </p>
                <p className="text-[13px] text-[#333333]/70 leading-[18px] mt-3">
                  Blue Mountain Beach, FL<br />4 bedrooms | 4 bathrooms
                </p>
                <a 
                  href="https://stay.golocalvr.com/property/674e3ee2acd0240012a693d3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#d3bda2] font-medium leading-[18px] mt-3 underline block hover:text-[#333333] transition-colors"
                >
                  View Property
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Premier Service Benefits - Cream Background */}
        <section className="bg-[#f7f4f0] px-5 pt-12 pb-8" data-testid="section-benefits-header">
          <div className="text-center mb-8">
            <p className="text-[20px] font-bold text-[#333333] leading-[24px]">
              How Our Premier Service Benefits Your Home
            </p>
          </div>
          
          {/* Benefits Grid */}
          <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="section-benefits-grid">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f7f4f0] flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-[#d3bda2]" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] font-bold text-[#333333] leading-[18px] mb-2">Elite Guest Matchmaking</p>
              <p className="text-[13px] text-[#333333]/70 leading-[18px]">
                We rigorously screen and match guests so your home is occupied by respectful, high-value travelers who treat it like their own.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f7f4f0] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-[#d3bda2]" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] font-bold text-[#333333] leading-[18px] mb-2">Premium Home Protection</p>
              <p className="text-[13px] text-[#333333]/70 leading-[18px]">
                We prioritize your home's long-term value with detailed inspections, proactive maintenance coordination, and $10,000 in damage protection per reservation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f7f4f0] flex items-center justify-center">
                <SlidersHorizontal className="w-7 h-7 text-[#d3bda2]" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] font-bold text-[#333333] leading-[18px] mb-2">Tailored Management for Your Home</p>
              <p className="text-[13px] text-[#333333]/70 leading-[18px]">
                Your home and goals are unique. We tailor pricing, marketing, and owner use to your specific property, rather than forcing it into a generic template.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonial Carousel Section - Elegant Card Style */}
        <section className="bg-[#f7f4f0] px-5 pb-12" data-testid="section-testimonial">
          <div className="max-w-[700px] mx-auto">
            <div className="bg-[#333333] rounded-lg p-8 md:p-10 text-center">
              {/* Quote icon */}
              <div className="mb-4">
                <span className="text-[50px] text-[#d3bda2] leading-none font-serif">"</span>
              </div>
              
              {/* Testimonial content */}
              <div className="min-h-[100px] flex flex-col justify-center">
                <p className="text-[15px] md:text-[16px] text-white leading-[24px] italic mb-4">
                  {testimonials[currentTestimonial].quote}
                </p>
                <p className="text-[14px] text-[#d3bda2] font-bold">
                  - {testimonials[currentTestimonial].name}
                </p>
              </div>
              
              {/* Navigation dots */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button 
                  onClick={() => setCurrentTestimonial((prev) => prev === 0 ? testimonials.length - 1 : prev - 1)}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  data-testid="button-testimonial-prev"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-[#d3bda2]' : 'bg-white/30'
                      }`}
                      data-testid={`button-testimonial-dot-${index}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={() => setCurrentTestimonial((prev) => prev === testimonials.length - 1 ? 0 : prev + 1)}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  data-testid="button-testimonial-next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
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
