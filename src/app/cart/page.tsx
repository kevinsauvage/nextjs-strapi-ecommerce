import { notFound } from 'next/navigation';

import { getCartAction } from '@/actions/cartActions';
import cartIllustration from '@/assets/CartIllustration.png';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import seo from '@/data/seo';
import type { PageInfo } from '@/shopify/storefront';

import CartSummary from './_components/CartSummary/CartSummary';
import CartTable from './_components/CartTable/CartTable';
import ContinueShoppingButton from './_components/ContinueShoppingButton';

import styles from './page.module.scss';

const CartPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    after?: string;
    before?: string;
    first?: string;
    last?: string;
  }>;
}) => {
  const searchParameters = await searchParams;

  const response = await getCartAction({
    after: searchParameters.after,
    before: searchParameters.before,
    first: searchParameters.first ? Number.parseInt(searchParameters.first, 10) : undefined,
    last: searchParameters.last ? Number.parseInt(searchParameters.last, 10) : undefined,
  });

  const { cart } = response || {};

  if (!cart) {
    notFound();
  }

  const linesEdges = cart?.lines?.edges || [];
  const linesPageInfo = cart?.lines?.pageInfo as PageInfo;

  return (
    <div>
      <PageBanner title={seo.cart.title} />
      <Breadcrumbs />
      <Container>
        {linesEdges?.length > 0 ? (
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
