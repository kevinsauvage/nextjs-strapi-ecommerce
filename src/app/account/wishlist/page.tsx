import type { Metadata } from 'next';
import Link from 'next/link';

import { getWishlistAction } from '@/actions/whishlistActions';
import NoFavoriteIllustration from '@/assets/NoFavoriteIllustration.png';
import EmptyState from '@/components/EmptyState';
import ProductsList from '@/components/ProductsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import seo from '@/data/seo';

import BackButton from '../_components/BackButton';

export const dynamic = 'force-dynamic'; // Wishlist is user-specific

export const metadata: Metadata = {
  description: seo.account.wishlist.description,
  title: seo.account.wishlist.title,
};

const Wishlist = async () => {
  const userWishlist = await getWishlistAction();

  if (!userWishlist?.length) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            image={NoFavoriteIllustration}
            title="No Favorites"
            subtitle="You can add an item to your favorites by clicking the “Heart Icon”"
            altText="No Favorites"
          >
            <Button variant="default" className="mt-4">
              <Link href="/">Start Shopping</Link>
            </Button>
          </EmptyState>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-medium">Wishlist</h2>
        </CardTitle>
        <CardDescription>
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
