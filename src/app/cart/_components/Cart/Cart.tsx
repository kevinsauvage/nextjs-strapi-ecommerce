import type { GetCartQuery, PageInfo } from '@/shopify/storefront';

import CartSummary from '../CartSummary/CartSummary';
import CartTable from '../CartTable/CartTable';

import styles from './Cart.module.scss';

const Cart = ({
  searchParameters,
  cart,
}: {
  searchParameters: {
    after?: string;
    before?: string;
    first?: string;
    last?: string;
  };
  cart: GetCartQuery['cart'];
}) => {
  const linesEdges = cart?.lines?.edges || [];
  const linesPageInfo = cart?.lines?.pageInfo as PageInfo;

  return (
    <section className={styles.cart}>
      <main>
        <CartTable
          lines={linesEdges}
          searchParameters={searchParameters}
          pageInfo={linesPageInfo}
        />
      </main>
      <aside>
        <CartSummary cart={cart} />
      </aside>
    </section>
  );
};

export default Cart;
