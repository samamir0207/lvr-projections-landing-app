import { useState, useEffect } from "react";
import { getDefaultProjection, getMarketCodeFromLvrId, MARKET_FORM_IMAGES } from "@shared/localvrData";
import type { ProjectionData } from "@shared/schema";
import { initializeTracking, trackCTAClick, trackFormSubmit, trackInteraction } from "@/lib/analytics";
import property1Image from "@assets/17_(1)_1765163999447.jpg";
import property2Image from "@assets/14_1765164174413.jpg";
import property3Image from "@assets/IMG_2398_(1)_1765164502296.jpg";
import defaultFormImage from "@assets/104_(1)_1765166534372.jpg";
import { UserCheck, ShieldCheck, SlidersHorizontal, ChevronLeft, ChevronRight, TrendingUp, MapPin, Gem } from "lucide-react";
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

interface UrlParams {
  lid?: string;
  src?: string;
  campaign?: string;
}

interface LandingPageProps {
  data?: ProjectionData;
  urlParams?: UrlParams;
}

export default function LandingPage({ data, urlParams = {} }: LandingPageProps) {
  const projectionData = data || getDefaultProjection();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    propertyAddress: '',
    comments: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { meta, property, projections, trust, cta, monthlyRevenue, seasonalBreakdown, testimonials, comparableProperties } = projectionData;
  
  // Get market-specific form image based on property's LVR ID
  const marketCode = getMarketCodeFromLvrId(property.internalId || "");
  const formImage = MARKET_FORM_IMAGES[marketCode] || defaultFormImage;
  
  useEffect(() => {
    initializeTracking({
      slug: meta.slug,
      aeSlug: cta.aeSlug,
      lid: urlParams.lid,
      campaign: urlParams.campaign,
      src: urlParams.src
    });
  }, [meta.slug, cta.aeSlug, urlParams]);
  
  const propertyImages: Record<string, string> = {
    property1: property1Image,
    property2: property2Image,
    property3: property3Image
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.propertyAddress) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          message: formData.comments,
          slug: meta.slug,
          aeId: cta.aeId,
          aeEmail: cta.aeEmail,
          leadId: urlParams.lid,
          campaign: urlParams.campaign
        })
      });
      
      if (response.ok) {
        trackFormSubmit({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email
        });
        setFormSubmitted(true);
      } else {
        setFormError('There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      setFormError('There was an error submitting your request. Please try again.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  };

  const formatRevenueRounded = (value: number) => {
    const rounded = Math.round(value / 1000) * 1000;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rounded);
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
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 20,
          font: {
            size: 11,
          },
          color: '#333333',
        },
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
                {meta.homeownerFirstName}, Your Custom Rental Projections Are Ready
              </p>
              <p className="text-[14px] font-bold text-[#333333] leading-[21px]" data-testid="text-subheadline">
                Prepared for you by your local expert {cta.aeName.split(' ')[0]}, using real performance data from homes like yours.
              </p>
            </div>
          </div>
        </section>

        {/* AE Contact Section */}
        <section className="bg-[#f7f4f0] px-5 py-6" data-testid="section-ae-contact">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex-shrink-0 w-[160px] h-[160px] rounded-full overflow-hidden">
              <img 
                src={cta.aeHeadshotUrl || "/assets/ae-headshot-default.png"}
                alt={cta.aeName}
                className="w-full h-full object-cover object-center"
                data-testid="img-ae-headshot"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[22px] font-bold text-[#333333] leading-[28px]" data-testid="text-ae-name">
                {cta.aeName}
              </p>
              <p className="text-[16px] font-bold italic text-[#333333] leading-[22px]" data-testid="text-ae-title">
                {cta.aeTitle}
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-[15px] text-[#333333] flex items-center justify-center md:justify-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                    <path d="M12 18h.01"/>
                  </svg>
                  <span>{cta.aePhone}</span>
                </p>
                <a 
                  href={`mailto:${cta.aeEmail}`}
                  className="text-[15px] text-[#333333] flex items-center justify-center md:justify-start gap-3 hover:underline"
                  data-testid="link-ae-email"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <p className="text-[28px] font-bold text-[#d3bda2] leading-[36px]">{trust.stats.homeownerSatisfaction.replace('%', '')}%</p>
              <p className="text-[14px] font-bold text-white leading-[20px]">Homeowner</p>
              <p className="text-[14px] font-bold text-white leading-[20px]">Retention</p>
            </div>
            <div className="hidden md:block w-[1px] h-[70px] bg-[#d3bda2]/50"></div>
            <div className="text-center px-6 md:px-10">
              <p className="text-[28px] font-bold text-[#d3bda2] leading-[36px]">10+ Years</p>
              <p className="text-[14px] font-bold text-white leading-[20px]">Managing High-End</p>
              <p className="text-[14px] font-bold text-white leading-[20px]">Vacation Rentals</p>
            </div>
            <div className="hidden md:block w-[1px] h-[70px] bg-[#d3bda2]/50"></div>
            <div className="text-center px-6 md:px-10">
              <p className="text-[28px] font-bold text-[#d3bda2] leading-[36px]">1:10 Ratio</p>
              <p className="text-[14px] font-bold text-white leading-[20px]">Home Care Experts to</p>
              <p className="text-[14px] font-bold text-white leading-[20px]">Properties Managed</p>
            </div>
          </div>
        </section>

        {/* Primary CTA */}
        <section className="bg-[#333333] px-5 pb-6 pt-2" data-testid="section-primary-cta">
          <div className="flex justify-center">
            <a 
              href="#contact-form"
              className="inline-block bg-[#d3bda2] text-[#333333] text-[12px] font-bold py-[12px] px-6 rounded-full leading-[14px]"
              data-testid="button-primary-cta"
              onClick={() => trackCTAClick("hero_primary_cta")}
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
                {property.bedrooms} Bedrooms | {property.bathrooms} Bathrooms{property.squareFeet ? ` | ${property.squareFeet.toLocaleString()} sq ft` : ''}
              </p>
            </div>
            
            {/* Revenue Estimate Highlight */}
            <div className="text-center py-6 px-6 bg-[#333333]">
              <p className="text-[13px] text-white/80 mb-2">Estimated Annual Revenue</p>
              <div className="inline-flex items-center gap-3">
                <span className="text-[28px] font-bold text-[#d3bda2]" data-testid="text-low-revenue">{formatRevenueRounded(projections.lowRevenue)}</span>
                <span className="text-[16px] text-white/60">to</span>
                <span className="text-[28px] font-bold text-[#d3bda2]" data-testid="text-high-revenue">{formatRevenueRounded(projections.highRevenue)}</span>
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
                          {Math.round(season.occupancyMinPct)}% - {Math.round(season.occupancyMaxPct)}%
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 font-bold text-[#333333]">Average Daily Rate</td>
                      {seasonalBreakdown.map((season) => (
                        <td key={season.key} className="text-center py-3 px-2 text-[#333333] whitespace-nowrap">
                          ${Math.round(season.adrMin).toLocaleString()} - ${Math.round(season.adrMax).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Disclaimer */}
              <p className="text-[9px] text-[#333333]/60 leading-[14px] mt-6 text-center">
                The projections prepared above are an evaluation of the rental revenue, less cleaning fees, this property has the potential to earn as a year round vacation rental. These projections are based on the historical performance of comparable vacation rental properties. Actual performance can vary from these projections due to factors which LocalVR cannot control including, but not limited to, owner use, the property's condition, regulatory changes, economic trends, and environmental conditions. LocalVR makes no representations or warranties, express or implied, about the accuracy of these projections. These projections should not be the sole factor in any financial decisions.
              </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gold CTA Banner */}
        <section className="bg-[#d3bda2] py-8 px-5" data-testid="section-gold-cta">
          <div className="text-center">
            <p className="text-[18px] font-bold text-[#333333] leading-[24px] mb-5">
              Want a local expert to walk you through these<br />
              numbers and what they mean for your home?
            </p>
            <a 
              href="#contact-form"
              className="inline-block bg-[#333333] text-[#f7f4f0] text-[14px] font-bold py-3 px-8 rounded-full"
              data-testid="button-gold-cta"
              onClick={() => trackCTAClick("gold_banner_cta")}
            >
              Review My Projections Now
            </a>
          </div>
        </section>

        {/* Why You Can Trust Section */}
        <section className="bg-white px-5 pt-12 pb-8" data-testid="section-trust-header">
          <div className="text-center mb-8">
            <p className="text-[20px] font-bold text-[#333333] leading-[24px]">
              Why You Can Trust These Projections
            </p>
          </div>
          
          {/* Trust Pillars */}
          <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="section-trust-pillars">
            <div className="bg-[#f7f4f0] p-6 rounded-lg text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-[#d3bda2]" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] font-bold text-[#333333] leading-[18px] mb-2">Real Data, Not Guesswork</p>
              <p className="text-[13px] text-[#333333]/70 leading-[18px]">
                We use anonymized performance data from comparable homes we manage in your market, combined with third-party short-term rental market data.
              </p>
            </div>
            <div className="bg-[#f7f4f0] p-6 rounded-lg text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <MapPin className="w-7 h-7 text-[#d3bda2]" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] font-bold text-[#333333] leading-[18px] mb-2">Market-Specific, Not Nationwide Averages</p>
              <p className="text-[13px] text-[#333333]/70 leading-[18px]">
                Every projection incorporates local demand patterns, seasonality, events, and rate trends for your specific neighborhood.
              </p>
            </div>
            <div className="bg-[#f7f4f0] p-6 rounded-lg text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <Gem className="w-7 h-7 text-[#d3bda2]" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] font-bold text-[#333333] leading-[18px] mb-2">Luxury-Focused Approach</p>
              <p className="text-[13px] text-[#333333]/70 leading-[18px]">
                Our luxury program focuses on high-value guests, premium pricing, and protecting your home's long-term value.
              </p>
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
        <section className="bg-[#f7f4f0] px-5 md:px-[40px] py-10" data-testid="section-portfolio-cards">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {comparableProperties.map((comp, index) => (
              <div key={index} className="bg-white p-7 rounded-lg shadow-sm flex flex-col">
                <img 
                  src={propertyImages[comp.image] || property1Image}
                  alt={comp.title}
                  className="w-full h-[260px] object-cover rounded-md"
                />
                <div className="mt-6 flex flex-col flex-1">
                  <p className="text-[17px] font-bold text-[#333333] leading-[24px] min-h-[48px]">
                    {comp.title}
                  </p>
                  <p className="text-[15px] text-[#333333]/70 leading-[22px] mt-3">
                    {comp.location}<br />{comp.bedrooms} bedrooms | {comp.bathrooms} bathrooms
                  </p>
                  <a 
                    href={comp.propertyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-[#d3bda2] font-medium leading-[22px] mt-auto pt-5 underline block hover:text-[#333333] transition-colors"
                    data-testid={`link-property-${index}`}
                  >
                    View Property
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Premier Service Benefits - Cream Background */}
        <section className="bg-[#f7f4f0] px-5 pt-6 pb-8" data-testid="section-benefits-header">
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
                We prioritize your home's long-term value with detailed inspections, proactive maintenance coordination, and up to $10,000 in damage protection per reservation.
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
        <section className="bg-[#f7f4f0] px-5 pt-4 pb-12" data-testid="section-testimonial">
          <div className="max-w-[700px] mx-auto">
            <p className="text-[20px] font-bold text-[#333333] leading-[24px] text-center mb-6">
              Hear What Our Homeowners Have to Say
            </p>
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

        {/* Contact Form Section */}
        <section id="contact-form" className="bg-[#f7f4f0] px-5 md:px-[60px] py-12" data-testid="section-contact-form">
          <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-stretch gap-10">
            {/* Home Image */}
            <div className="w-full md:w-1/2">
              <img 
                src={formImage}
                alt="Luxury vacation rental with pool"
                className="w-full h-full object-cover rounded-lg shadow-md min-h-[400px]"
              />
            </div>
            
            {/* Contact Form */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg shadow-sm p-8 h-full">
                <h3 className="text-[20px] font-bold text-[#333333] mb-6">
                  Schedule Your Revenue Review
                </h3>
                
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#d3bda2]/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#d3bda2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[16px] font-bold text-[#333333] mb-2">Thank You!</p>
                    <p className="text-[14px] text-[#333333]/70">
                      We've received your information and will be in touch shortly to schedule your revenue review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    {formError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-[13px]">
                        {formError}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-medium text-[#333333] mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:border-[#d3bda2] focus:ring-1 focus:ring-[#d3bda2]"
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-[#333333] mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:border-[#d3bda2] focus:ring-1 focus:ring-[#d3bda2]"
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-medium text-[#333333] mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:border-[#d3bda2] focus:ring-1 focus:ring-[#d3bda2]"
                        data-testid="input-phone"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-medium text-[#333333] mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:border-[#d3bda2] focus:ring-1 focus:ring-[#d3bda2]"
                        data-testid="input-email"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-medium text-[#333333] mb-1">
                        Rental Property Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="propertyAddress"
                        value={formData.propertyAddress}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:border-[#d3bda2] focus:ring-1 focus:ring-[#d3bda2]"
                        data-testid="input-property-address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-medium text-[#333333] mb-1">
                        Comments
                      </label>
                      <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleFormChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:border-[#d3bda2] focus:ring-1 focus:ring-[#d3bda2] resize-none"
                        data-testid="input-comments"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-[#333333] text-white text-[14px] font-bold py-3 px-6 rounded-full hover:bg-[#444444] transition-colors"
                      data-testid="button-submit-form"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="bg-[#333333] px-5 pt-8" data-testid="section-faqs-header">
          <div className="text-center">
            <p className="text-[22px] font-bold text-[#d3bda2] leading-[28px]">
              FAQ's
            </p>
          </div>
        </section>

        {/* FAQ Grid */}
        <section className="bg-[#333333] px-5 md:px-[100px] py-8 pb-12" data-testid="section-faqs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="py-3 px-4">
              <p className="text-[15px] font-bold text-[#d3bda2] leading-[20px] mb-2">How accurate are these projections?</p>
              <p className="text-[14px] text-white/90 leading-[20px]">
                Our projections are based on actual performance from comparable homes we manage, plus third-party market data. They are intended to set realistic expectations, not to guarantee a specific outcome.
              </p>
            </div>
            <div className="py-3 px-4">
              <p className="text-[15px] font-bold text-[#d3bda2] leading-[20px] mb-2">What fees do you charge?</p>
              <p className="text-[14px] text-white/90 leading-[20px]">
                We charge a management fee as a percentage of rental revenue. We do not get paid unless you earn rental revenue, which keeps our incentives aligned with yours.
              </p>
            </div>
            <div className="py-3 px-4">
              <p className="text-[15px] font-bold text-[#d3bda2] leading-[20px] mb-2">How do you protect my home?</p>
              <p className="text-[14px] text-white/90 leading-[20px]">
                We use detailed inspections, guest screening, clear house rules, and proactive maintenance. We include $10,000 in damage protection for qualified reservations.
              </p>
            </div>
            <div className="py-3 px-4">
              <p className="text-[15px] font-bold text-[#d3bda2] leading-[20px] mb-2">Can I still use my home?</p>
              <p className="text-[14px] text-white/90 leading-[20px]">
                Absolutely. We work with you to block dates for personal use. Many of our homeowners use their properties regularly while still earning strong rental income.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Footer */}
        <section className="bg-[#f7f4f0] px-5 py-10" data-testid="section-footer">
          <div className="text-center">
            <img 
              src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/logo02.png" 
              alt="LocalVR Logo" 
              className="mx-auto w-[150px] mb-5"
            />
            <p className="text-[14px] text-[#333333] leading-[20px] mb-5">
              {cta.aeName} | {cta.aeTitle}<br />
              {cta.aePhone} | {cta.aeEmail}
            </p>
            <a 
              href="#contact-form"
              className="inline-block bg-[#d3bda2] text-[#333333] text-[14px] font-bold py-3 px-6 rounded-full"
              data-testid="button-footer-cta"
              onClick={() => trackCTAClick("footer_primary_cta")}
            >
              Schedule My Revenue Review Call Now
            </a>
            <p className="text-[11px] text-[#333333] leading-[16px] mt-8">
              © 2025 LocalVR. All rights reserved.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
