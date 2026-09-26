import type { Metadata } from 'next';
import Link from 'next/link';

import CollectionGrid from '@/components/CollectionGrid/CollectionGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import seo from '@/data/seo';
import { getFaqSection, getHeroSection } from '@/lib/server/cmsSections';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { storefrontSdk } from '@/shopify/index';

import FaqSection from './_components/FaqSection';
import HomeHero from './_components/HomeHero';
import HomeSection from './_components/HomeSection';
import ProductSection from './_components/ProductSection';

import { ArrowRight, Award, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react';

export const metadata: Metadata = generateMetadataUtil({
  title: seo.home.title,
  description: seo.home.description,
  url: '/',
  absoluteTitle: true,
});

const perks = [
  { Icon: Truck, title: 'Free EU shipping', text: 'On orders over €80' },
  { Icon: RotateCcw, title: 'Easy returns', text: '30-day hassle-free returns' },
  { Icon: ShieldCheck, title: 'Secure checkout', text: 'Encrypted payment flow' },
  { Icon: Award, title: 'European quality', text: 'Thoughtfully selected, made to last' },
];

const testimonials = [
  {
    quote:
      'The bed arrived in two days and looks like a piece of furniture — exactly what we hoped for.',
    name: 'Lucía M.',
    detail: 'Verified buyer · Home & Comfort',
  },
  {
    quote:
      'Beautifully made and easy to travel with. Our cat settles into the carrier straight away.',
    name: 'Thomas L.',
    detail: 'Verified buyer · Walk & Travel',
  },
  {
    quote:
      'You can tell every product is chosen with care. The treat bag is our everyday essential.',
    name: 'Marta R.',
    detail: 'Verified buyer · Feeding',
  },
];

const RATING_STARS = [0, 1, 2, 3, 4];

const Home = async () => {
  const [collections, bestSelling, newArrival, heroSection, faqSection] = await Promise.all([
    storefrontSdk().collections({
      first: 100,
      firstProducts: 1,
      identifiers: [{ key: 'featured', namespace: 'custom' }],
      sortKey: 'RELEVANCE',
    }),
    storefrontSdk().getProducts({
      first: 10,
      identifiers: [],
      sortKey: 'BEST_SELLING',
    }),
    storefrontSdk().getProducts({
      first: 10,
      identifiers: [],
      sortKey: 'CREATED_AT',
    }),
    getHeroSection(),
    getFaqSection(),
  ]);

  const featuredCollections = collections.collections.edges.filter((collection) =>
    collection.node.metafields.find((metafield) => metafield?.key === 'featured'),
  );

  const bestSellingProducts = bestSelling.products.edges.map((edge) => edge.node);
  const newArrivalProducts = newArrival.products.edges.map((edge) => edge.node);

  return (
    <div className="pb-16 md:pb-24">
      <HomeHero hero={heroSection} collection={featuredCollections[0]?.node ?? null} />

      <div className="container mx-auto px-4 md:px-6">
        {/* Perks */}
        <div className="grid grid-cols-2 gap-3 py-10 md:grid-cols-4 md:gap-4 md:py-14">
          {perks.map(({ Icon, title, text }) => (
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
          ))}
        </div>

        {featuredCollections.length > 0 && (
          <HomeSection eyebrow="Curated" title="Explore our collections">
            <CollectionGrid collections={featuredCollections} />
          </HomeSection>
        )}
      </div>

      <div className="container mx-auto space-y-4 px-4 md:space-y-8 md:px-6">
        {bestSellingProducts.length > 0 && (
          <ProductSection
            eyebrow="Best Sellers"
            title="Featured Products"
            products={bestSellingProducts}
            viewAllLabel="View all featured"
          />
        )}

        {/* Social proof */}
        <section aria-label="Customer reviews" className="py-10 md:py-16">
          <div className="rounded-[var(--radius)] border border-border/70 bg-[var(--sidebar)] p-6 md:p-10">
            <span className="text-eyebrow-gold flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[var(--gold)]/60" />
              Loved by customers
            </span>
            <h2 className="text-heading-2 mt-3 max-w-xl">Loved by pet parents across Europe</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {testimonials.map(({ quote, name, detail }) => (
                <figure
                  key={name}
                  className="lift rounded-[var(--radius)] border border-border/70 bg-card p-6"
                >
                  <div className="flex gap-1 text-[var(--gold)]" aria-label="5 out of 5 stars">
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
              eyebrow="Just In"
              title="New Arrivals"
              products={newArrivalProducts}
              viewAllLabel="View all new arrivals"
            />
          </div>
        )}

        {faqSection ? <FaqSection section={faqSection} /> : null}

        {/* Closing CTA */}
        <section className="pb-4 pt-6">
          <div className="hero-mesh relative overflow-hidden rounded-[var(--radius)] border border-border/70 px-6 py-12 text-center md:py-16">
            <span className="text-eyebrow-gold justify-center inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[var(--gold)]/60" />
              New arrivals & private offers
              <span aria-hidden="true" className="h-px w-8 bg-[var(--gold)]/60" />
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance">
              Join the list for early access & new arrivals
            </h2>
            <p className="text-body mx-auto mt-3 max-w-xl text-secondary">
              One thoughtful email a week. No spam — unsubscribe anytime.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="rounded-full px-7">
                <Link href="/register">
                  Create an account <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-7">
                <Link href={config.routes.collection}>Continue shopping</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
