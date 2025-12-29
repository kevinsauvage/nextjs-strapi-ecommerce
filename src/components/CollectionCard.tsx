import Image from 'next/image';
import Link from 'next/link';

import config from '@/config';
import type { CollectionsQuery } from '@/shopify/storefront';

import { Button } from './ui/button';

const CollectionCard = ({
  collection,
  priority = false,
}: {
  collection: CollectionsQuery['collections']['edges'][number]['node'];
  priority?: boolean;
}) => {
  const { title, image, handle } = collection || {};

  return (
    <div className="relative group overflow-hidden transition-all w-full h-full min-h-[300px] rounded-sm">
      {image?.src && (
        <Image
          src={image.src}
          alt={image.altText || title || 'Collection image'}
          fill
          quality={75}
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      <div className="absolute inset-0 bg-black/50 flex flex-col gap-3 items-center justify-center text-center p-4 group-hover:bg-black/70 transition-all">
        <p className="text-heading-2 text-white">
          <span>{title} </span>
        </p>
        <Button variant="secondary" size="default" asChild>
          <Link href={`${config.routes.collection}/${handle}`} className="flex items-center gap-2">
            Shop now
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CollectionCard;
