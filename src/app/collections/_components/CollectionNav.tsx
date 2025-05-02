'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { GetMenuByHandleQuery } from '@/shopify/storefront';

const CollectionNav = ({
  items,
  collectionSlug,
}: {
  items:
    | GetMenuByHandleQuery['menu']['items']
    | GetMenuByHandleQuery['menu']['items'][number]['items']
    | undefined;
  collectionSlug: string;
}) => {
  return (
    <div className="container mx-auto">
      <nav>
        <ul className="flex items-center flex-wrap gap-4">
          {Array.isArray(items) &&
            items.map(
              (menuItem) =>
                typeof menuItem.url === 'string' && (
                  <li key={menuItem.id}>
                    <Button
                      variant={
                        menuItem?.url?.toLowerCase().includes(collectionSlug?.toLowerCase())
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      <Link
                        href={
                          new URL(menuItem?.url).pathname +
                          new URL(menuItem?.url).searchParams.toString()
                        }
                      >
                        {menuItem?.title}
                      </Link>
                    </Button>
                  </li>
                ),
            )}
        </ul>
      </nav>
    </div>
  );
};

export default CollectionNav;
