import * as fs from 'fs';
import { getCollections } from '@/lib/shopify/collection/collectionApiCall';
import config from '@/config/index';

function Sitemap() {
  return null;
}

export const getServerSideProps = async ({ res }) => {
  const BASE_URL = config.baseUrl;

  const staticPaths = fs
    .readdirSync('./src/pages')
    .filter(
      (staticPage) => !['sitemap.xml.js', '404.js', '_app.js', '_document.js', 'api'].includes(staticPage)
    )
    .map((staticPagePath) => `${BASE_URL}/${staticPagePath.replace('.js', '')}`);

  const collections = await getCollections(50);

  const dynamicPaths = collections.map(
    (collection) => `${BASE_URL}/${config.routes.collection}/${collection.handle}`
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
