'use client';

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'consent' | 'set' | 'js',
      targetIdOrEventName: string,
      configOrParams?: Record<string, unknown>,
    ) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Client-side analytics utilities
 * Google Analytics and Google Tag Manager integration
 */

/**
 * Helper to safely execute gtag callback if gtag is available
 * Used for consent updates and GA4 direct integration
 */
export const withGtag = (callback: (gtag: NonNullable<Window['gtag']>) => void): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    callback(window.gtag);
  }
};

/**
 * Push event to dataLayer (GTM standard approach)
 * This is the recommended way to send events to Google Tag Manager
 */
const pushToDataLayer = (data: Record<string, unknown>): void => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

/**
 * Track pageview
 * Uses GTM dataLayer (recommended) or gtag as fallback
 */
const pageview = (url?: string | URL): void => {
  const pagePath =
    url?.toString() || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');

  pushToDataLayer({
    event: 'page_view',
    page_path: pagePath,
  });

  withGtag((gtag) => {
    gtag('event', 'page_view', { page_path: pagePath });
  });
};

/**
 * Track custom event
 * Uses GTM dataLayer (recommended) or gtag as fallback
 */
const event = ({
  action,
  params,
}: {
  action: string;
  params?: Record<string, unknown>;
}): void => {
  pushToDataLayer({
    event: action,
    ...params,
  });

  withGtag((gtag) => {
    gtag('event', action, params);
  });
};

const analytics = {
  event,
  pageview,
  pushToDataLayer,
};

export default analytics;

