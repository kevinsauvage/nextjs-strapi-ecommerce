import { getWishlistAction } from '@/actions/whishlistActions';
import NoFavoriteIllustration from '@/assets/NoFavoriteIllustration.png';
import EmptyState from '@/components/EmptyState/EmptyState';
import ProductsList from '@/components/ProductList/ProductsList';

const Wishlist = async () => {
  const userWishlist = await getWishlistAction();

  if (!userWishlist?.length) {
    return (
      <EmptyState
        image={NoFavoriteIllustration}
        title="No Favorites"
        subtitle="You can add an item to your favorites by clicking the “Heart Icon”"
        altText="No Favorites"
      />
    );
  }

  return (
    <div>
      <h2>Wishlist</h2>
      <ProductsList loading={false} layout="grid" products={userWishlist} />
    </div>
  );
};

export default Wishlist;
