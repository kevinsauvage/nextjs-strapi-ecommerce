import Breadcrumbs from '@/components/Breadcrumbs';
import ListingHeader from '@/components/ListingHeader';
import PageBanner from '@/components/PageBanner';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import config from '@/config';
import { getSeo } from '@/data/seo';
import { DEFAULT_LOCALE } from '@/i18n/routing';

const Loading = () => {
  const pageSeo = getSeo(DEFAULT_LOCALE).search;

  return (
    <div>
      <PageBanner title={pageSeo.title} description={pageSeo.description}>
        <Breadcrumbs path={config.routes.search} />
        <Skeleton className="mx-auto h-11 w-full max-w-lg" />
      </PageBanner>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <ListingHeader>
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-28" />
          </div>
        </ListingHeader>
        <ProductGridSkeleton count={8} className="mb-0" />
      </div>
    </div>
  );
};

export default Loading;
