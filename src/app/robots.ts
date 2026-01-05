import type { MetadataRoute } from 'next';

import { getBaseUrl } from '@/lib/server/metadata';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/', // Private user account pages (orders, addresses, wishlist, etc.)
        '/api/', // API routes (not meant for search engines)
        '/search', // Dynamic search pages (not useful for SEO)
        '/cart', // Cart pages are user-specific and not useful for SEO
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
