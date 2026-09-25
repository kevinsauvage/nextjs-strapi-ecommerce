#!/usr/bin/env node
/**
 * Shopify metaobject helper (Admin API) — manage the storefront CMS sections
 * read by `src/lib/server/cmsSections.ts`.
 *
 * Sections:
 *   - hero_section   (handle: home-hero)   homepage hero override
 *   - promo_bar      (handle: promo-bar)   header announcement bar
 *   - size_chart     (handle: size-chart)  product-page size chart
 *   - faq_section    (handle: home-faq)    FAQ heading/intro
 *   - faq_item       (one per question)    FAQ accordion entries
 *
 * Values come from `.env.local` (`SHOPIFY_ADMIN_URL` +
 * `SHOPIFY_STORE_FRONT_ADMIN_TOKEN`) and are never printed.
 *
 * Usage:
 *   node bin/shopify-sections.mjs list
 *   node bin/shopify-sections.mjs ensure
 *   node bin/shopify-sections.mjs seed [--manifest content/sections.json]
 *
 * `ensure` creates missing definitions with storefront `PUBLIC_READ` access.
 * `seed` upserts one metaobject per section (and one per FAQ item), so the
 * Storefront API can read them immediately. Re-running seed is safe.
 *
 * Note: `ensure` does not modify an existing definition's fields. If you add a
 * field, update it in Admin (or extend this script) before seeding.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import dotenv from 'dotenv';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const ADMIN_URL = process.env.SHOPIFY_ADMIN_URL;
const ADMIN_TOKEN = process.env.SHOPIFY_STORE_FRONT_ADMIN_TOKEN;

if (!ADMIN_URL || !ADMIN_TOKEN) {
  console.error(
    'Missing SHOPIFY_ADMIN_URL or SHOPIFY_STORE_FRONT_ADMIN_TOKEN in .env.local. ' +
      'See .env.example (Admin API section).',
  );
  process.exit(2);
}

const field = (key, name, type, required = false) => ({ key, name, required, type });

/** Definition specs. Field keys are the snake_case keys the app reads. */
const DEFINITIONS = [
  {
    fields: [
      field('eyebrow', 'Eyebrow', 'single_line_text_field'),
      field('heading', 'Heading', 'single_line_text_field'),
      field('subheading', 'Subheading', 'multi_line_text_field'),
      field('image', 'Image URL', 'single_line_text_field'),
      field('image_alt', 'Image alt text', 'single_line_text_field'),
      field('primary_label', 'Primary CTA label', 'single_line_text_field'),
      field('primary_url', 'Primary CTA URL', 'single_line_text_field'),
      field('secondary_label', 'Secondary CTA label', 'single_line_text_field'),
      field('secondary_url', 'Secondary CTA URL', 'single_line_text_field'),
    ],
    name: 'Hero section',
    type: 'hero_section',
  },
  {
    fields: [
      field('text', 'Text', 'single_line_text_field', true),
      field('link_label', 'Link label', 'single_line_text_field'),
      field('link_url', 'Link URL', 'single_line_text_field'),
      field('tone', 'Tone (ink|gold|neutral)', 'single_line_text_field'),
      field('active', 'Active', 'boolean'),
    ],
    name: 'Promo bar',
    type: 'promo_bar',
  },
  {
    fields: [
      field('title', 'Title', 'single_line_text_field'),
      field('body', 'Body (HTML)', 'multi_line_text_field'),
      field('note', 'Footnote', 'single_line_text_field'),
    ],
    name: 'Size chart',
    type: 'size_chart',
  },
  {
    fields: [
      field('title', 'Title', 'single_line_text_field'),
      field('intro', 'Intro', 'multi_line_text_field'),
    ],
    name: 'FAQ section',
    type: 'faq_section',
  },
  {
    fields: [
      field('question', 'Question', 'single_line_text_field', true),
      field('answer', 'Answer', 'multi_line_text_field'),
      field('position', 'Position', 'number_integer'),
    ],
    name: 'FAQ item',
    type: 'faq_item',
  },
];

const adminRequest = async (query, variables = {}) => {
  const response = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': ADMIN_TOKEN },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Admin API responded with HTTP ${response.status}`);
  }

  const payload = await response.json();

  if (payload.errors?.length) {
    throw new Error(`Admin API errors: ${JSON.stringify(payload.errors)}`);
  }

  return payload.data;
};

const throwOnUserErrors = (result, operation) => {
  const userErrors = result?.userErrors ?? [];

  if (userErrors.length > 0) {
    throw new Error(`${operation} rejected: ${JSON.stringify(userErrors)}`);
  }
};

