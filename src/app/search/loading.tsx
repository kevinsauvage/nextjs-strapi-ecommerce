import Breadcrumbs from '@/components/Breadcrumbs';
import ListDisplay from '@/components/ListDisplay';
import ListingHeader from '@/components/ListingHeader';
import PageBanner from '@/components/PageBanner';
import { Skeleton } from '@/components/ui/skeleton';
import seo from '@/data/seo';

const Loading = () => {
  return (
    <div>
      <PageBanner title={seo.search.title} description={seo.search.description}>
        <Breadcrumbs />
        <Skeleton className="h-10 w-full max-w-md mx-auto" />
      </PageBanner>
      <div className="container mx-auto mb-8 px-4">
        <ListingHeader>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </ListingHeader>
        <ListDisplay layout="grid" loading={true}>
          {null}
        </ListDisplay>
        <div className="flex justify-center mt-8">
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
