import * as fs from 'fs';
import config from '@/config';
import { getShopifyClient } from '@/lib/shopify';
import routes from '@/data/routes';

function Sitemap() {
  return null;
}

export const getServerSideProps = async ({ res }) => {
  const BASE_URL = config.baseUrl;

  const staticPaths = fs
    .readdirSync('./src/pages')
    .filter(
      (staticPage) =>
        ![
          'sitemap.xml.js',
          '404.js',
          '_app.js',
          '_document.js',
          'api',
        ].includes(staticPage)
    )
    .map(
      (staticPagePath) => `${BASE_URL}/${staticPagePath.replace('.js', '')}`
    );

  const collections = await getShopifyClient().collection.fetchAll();

  const dynamicPaths = collections.map(
    (collection) => `${BASE_URL}/${routes.base.collection}/${collection.handle}`
  );

  const allPaths = [...staticPaths, ...dynamicPaths];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      // This is where we would be putting in our URLs
      ${allPaths
        .map(
          (url) => `
            <url>
              <loc>${url}</loc>
            </url>
          `
        )
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