const getDefinition = async (type) => {
  const data = await adminRequest(
    `query GetDef($type: String!) { metaobjectDefinitionByType(type: $type) { id name type } }`,
    { type },
  );

  return data.metaobjectDefinitionByType ?? null;
};

const listDefinitions = async () => {
  const data = await adminRequest(
    `query { metaobjectDefinitions(first: 50) { edges { node { name type } } } }`,
  );

  const definitions = data.metaobjectDefinitions.edges.map((edge) => edge.node);

  if (definitions.length === 0) {
    console.info('No metaobject definitions found.');
    return;
  }

  for (const definition of definitions) {
    console.info(`${definition.type}  —  ${definition.name}`);
  }
};

const ensureDefinitions = async () => {
  for (const definition of DEFINITIONS) {
    // Sequential: each create is independent but the output reads in spec order.
    // eslint-disable-next-line no-await-in-loop
    const existing = await getDefinition(definition.type);

    if (existing) {
      console.info(`exists     ${existing.type}  —  ${existing.name}`);
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const data = await adminRequest(
      `mutation CreateDef($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
          metaobjectDefinition { id name type }
          userErrors { field message code }
        }
      }`,
      {
        definition: {
          access: { storefront: 'PUBLIC_READ' },
          fieldDefinitions: definition.fields,
          name: definition.name,
          type: definition.type,
        },
      },
    );

    throwOnUserErrors(data.metaobjectDefinitionCreate, 'metaobjectDefinitionCreate');
    const created = data.metaobjectDefinitionCreate.metaobjectDefinition;
    console.info(`created    ${created.type}  —  ${created.name}`);
  }
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const upsertMetaobject = async (type, handle, fields) => {
  const fieldInput = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([key, value]) => ({ key, value: String(value) }));

  if (fieldInput.length === 0) {
    console.info(`skipped    ${type} ${handle} (no values)`);
    return;
  }

  const data = await adminRequest(
    `mutation Upsert($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
      metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
        metaobject { handle type }
        userErrors { field message code }
      }
    }`,
    { handle: { handle, type }, metaobject: { fields: fieldInput } },
  );

  throwOnUserErrors(data.metaobjectUpsert, `metaobjectUpsert(${handle})`);
  console.info(`upserted   ${type} ${handle}`);
};

const seedSections = async (options) => {
  await ensureDefinitions();

  const manifestPath = resolve(process.cwd(), options.manifest || 'content/sections.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  const hero = manifest.hero ?? {};
  await upsertMetaobject('hero_section', hero.handle || 'home-hero', {
    eyebrow: hero.eyebrow,
    heading: hero.heading,
    image: hero.image,
    image_alt: hero.imageAlt,
    primary_label: hero.primaryLabel,
    primary_url: hero.primaryUrl,
    secondary_label: hero.secondaryLabel,
    secondary_url: hero.secondaryUrl,
    subheading: hero.subheading,
  });

  const promo = manifest.promoBar ?? {};
  await upsertMetaobject('promo_bar', promo.handle || 'promo-bar', {
    active: promo.active === false ? 'false' : 'true',
    link_label: promo.linkLabel,
    link_url: promo.linkUrl,
    text: promo.text,
    tone: promo.tone,
  });

  const sizeChart = manifest.sizeChart ?? {};
  await upsertMetaobject('size_chart', sizeChart.handle || 'size-chart', {
    body: sizeChart.body,
    note: sizeChart.note,
    title: sizeChart.title,
  });

  const faq = manifest.faq ?? {};
  await upsertMetaobject('faq_section', faq.handle || 'home-faq', {
    intro: faq.intro,
    title: faq.title,
  });

  const items = Array.isArray(faq.items) ? faq.items : [];

  for (const [index, item] of items.entries()) {
    const question = typeof item.question === 'string' ? item.question.trim() : '';

    if (!question) {
      throw new Error(`FAQ item #${index + 1} is missing a question.`);
    }

    const handle = `faq-${index + 1}-${slugify(question).slice(0, 40)}`;

    // eslint-disable-next-line no-await-in-loop
    await upsertMetaobject('faq_item', handle, {
      answer: item.answer,
      position: String(index),
      question,
    });
  }
};

const parseArgs = (args) => {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith('--')) continue;

    options[arg.slice(2)] = args[index + 1];
    index += 1;
  }

  return options;
};

const [command, ...rest] = process.argv.slice(2);
const options = parseArgs(rest);

try {
  if (command === 'list') {
    await listDefinitions();
  } else if (command === 'ensure') {
    await ensureDefinitions();
  } else if (command === 'seed') {
    await seedSections(options);
  } else {
    console.error('Usage: shopify-sections.mjs <list|ensure|seed> [--manifest <path>]');
    process.exit(2);
  }
} catch (error) {
  console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
