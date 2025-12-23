import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useEffect, useRef } from "react";
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
  const errorReported = useRef(false);
  
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
  
  useEffect(() => {
    if ((error || (data && !data.ok)) && !errorReported.current) {
      errorReported.current = true;
      fetch('/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aeSlug,
          slug,
          attemptedUrl: window.location.href,
          userAgent: navigator.userAgent,
          referer: document.referrer
        })
      }).catch(() => {});
    }
  }, [error, data, aeSlug, slug]);
  
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
          <img 
            src="https://xjsfpg.stripocdn.email/content/guids/CABINET_a1666b788af88a208e34207cc9ca2dc1fa9d52d87d5c599e0f5fb4629c86f99a/images/logo02.png" 
            alt="LocalVR Logo" 
            className="mx-auto w-[120px] mb-8"
          />
          <h1 className="text-2xl font-bold text-[#333333] mb-4">We Ran Into an Issue</h1>
          <p className="text-[#333333]/70 mb-6">
            Sorry, we couldn't load this page. Please reach out to your LocalVR representative for assistance.
          </p>
          <p className="text-[#333333]/50 text-sm">
            Our team has been notified about this issue.
          </p>
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
