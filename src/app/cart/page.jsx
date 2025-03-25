import { getCartAction } from '@/actions/cartActions';
import cartIllustration from '@/assets/CartIllustration.svg';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import seo from '@/data/seo';

import CartSummary from './_components/CartSummary/CartSummary';
import CartTable from './_components/CartTable/CartTable';
import ContinueShoppingButton from './_components/ContinueShoppingButton';

import styles from './page.module.scss';

const CartPage = async () => {
  const cart = await getCartAction();

  return (
    <div>
      <PageBanner title={seo.cart.title} />
      <Breadcrumbs />
      <Container>
        {cart?.lines?.length > 0 ? (
          <section className={styles.cart}>
            <main>
              <CartTable cart={cart} />
            </main>
            <aside>
              <CartSummary cart={cart} />
            </aside>
          </section>
        ) : (
          <EmptyState
            image={cartIllustration}
            title="Your cart is empty"
            subtitle="Looks like you haven’t added anything to your cart yet"
            altText="Empty cart illustration"
          >
            <ContinueShoppingButton />
          </EmptyState>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
