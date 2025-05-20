import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      disallow: '/private/',
      userAgent: '*',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
