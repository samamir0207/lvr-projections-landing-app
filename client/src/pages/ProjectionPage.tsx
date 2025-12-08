import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import LandingPage from "./LandingPage";
import type { ProjectionData } from "@shared/schema";

interface UrlParams {
  lid?: string;
  src?: string;
  campaign?: string;
}

function parseUrlParams(): UrlParams {
  const params = new URLSearchParams(window.location.search);
  return {
    lid: params.get("lid") || undefined,
    src: params.get("src") || undefined,
    campaign: params.get("campaign") || undefined
  };
}

export default function ProjectionPage() {
  const [, params] = useRoute("/:aeSlug/:slug");
  const [, setLocation] = useLocation();
  
  const aeSlug = params?.aeSlug || "";
  const slug = params?.slug || "";
  const urlParams = parseUrlParams();
  
  const { data, isLoading, error } = useQuery<{ ok: boolean; data: ProjectionData }>({
    queryKey: ['/api/projections', aeSlug, slug],
    queryFn: async () => {
      const response = await fetch(`/api/projections/${aeSlug}/${slug}`);
      if (!response.ok) {
        throw new Error("Projection not found");
      }
      return response.json();
    },
    enabled: !!aeSlug && !!slug
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f4f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d3bda2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#333333] text-lg">Loading your projection...</p>
        </div>
      </div>
    );
  }
  
  if (error || !data?.ok || !data?.data) {
    return (
      <div className="min-h-screen bg-[#f7f4f0] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-3xl font-bold text-[#333333] mb-4">Projection Not Found</h1>
          <p className="text-[#333333]/70 mb-8">
            We couldn't find the projection you're looking for. Please check the link and try again.
          </p>
          <button
            onClick={() => setLocation("/")}
            className="bg-[#d3bda2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#c4a88f] transition-colors"
            data-testid="button-go-home"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <LandingPage 
      data={data.data} 
      urlParams={urlParams}
    />
  );
}
