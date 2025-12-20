'use client';

import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton = () => {
  return (
    <li className="relative overflow-hidden rounded-sm transition-all">
      {/* Wishlist & Quick View Buttons */}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>

      {/* Product Image Skeleton */}
      <div className="relative overflow-hidden">
        <Skeleton className="aspect-square w-full" />
      </div>

      {/* Text Content */}
      <div className="py-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </li>
  );
};

export default ProductCardSkeleton;
