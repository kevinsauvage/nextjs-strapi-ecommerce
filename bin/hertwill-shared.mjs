#!/usr/bin/env node
/**
 * Shared helpers for the Hertwill -> Shopify import tooling.
 *
 * Used by:
 *   bin/hertwill-catalog.mjs     (enumerate the pet catalog)
 *   bin/hertwill-import.mjs      (import list + sync to Shopify)
 *   bin/shopify-reset-catalog.mjs(wipe the previous catalog)
 *   bin/shopify-curate-pets.mjs  (tag/publish synced products + collections)
 *
 * Credentials are read from `.env.local` and never printed:
 *   HERTWILL_API_KEY                    store-scoped Hertwill key (hw_live_...)
 *   SHOPIFY_ADMIN_URL                   Admin GraphQL endpoint
 *   SHOPIFY_STORE_FRONT_ADMIN_TOKEN     Admin API access token
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import dotenv from 'dotenv';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

export const HERTWILL_BASE = 'https://api.hertwill.com';
export const SHOPIFY_API_VERSION = '2026-07';

export const env = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} in .env.local`);
  }

  return value;
};

export const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return { body: JSON.parse(text), status: response.status };
  } catch {
    return { body: text, status: response.status };
  }
};

/**
 * Hardy fetch with retries for transient failures (429 / 5xx / network).
 * Returns `{ status, body }` so callers can branch on 403/422 statuses.
 */
const request = async (url, options, { attempts = 4 } = {}) => {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`HTTP ${response.status}`);
        const retryAfter = Number(response.headers.get('retry-after')) || 0;
        await sleep(Math.max(retryAfter * 1000, 2 ** attempt * 750));
        continue;
      }

      return await parseResponse(response);
    } catch (error) {
      lastError = error;
      await sleep(2 ** attempt * 750);
    }
  }

  throw lastError ?? new Error('Request failed');
};

export const hertwillRequest = (
  path,
  { method = 'GET', body, key = env('HERTWILL_API_KEY') } = {},
) =>
  request(`${HERTWILL_BASE}${path}`, {
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    method,
  });

export const adminRequest = async (query, variables = {}, { attempts = 6 } = {}) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const { body, status } = await request(env('SHOPIFY_ADMIN_URL'), {
      body: JSON.stringify({ query, variables }),
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': env('SHOPIFY_STORE_FRONT_ADMIN_TOKEN'),
      },
      method: 'POST',
    });

    if (status !== 200) {
      throw new Error(`Admin API responded with HTTP ${status}`);
    }

    const throttled = (body.errors ?? []).some(
      (error) => error.extensions?.code === 'THROTTLED' || /throttl/i.test(error.message ?? ''),
    );

    if (throttled) {
      await sleep(2 ** attempt * 500);
      continue;
    }

    if (body.errors?.length) {
      throw new Error(`Admin API errors: ${JSON.stringify(body.errors)}`);
    }

    return { cost: body.extensions?.cost, data: body.data };
  }

  throw new Error('Admin API kept throttling the request');
};

export const throwOnUserErrors = (result, operation) => {
  const userErrors = result?.userErrors ?? [];

  if (userErrors.length > 0) {
    throw new Error(`${operation} rejected: ${JSON.stringify(userErrors)}`);
  }
};

export const parseArgs = (args) => {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!arg.startsWith('--')) continue;

    const key = arg.slice(2);

    if (['confirm', 'dry-run', 'only-instock', 'all', 'activate'].includes(key)) {
      options[key] = true;
      continue;
    }

    options[key] = args[index + 1];
    index += 1;
  }

  return options;
};

export const readJson = (path) => JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'));

export const writeJson = (path, data) => {
  writeFileSync(resolve(process.cwd(), path), `${JSON.stringify(data, null, 2)}\n`);
};

/* -------------------------------------------------------------------------- */
/* Pricing                                                                     */
/* -------------------------------------------------------------------------- */

export const loadPricing = (path = 'content/hertwill-pricing.json') => readJson(path);

/**
 * Round up to the nearest `X.90` (e.g. 92.4 -> 92.90, 44.95 -> 45.90).
 */
export const roundUpTo90 = (value) => {
  let rounded = Math.floor(value) + 0.9;

  if (rounded < value) rounded += 1;

  return Math.round(rounded * 100) / 100;
};

/**
 * Absolute selling price from a EUR wholesale price using the configured tiers.
 * Always above cost (multipliers are > 1), so the sync never hits PRICE_BELOW_COST.
 */
export const computePrice = (wholesale, pricing) => {
  if (typeof wholesale !== 'number' || !Number.isFinite(wholesale)) {
    throw new Error(`Invalid wholesale price: ${wholesale}`);
  }

  const tier =
    pricing.tiers.find((entry) => entry.max === null || wholesale < entry.max) ??
    pricing.tiers.at(-1);

  return roundUpTo90(wholesale * tier.multiplier);
};

/* -------------------------------------------------------------------------- */
/* Catalog classification (BRAND.md navigation)                                */
/* -------------------------------------------------------------------------- */

const BUCKETS = [
  {
    bucket: 'play',
    label: 'Play & Enrichment',
    pattern: /toy|ball|chew|puzzle|plush|bone|teaser|snack|tree|hammock|tunnel|scratch/i,
  },
  {
    bucket: 'grooming',
    label: 'Care & Grooming',
    pattern: /brush|groom|comb|shampoo|nail|\bcare\b|wipe|\bpaw\b|hygiene|clipper|soap|spray/i,
  },
  {
    bucket: 'feeding',
    label: 'Feeding',
    pattern:
      /\bbowl|\bfeeder|\bfeed|\bfood\b|\btreats?\b|\bwater\b|\bdish|\bstation|\bfountain|\bdrink|\bbuffet\b|\btable\b|\btray\b|\bplate\b|\bcup\b|\bbottle\b/i,
  },
  {
    bucket: 'walk-travel',
    label: 'Walk & Travel',
    pattern:
      /carrier|travel|stroller|car seat|harness|leash|\blead\b|collar|muzzle|\btag\b|chain|backpack|dispenser|waste bag|safety belt|seat belt|poop|\bbag\b/i,
  },
  {
    bucket: 'apparel',
    label: 'Apparel',
    pattern:
      /sweater|sweatshirt|jacket|\bcoat\b|raincoat|dress|shirt|boot|shoe|sock|scarf|warmer|bandana|\brain\b|\bhat\b/i,
  },
  {
    bucket: 'home-comfort',
    label: 'Home & Comfort',
    pattern:
      /\bbed\b|mattress|cushion|nest|sofa|blanket|cave|\bhouse\b|\bmat\b|basket|pillow|throw|\brug\b|\bden\b/i,
  },
];

const has = (value, pattern) => pattern.test(value);

/**
 * Infer the pet type and BRAND.md bucket from a product name.
 * Product names in the Hertwill pet catalog are descriptive enough for this.
 */
export const classify = (name) => {
  const isDog = has(name, /dog|puppy|pup\b/i);
  const isCat = has(name, /cat|kitten|kitten/i);
  const petType = isDog && isCat ? 'dog-cat' : isCat ? 'cat' : isDog ? 'dog' : 'pet';
  const bucket = BUCKETS.find((entry) => entry.pattern.test(name))?.bucket ?? 'accessories';

  return { bucket, petType };
};

export const BUCKET_LABELS = Object.fromEntries(
  BUCKETS.map(({ bucket, label }) => [bucket, label]),
);
