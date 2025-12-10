import type { Metadata } from 'next';

import siteMetadata from '@/data/siteMetadata';

type MetadataOptions = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
};

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false,
}: MetadataOptions): Metadata {
  const siteUrl = siteMetadata.siteUrl;
  const fullTitle = `${title} | ${siteMetadata.companyName}`;
  const imageUrl = image || siteMetadata.siteLogo;
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: siteMetadata.companyName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: siteMetadata.twitterHandle,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
