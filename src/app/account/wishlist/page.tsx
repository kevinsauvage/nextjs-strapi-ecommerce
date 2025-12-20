import type { Metadata } from 'next';
import Link from 'next/link';

import NoFavoriteIllustration from '@/assets/NoFavoriteIllustration.png';
import EmptyState from '@/components/EmptyState';
import ProductsList from '@/components/ProductsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
            subtitle="Start saving items you love! Click the heart icon on any product to add it to your wishlist."
            altText="Empty wishlist"
          >
            <Link href="/" className="mt-4">
              <Button variant="default">Start Shopping</Button>
            </Link>
          </EmptyState>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="text-heading-3">Wishlist</h3>
        </CardTitle>
        <CardDescription className="text-body text-secondary">
          <p className="mb-4">Manage your wishlist for a better shopping experience.</p>
          <BackButton />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductsList loading={false} layout="grid" products={userWishlist} />
      </CardContent>
    </Card>
  );
};

export default Wishlist;
