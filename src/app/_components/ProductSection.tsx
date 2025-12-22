import Link from 'next/link';

import ProductsList from '@/components/ProductsList';
import { Button } from '@/components/ui/button';
import config from '@/config';
import type { ProductFieldsFragment } from '@/shopify/storefront';

import HomeSection from './HomeSection';

type ProductSectionProps = {
  title: string;
  products: ProductFieldsFragment[];
  viewAllLink?: string;
  viewAllLabel?: string;
  className?: string;
};

const ProductSection = ({
  title,
  products,
  viewAllLink = config.routes.collection,
  viewAllLabel = 'View all products',
  className,
}: ProductSectionProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <HomeSection
      title={title}
      className={className}
      action={
        <Button variant="ghost" size="sm" asChild>
          <Link href={viewAllLink}>{viewAllLabel}</Link>
        </Button>
      }
    >
      <ProductsList products={products} layout="grid" />
    </HomeSection>
  );
};

export default ProductSection;

