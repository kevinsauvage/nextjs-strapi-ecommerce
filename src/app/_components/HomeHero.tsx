import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import config from '@/config';
import type { HeroSection } from '@/lib/server/cmsSections';
import { normalizeMenuHref } from '@/utils/url';

import { ArrowRight, Sparkles, Star } from 'lucide-react';

/**
 * Homepage hero. Renders merchant-curated content from the `hero_section`
 * metaobject when present, otherwise the built-in editorial hero. Either way
 * the layout, motion and typography stay identical — only the copy, links and
 * image swap.
 */

type HeroCollection = {
  title?: string | null;
  image?: {
    src?: string | null;
    large?: string | null;
    altText?: string | null;
  } | null;
} | null;

type HomeHeroProps = {
  hero: HeroSection | null;
  collection: HeroCollection;
};

const HERO_STATS: Array<[string, string]> = [
  ['4.9', 'Average rating'],
  ['12k+', 'Happy customers'],
  ['30-day', 'Free returns'],
];

const MARQUEE_ITEMS = [
  'Free shipping over $150',
  'New drop weekly',
  'Small-batch makers',
  '30-day returns',
  'Secure checkout',
  'Member perks',
];

// Duplicated for the seamless marquee loop; each half gets a stable suffix so
// keys stay unique without using the array index.
const MARQUEE_LOOP = [
  ...MARQUEE_ITEMS.map((item) => ({ item, id: `${item}-a` })),
  ...MARQUEE_ITEMS.map((item) => ({ item, id: `${item}-b` })),
];

/**
 * `next/image` (and the CSP `img-src`) only trusts the two configured CDNs, so
 * an off-host metaobject URL is dropped rather than rendered broken.
 */
const ALLOWED_IMAGE_HOSTS = new Set(['cdn.shopify.com', 'res.cloudinary.com']);

const safeImageSrc = (url?: string | null): string | null => {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    return parsed.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.has(parsed.hostname) ? url : null;
  } catch {
    return null;
  }
};

const HomeHero = ({ hero, collection }: HomeHeroProps) => {
  const customImage = safeImageSrc(hero?.image);
  const collectionImage = collection?.image;
  const collectionImageSrc = collectionImage?.large || collectionImage?.src || null;

  const imageSrc = customImage ?? collectionImageSrc;
  const showCollectionOverlay = !customImage && Boolean(collectionImageSrc);

  const heading = hero?.heading ?? 'Wear the story you want to tell.';
  const eyebrow = hero?.eyebrow ?? 'New Season · Curated Drop';
  const subheading =
    hero?.subheading ??
    'Discover the latest trends and exclusive collections that elevate everyday dressing — small-batch quality at an honest price, from wardrobe staples to statement pieces.';

  const primary =
    hero?.primaryLabel && hero.primaryUrl
      ? { label: hero.primaryLabel, href: normalizeMenuHref(hero.primaryUrl) }
      : { label: 'Shop the collection', href: config.routes.collection };

  const secondary =
    hero?.secondaryLabel && hero.secondaryUrl
      ? { label: hero.secondaryLabel, href: normalizeMenuHref(hero.secondaryUrl) }
      : hero
        ? null
        : { label: 'New arrivals', href: normalizeMenuHref('#new-arrivals') };

  const imageAlt =
    hero?.imageAlt ?? collectionImage?.altText ?? collection?.title ?? 'Featured collection';

  return (
    <section className="hero-mesh relative overflow-hidden border-b border-border/60">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 right-[6%] size-96 rounded-full bg-[var(--gold)]/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 size-80 rounded-full bg-[var(--gold-soft)] blur-3xl" />
      </div>
      <div className="container relative mx-auto grid items-center gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          {eyebrow ? (
            <span className="text-eyebrow-gold animate-rise inline-flex items-center gap-3">
              <Sparkles size={14} aria-hidden="true" />
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-display animate-rise animate-rise-1 mt-5 max-w-2xl text-balance">
            {heading}
          </h1>
          {subheading ? (
            <p className="text-body-lg animate-rise animate-rise-2 mt-6 max-w-xl text-secondary">
              {subheading}
            </p>
          ) : null}
          <div className="animate-rise animate-rise-3 mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild className="rounded-full px-7">
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            {secondary ? (
              <Button size="lg" variant="outline" asChild className="rounded-full px-7">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            ) : null}
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {HERO_STATS.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl font-semibold">{value}</dd>
                <dd className="text-caption-sm uppercase tracking-widest text-secondary">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-5">
          <div className="media-frame lift animate-rise animate-rise-2 relative aspect-[4/5] shadow-[0_32px_80px_-32px_rgb(12_10_9/0.45)]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-soft)] via-muted to-background" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {showCollectionOverlay ? (
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <Badge className="border-white/20 bg-white/15 text-white backdrop-blur-md">
                  Featured collection
                </Badge>
                <p className="font-display mt-3 text-2xl font-medium leading-tight">
                  {collection?.title ?? 'The Autumn Edit'}
                </p>
                <Button size="sm" variant="secondary" asChild className="mt-4 rounded-full">
                  <Link href={config.routes.collection}>
                    Explore <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="relative border-t border-border/60 bg-background/60 py-3 backdrop-blur"
      >
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10 text-[12px] font-semibold uppercase tracking-[0.18em] text-secondary">
            {MARQUEE_LOOP.map(({ item, id }) => (
              <span key={id} className="flex items-center gap-10">
                {item} <Star size={12} className="text-[var(--gold)]" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
