import type { Metadata } from 'next';
import Link from 'next/link';

import NoFavoriteIllustration from '@/assets/NoFavoriteIllustration.png';
import CardHeaderPattern from '@/components/CardHeaderPattern';
import EmptyState from '@/components/EmptyState';
import ProductsList from '@/components/ProductsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import seo from '@/data/seo';
import { getWishlist } from '@/lib/wishlist';

import BackButton from '../_components/BackButton';

export const dynamic = 'force-dynamic'; // Wishlist is user-specific

export const metadata: Metadata = {
  description: seo.account.wishlist.description,
  title: seo.account.wishlist.title,
};

const Wishlist = async () => {
  const userWishlist = await getWishlist();

  if (!userWishlist?.length) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            variant="wishlist"
            image={NoFavoriteIllustration}
            title="Your wishlist is empty"
            subtitle="Save your favorite items for later. Click the heart icon on any product to add it to your wishlist."
            altText="Empty wishlist"
            primaryAction={
              <Link href="/">
                <Button variant="default">Start Shopping</Button>
              </Link>
            }
            secondaryAction={
              <Link href="/collections" className="link">
                Browse collections
              </Link>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeaderPattern
        title="Wishlist"
        size={3}
        actions={<BackButton />}
        description="Save and manage your favorite items."
      />
      <CardContent>
        <ProductsList loading={false} layout="grid" products={userWishlist} />
      </CardContent>
    </Card>
  );
};

export default Wishlist;
