declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

interface TrackingContext {
  slug?: string;
  aeSlug?: string;
  lid?: string;
  campaign?: string;
  src?: string;
}

let trackingContext: TrackingContext = {};
let pageLoadTime: number | null = null;
let hasTrackedTimeOnPage = false;

export function initializeTracking(context: TrackingContext) {
  trackingContext = context;
  pageLoadTime = Date.now();
  hasTrackedTimeOnPage = false;
  
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
  
  trackPageView();
  setupTimeOnPageTracking();
  setupVisibilityTracking();
}

export function trackPageView() {
  pushToDataLayer({
    event: "projection_page_view",
    ...trackingContext
  });
  
  sendToServer({
    event: "projection_page_view",
    ...trackingContext
  });
}

export function trackInteraction(action: string, label: string, additionalMeta?: Record<string, unknown>) {
  const eventData = {
    event: "projection_interaction",
    action,
    label,
    ...trackingContext,
    meta: additionalMeta
  };
  
  pushToDataLayer(eventData);
  
  sendToServer({
    event: "projection_interaction",
    ...trackingContext,
    meta: {
      action,
      label,
      ...additionalMeta
    }
  });
}

export function trackCTAClick(ctaType: string) {
  trackInteraction("cta_click", ctaType);
}

export function trackFormSubmit(formData?: Record<string, unknown>) {
  const eventData = {
    event: "projection_form_submit",
    ...trackingContext,
    meta: formData
  };
  
  pushToDataLayer(eventData);
  
  sendToServer({
    event: "projection_form_submit",
    ...trackingContext,
    meta: formData
  });
}

export function trackTimeOnPage(durationSeconds: number) {
  if (hasTrackedTimeOnPage) return;
  hasTrackedTimeOnPage = true;
  
  const eventData = {
    event: "projection_time_on_page",
    ...trackingContext,
    durationSeconds
  };
  
  pushToDataLayer(eventData);
  
  sendToServer({
    event: "projection_time_on_page",
    ...trackingContext,
    meta: { durationSeconds }
  });
}

function setupTimeOnPageTracking() {
  setTimeout(() => {
    if (pageLoadTime) {
      const duration = Math.round((Date.now() - pageLoadTime) / 1000);
      trackTimeOnPage(duration);
    }
  }, 30000);
}

function setupVisibilityTracking() {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && pageLoadTime && !hasTrackedTimeOnPage) {
      const duration = Math.round((Date.now() - pageLoadTime) / 1000);
      if (duration >= 5) {
        trackTimeOnPage(duration);
      }
    }
  });
  
  window.addEventListener('beforeunload', () => {
    if (pageLoadTime && !hasTrackedTimeOnPage) {
      const duration = Math.round((Date.now() - pageLoadTime) / 1000);
      if (duration >= 5) {
        const eventData = {
          event: "projection_time_on_page",
          ...trackingContext,
          meta: { durationSeconds: duration }
        };
        
        const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });
        navigator.sendBeacon('/api/events', blob);
      }
    }
  });
}

function pushToDataLayer(data: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }
}

async function sendToServer(data: Record<string, unknown>) {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.warn('Failed to send analytics event:', error);
  }
}
