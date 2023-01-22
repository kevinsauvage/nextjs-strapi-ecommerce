import * as fs from 'fs';
import config from '@/config/index';
import { getSitemap } from '@/lib/shopify/collection/collectionApiCall';

function Sitemap() {
  return {};
}

export const getServerSideProps = async ({ res }) => {
  const BASE_URL = config.baseUrl;
  const EXCLUDE_PAGES = ['sitemap.xml.js', '404.js', '_app.js', '_document.js', 'api'];
  const FOLDERS = { development: './src/pages', production: './' };
  const folder = FOLDERS[process.env.NODE_ENV];

  // Get all static paths
  const staticPaths = fs
    .readdirSync(folder)
    .filter((page) => !EXCLUDE_PAGES.includes(page))
    .map((page) => `${BASE_URL}/${page.replace('.js', '')}`);

  // Get all dynamic paths
  const collections = await getSitemap(100);

  // Get all product paths
  const dynamicPaths = collections?.reduce((acc, collection) => {
    acc.push(`${BASE_URL}${config.routes.collection}/${collection.handle}`);
    collection.products.forEach((product) =>
      acc.push(`${BASE_URL}${config.routes.collection}/${collection.handle}/${product.handle}`)
    );
    return acc;
  }, []);

  // Combine all paths
  const allPaths = [...staticPaths, ...dynamicPaths];

  // Create sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map(
          (url) => `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `
        )
        .join('')}
    </urlset>
  `;

  // Send sitemap as response
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
