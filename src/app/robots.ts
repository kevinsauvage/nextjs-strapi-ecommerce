import type { MetadataRoute } from 'next';

import { getBaseUrl } from '@/utils/metadata';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      allow: '/',
      disallow: '/private/',
      userAgent: '*',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
