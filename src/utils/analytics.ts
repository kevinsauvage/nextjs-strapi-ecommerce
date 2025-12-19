declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
  }
}

export const withGtag = (callback: (gtag: NonNullable<Window['gtag']>) => void): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    callback(window.gtag);
  }
};

const pageview = (
  url: string | URL | undefined = window.location.pathname + window.location.search,
) => {
  withGtag((gtag) => {
    gtag('config', 'Page view', { page_path: url });
  });
};

const event = ({ action, params }: { action: string; params?: Record<string, unknown> }) => {
  withGtag((gtag) => {
    gtag('event', action, params);
  });
};

const analytics = {
  event,
  pageview,
};

export default analytics;
