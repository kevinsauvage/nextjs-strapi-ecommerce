import type { Route } from 'next';
import { useTranslations } from 'next-intl';

import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import { getNextPath, getPreviousPath } from '@/shopify/helpers';
import type { PageInfo } from '@/shopify/storefront';
import { cn } from '@/utils/cn';

const PageInfoPagination = ({
  pageInfo,
  searchParameters,
  basePath,
}: {
  pageInfo: PageInfo;
  searchParameters: {
    after?: string;
    before?: string;
    sort_key?: string;
  };
  basePath: string;
}) => {
  const t = useTranslations('shared');
  const previousPath = getPreviousPath(pageInfo, searchParameters, basePath);
  const nextPath = getNextPath(pageInfo, searchParameters, basePath);
  return (
    <div className="flex items-center justify-between gap-2">
      {pageInfo.hasPreviousPage ? (
        <Button asChild variant="secondary" size="default">
          {/* Helpers build `${Route}?${params}`; the Link renders only when
              the page exists, so the single assertion lives here. */}
          <Link href={previousPath as Route} aria-label={t('previousPage')}>
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="secondary" size="default" disabled aria-label={t('previousPage')}>
          Previous
        </Button>
      )}

      {pageInfo.hasNextPage ? (
        <Button asChild variant="secondary" size="default">
          <Link href={nextPath as Route} aria-label={t('nextPage')}>
            Next
          </Link>
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="default"
          disabled
          aria-label={t('nextPage')}
          className={cn('cursor-not-allowed')}
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default PageInfoPagination;
