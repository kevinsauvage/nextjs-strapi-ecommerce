import ProductCardSkeleton from './ProductCartSkeleton';

const ListDisplay = ({
  children,
  layout = 'grid',
  loading = false,
}: {
  children: React.ReactNode;
  layout?: 'grid' | 'list';
  loading?: boolean;
}) => {
  return (
    <ul
      className={`gap-4 md:gap-5 lg:gap-7 xl:gap-8 2xl:gap-9 ${
        layout === 'grid'
          ? 'grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]  '
          : 'flex flex-col'
      }`}
    >
      {loading
        ? new Array(6).fill(0).map((_, index) => <ProductCardSkeleton key={index} />)
        : children}
    </ul>
  );
};

export default ListDisplay;
