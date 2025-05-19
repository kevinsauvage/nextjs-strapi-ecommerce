import type { MetadataRoute } from 'next';

import { sitemap as sitemapConfig } from '@/config';

const getBaseSitemap = () => {
  return sitemapConfig.map((item) => ({
    changeFrequency: item.changeFrequency,
    lastModified: item.lastModified,
    priority: item.priority,
    url: item.url,
  }));
};

export default function sitemap(): MetadataRoute.Sitemap {
  return getBaseSitemap();
}
