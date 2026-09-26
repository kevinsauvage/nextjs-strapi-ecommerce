import { useTranslations } from 'next-intl';

import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import config from '@/config';

import EmptyCartIllustration from './EmptyCartIllustration';

import { ArrowRight, ChevronLeft, Headphones, RotateCcw, Search, ShieldCheck } from 'lucide-react';

/** Icon + message-key pairs for the reassurance strip. */
const REASSURANCE = [
  { Icon: ShieldCheck, key: 'secureCheckout' },
  { Icon: RotateCcw, key: 'thirtyDayReturns' },
  { Icon: Headphones, key: 'humanSupport' },
] as const;

/**
 * Empty cart state.
 *
 * An empty cart is a recovery moment, not a dead end: it offers two clear
 * routes back into the catalog (primary "shop all", secondary "search"), a
 * quiet escape hatch back home, and a short reassurance strip. The layout is a
 * single editorial surface — illustration beside copy on wide screens, stacked
 * on mobile — rather than a generic centered placeholder.
 */
const CartEmptyState = () => {
  const t = useTranslations('cart');

  return (
    <section
      aria-labelledby="empty-cart-title"
      className="hero-mesh relative overflow-hidden rounded-[var(--radius)] border border-border/70"
    >
      <div className="grid items-center gap-8 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        {/* Copy + actions */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <span className="text-eyebrow-gold">{t('nothingHereYet')}</span>

          <h1 id="empty-cart-title" className="mt-3 text-balance text-heading-3">
            {t('emptyTitle')}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-body-sm text-secondary lg:mx-0 md:text-body">
            {t('emptyBody')}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button size="lg" asChild>
              <Link href={config.routes.collection}>
                {t('shopCollection')}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={config.routes.search}>
                <Search size={16} aria-hidden="true" />
                {t('searchProducts')}
              </Link>
            </Button>
          </div>

          <Link
            href={config.routes.home}
            className="group mt-5 inline-flex items-center text-body-sm text-secondary transition-colors hover:text-primary lg:mt-6"
          >
            <ChevronLeft
              className="mr-1 h-4 w-4 transition-colors group-hover:text-primary"
              aria-hidden="true"
            />
            {t('backToHome')}
          </Link>
        </div>

        {/* Illustration */}
        <div className="order-1 flex justify-center lg:order-2">
          <div className="flex size-52 items-center justify-center rounded-full bg-[var(--gold-soft)]/70 md:size-64">
            <EmptyCartIllustration className="w-40 text-foreground md:w-48" />
          </div>
        </div>
      </div>

      {/* Reassurance strip */}
      <div className="border-t border-border/60 bg-card/60">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-4 text-caption text-secondary lg:justify-start lg:px-10">
          {REASSURANCE.map(({ Icon, key }) => (
            <li key={key} className="inline-flex items-center gap-2">
              <Icon size={14} className="text-[var(--gold)]" aria-hidden="true" />
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CartEmptyState;
