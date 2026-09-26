import type { Metadata } from 'next';

import CollectionGrid from '@/components/CollectionGrid/CollectionGrid';
import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import seo from '@/data/seo';
import { contentLanguage, getTranslations, localeFromParams } from '@/i18n/server';
import { getFaqSection, getHeroSection } from '@/lib/server/cmsSections';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { getStorefront } from '@/lib/server/storefront';

import FaqSection from './_components/FaqSection';
import HomeHero from './_components/HomeHero';
import HomeSection from './_components/HomeSection';
import ProductSection from './_components/ProductSection';

import { ArrowRight, Award, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react';

/**
 * The locale is part of the route, so the canonical URL and the `hreflang`
 * alternates have to be resolved per language rather than declared statically.
 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> =>
  generateMetadataUtil({
    title: seo.home.title,
    description: seo.home.description,
    url: '/',
    absoluteTitle: true,
    locale: await localeFromParams(params),
  });

type Perk = { title: string; text: string };
type Testimonial = { quote: string; name: string; detail: string };

/** Icon set matching the order of `home.perks` in the message catalogs. */
const PERK_ICONS = [Truck, RotateCcw, ShieldCheck, Award] as const;

const RATING_STARS = [0, 1, 2, 3, 4];

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'home');
  const perks = t.raw('perks') as Perk[];
  const testimonials = t.raw('testimonials') as Testimonial[];
  const heroStats = t.raw('hero.stats') as Array<{ value: string; label: string }>;
  const heroMarquee = t.raw('hero.marquee') as string[];

  const [collections, bestSelling, newArrival, heroSection, faqSection] = await Promise.all([
    await (
      await getStorefront(locale)
    ).collections({
      language: contentLanguage(locale),
      first: 100,
      firstProducts: 1,
      identifiers: [{ key: 'featured', namespace: 'custom' }],
      sortKey: 'RELEVANCE',
    }),
    await (
      await getStorefront(locale)
    ).getProducts({
      language: contentLanguage(locale),
      first: 10,
      identifiers: [],
      sortKey: 'BEST_SELLING',
    }),
    await (
      await getStorefront(locale)
    ).getProducts({
      language: contentLanguage(locale),
      first: 10,
      identifiers: [],
      sortKey: 'CREATED_AT',
    }),
    getHeroSection(locale),
    getFaqSection(locale),
  ]);

  const featuredCollections = collections.collections.edges.filter((collection) =>
    collection.node.metafields.find((metafield) => metafield?.key === 'featured'),
  );

  const bestSellingProducts = bestSelling.products.edges.map((edge) => edge.node);
  const newArrivalProducts = newArrival.products.edges.map((edge) => edge.node);

  return (
    <div className="pb-16 md:pb-24">
      <HomeHero
        hero={heroSection}
        collection={featuredCollections[0]?.node ?? null}
        stats={heroStats}
        marquee={heroMarquee}
        locale={locale}
      />

      <div className="container mx-auto px-4 md:px-6">
        {/* Perks */}
        <div className="grid grid-cols-2 gap-3 py-10 md:grid-cols-4 md:gap-4 md:py-14">
          {perks.map(({ title, text }, index) => {
            const Icon = PERK_ICONS[index] ?? Award;

            return (
              <Card key={title} className="lift border-border/70 bg-card/80">
                <CardContent className="flex items-start gap-3 p-4 md:p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold-soft)] text-[var(--gold)]">
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-body-sm font-semibold">{title}</span>
                    <span className="block text-caption text-secondary">{text}</span>
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {featuredCollections.length > 0 && (
          <HomeSection eyebrow={t('collections.eyebrow')} title={t('collections.title')}>
            <CollectionGrid collections={featuredCollections} locale={locale} />
          </HomeSection>
        )}
      </div>

      <div className="container mx-auto space-y-4 px-4 md:space-y-8 md:px-6">
        {bestSellingProducts.length > 0 && (
          <ProductSection
            eyebrow={t('featured.eyebrow')}
            title={t('featured.title')}
            products={bestSellingProducts}
            viewAllLabel={t('featured.viewAll')}
          />
        )}

        {/* Social proof */}
        <section aria-label={t('reviews.aria')} className="py-10 md:py-16">
          <div className="rounded-[var(--radius)] border border-border/70 bg-[var(--sidebar)] p-6 md:p-10">
            <span className="text-eyebrow-gold flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[var(--gold)]/60" />
              {t('reviews.eyebrow')}
            </span>
            <h2 className="text-heading-2 mt-3 max-w-xl">{t('reviews.title')}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {testimonials.map(({ quote, name, detail }) => (
                <figure
                  key={name}
                  className="lift rounded-[var(--radius)] border border-border/70 bg-card p-6"
                >
                  <div className="flex gap-1 text-[var(--gold)]" aria-label={t('reviews.stars')}>
                    {RATING_STARS.map((star) => (
                      <Star key={star} size={14} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-body-sm leading-relaxed text-foreground">
                    “{quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-caption text-secondary">
                    <span className="block font-semibold text-foreground">{name}</span>
                    {detail}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {newArrivalProducts.length > 0 && (
          <div id="new-arrivals" className="scroll-mt-24">
            <ProductSection
              eyebrow={t('newArrivals.eyebrow')}
              title={t('newArrivals.title')}
              products={newArrivalProducts}
              viewAllLabel={t('newArrivals.viewAll')}
            />
          </div>
        )}

        {faqSection ? <FaqSection section={faqSection} /> : null}

        {/* Closing CTA */}
        <section className="pb-4 pt-6">
          <div className="hero-mesh relative overflow-hidden rounded-[var(--radius)] border border-border/70 px-6 py-12 text-center md:py-16">
            <span className="text-eyebrow-gold justify-center inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[var(--gold)]/60" />
              {t('cta.eyebrow')}
              <span aria-hidden="true" className="h-px w-8 bg-[var(--gold)]/60" />
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance">{t('cta.title')}</h2>
            <p className="text-body mx-auto mt-3 max-w-xl text-secondary">{t('cta.description')}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="rounded-full px-7">
                <Link href="/register">
                  {t('cta.primary')} <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-7">
                <Link href={config.routes.collection}>{t('cta.secondary')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
