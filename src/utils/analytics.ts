// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
  }
}

// log the pageview with their URL
const pageview = (
  url: string | URL | undefined = window.location.pathname + window.location.search,
) => {
  window.gtag('config', 'Page view', { page_path: url });
};

const event = ({ action, params }: { action: string; params?: Record<string, unknown> }) => {
  window.gtag('event', action, params);
};

const analytics = {
  event,
  pageview,
};

export default analytics;
