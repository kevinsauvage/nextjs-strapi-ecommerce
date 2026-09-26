import Link from '@/components/LocalizedLink';
import type { PromoBarSection, PromoBarTone } from '@/lib/server/cmsSections';
import { cn } from '@/utils/cn';
import { normalizeMenuHref } from '@/utils/url';

import { ArrowRight } from 'lucide-react';

/**
 * Merchant-authored announcement bar rendered above the sticky header.
 *
 * Tones are resolved from the existing design tokens so the bar stays in the
 * editorial palette in both light and dark mode. The gold tone pairs paper text
 * with the soft gold wash (not the saturated `--gold`) to keep AA contrast in
 * dark mode, where `--gold` inverts to a bright yellow.
 */
const TONE_CLASSES: Record<PromoBarTone, string> = {
  ink: 'bg-primary text-primary-foreground',
  gold: 'border-b border-[var(--gold)]/30 bg-[var(--gold-soft)] text-foreground',
  neutral: 'border-b border-border/60 bg-[var(--sidebar)] text-foreground',
};

const PromoBar = ({ promo }: { promo: PromoBarSection }) => {
  const linkHref = promo.linkUrl ? normalizeMenuHref(promo.linkUrl) : null;

  return (
    <div className={cn(TONE_CLASSES[promo.tone])}>
      <p className="container mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-[12px] font-medium tracking-[0.08em] uppercase">
        <span>{promo.text}</span>
        {promo.linkLabel && linkHref ? (
          <Link
            href={linkHref}
            className="link-underline inline-flex items-center gap-1 font-semibold underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
          >
            {promo.linkLabel}
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        ) : null}
      </p>
    </div>
  );
};

export default PromoBar;
