import Link from 'next/link';

import siteMetadata from '@/data/siteMetadata';
import { cn } from '@/utils/cn';

/**
 * Wordmark logo. Uses the site name from `NEXT_PUBLIC_SITE_NAME` (via
 * `siteMetadata`) with a small sage dot as the brand mark, so the header and
 * footer stay in sync with the configured brand without a hand-built SVG.
 */
const Logo = ({ className }: { className?: string }) => (
  <Link
    href="/"
    aria-label={`${siteMetadata.companyName} — home`}
    className={cn('group inline-flex items-baseline gap-2', className)}
  >
    <span
      aria-hidden="true"
      className="inline-block size-2.5 shrink-0 translate-y-[-1px] rounded-full bg-[var(--gold)] transition-transform duration-300 group-hover:scale-125"
    />
    <span className="font-display text-[1.6rem] font-medium leading-none tracking-tight text-foreground">
      {siteMetadata.companyName}
    </span>
  </Link>
);

export default Logo;
