import ListDisplay from '@/components/ListDisplay';
import PageBanner from '@/components/PageBanner';
import SectionTitle from '@/components/SectionTitle';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageBanner
        title="Shop the Latest Trends"
        description="Discover the latest trends and exclusive collections that will elevate your style. Shop
        now and enjoy a seamless shopping experience with us. From fashion to home decor, we have
        something for everyone."
      />
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {new Array(3).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
      <SectionTitle>Featured Products</SectionTitle>
      <ListDisplay layout="grid" loading={true}>
        {null}
      </ListDisplay>
      <SectionTitle>New Arrival</SectionTitle>
      <ListDisplay layout="grid" loading={true}>
        {null}
      </ListDisplay>
    </div>
  );
};

export default Loading;
