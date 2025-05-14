/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import type { PredictiveSearchQuery } from '@/shopify/storefront';
import type { Product as ProductType } from '@/shopify/storefront';

import { Button } from './ui/button';

const Product = ({
  product,
}: {
  product: PredictiveSearchQuery['predictiveSearch']['products'][number];
}) => {
  const { featuredImage, title, handle, priceRange } = product as never as ProductType;

  const image = featuredImage as never as ImageFields;

  return (
    typeof featuredImage.url === 'string' && (
      <Link
        key={handle}
        href={`/collections/products/${handle}`}
        className="flex items-center gap-2 p-2 rounded hover:bg-muted overflow-hidden"
      >
        <Button variant="ghost" className="w-full justify-start gap-3 rounded-none" role="option">
          <Image
            src={image.small}
            alt={image.altText || ''}
            title={image.altText || ''}
            loading="lazy"
            width={48}
            height={48}
            className="rounded-lg aspect-square object-contain"
          />
          <div className="flex flex-col items-start">
            <span className="font-semibold">{title}</span>

            <span className="text-sm text-muted-foreground">
              {priceRange.minVariantPrice.amount} {priceRange.minVariantPrice.currencyCode}
            </span>
          </div>
        </Button>
      </Link>
    )
  );
};

const Query = ({
  query,
}: {
  query: PredictiveSearchQuery['predictiveSearch']['queries'][number];
}) => {
  return (
    <Link
      key={query.text}
      href={`/search?searchQuery=${query.text}`}
      className="block hover:bg-muted px-2 rounded"
    >
      <Button
        variant="ghost"
        className="w-full justify-start rounded-none  text-base font-medium"
        role="option"
      >
        <Search className="mr-2 h-4 w-4 opacity-60" />
        {query.text}
      </Button>
    </Link>
  );
};

const SectionTitle = ({ title }: { title: string }) => {
  return <div className="px-4 pt-4 text-xs uppercase text-muted-foreground">{title}</div>;
};

const SearchResults = ({ results }: { results: PredictiveSearchQuery['predictiveSearch'] }) => {
  if (results.products.length === 0 && results.queries.length === 0) {
    return null;
  }

  return (
    <Card className="absolute z-50 w-full mt-2 shadow-lg text-start overflow-hidden bg-background rounded-2xl animate-fadeSlideDown">
      <CardContent className="p-2">
        <SectionTitle title="Suggestions" />
        <div className="pb-4">
          {results.queries.map((q) => (
            <Query key={q.text} query={q} />
          ))}
        </div>

        <SectionTitle title="Products" />
        <div className="pb-4">
          {results.products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResults;
