import type { MetadataRoute } from 'next';

import { sitemap as sitemapConfig } from '@/config';
import { getBaseUrl } from '@/utils/metadata';

const getBaseSitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = getBaseUrl();

  return sitemapConfig.map((item) => {
    const absoluteUrl = item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`;

    return {
      changeFrequency: item.changeFrequency,
      lastModified: item.lastModified,
      priority: item.priority,
      url: absoluteUrl,
    };
  });
};

export default function sitemap(): MetadataRoute.Sitemap {
  return getBaseSitemap();
}
