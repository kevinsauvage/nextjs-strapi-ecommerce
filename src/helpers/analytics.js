// log the pageview with their URL
const pageview = (url) => {
  window.gtag('config', 'Page view', { page_path: url });
};

// log specific events happening.
const event = ({ action, params }) => {
  window.gtag('event', action, params);
};

const analytics = {
  event,
  pageview,
};

export default analytics;
