import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { getNextPath, getPreviousPath } from '@/shopify/helpers';
import type { PageInfo } from '@/shopify/storefront';

const PageInfoPagination = async ({
  pageInfo,
  searchParameters,
}: {
  pageInfo: PageInfo;
  searchParameters: {
    after?: string;
    before?: string;
    sort_key?: string;
  };
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <Link href={await getPreviousPath(pageInfo, searchParameters)}>
        <Button
          disabled={!pageInfo.hasPreviousPage}
          variant="default"
          className={buttonVariants({ variant: 'default' })}
          size="default"
          asChild={false}
          aria-disabled={!pageInfo.hasPreviousPage}
          aria-label="Previous Page"
        >
          Previous
        </Button>
      </Link>

      <Link href={await getNextPath(pageInfo, searchParameters)}>
        <Button disabled={!pageInfo.hasNextPage}>Next</Button>
      </Link>
    </div>
  );
};

export default PageInfoPagination;
