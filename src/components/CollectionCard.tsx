import Link from 'next/link';

import type { CollectionsQuery } from '@/shopify/storefront';

import { Button } from './ui/button';

const CollectionCard = ({
  collection,
}: {
  collection: CollectionsQuery['collections']['edges'][number]['node'];
}) => {
  const { title, image, handle } = collection || {};
  const backgroundStyle = { backgroundImage: `url(${image?.src})` };

  return (
    <div
      className="relative group overflow-hidden transition-all w-full h-full min-h-[300px] rounded-sm bg-cover bg-center"
      style={{ ...backgroundStyle }}
    >
      <div className="absolute inset-0 bg-black/50 flex flex-col gap-3 items-center justify-center text-center p-4 group-hover:bg-black/70 transition-all">
        <p className="text-2xl font-bold text-white">
          <span>{title} </span>
        </p>
        <Button variant="secondary">
          <Link href={`/collections/${handle}`} className="flex items-center gap-2">
            Shop now
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CollectionCard;
