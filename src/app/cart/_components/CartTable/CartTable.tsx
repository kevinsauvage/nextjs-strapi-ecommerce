import PageInfoPagination from '@/components/PageInfoPagination/PageInfoPagination';
import Table, { Body, Head, Row, THead } from '@/components/Table/Table';
import type { GetCartQuery, PageInfo } from '@/shopify/storefront';

import CartItem from '../CartItem/CartItem';

import styles from './CartTable.module.scss';

const CartTable = ({
  lines,
  searchParameters,
  pageInfo,
}: {
  lines: GetCartQuery['cart']['lines']['edges'];
  searchParameters: { [key: string]: unknown };
  pageInfo: PageInfo;
}) => {
  return (
    <div className={styles['cart-table']}>
      <Table>
        <Head>
          <Row>
            <THead>Product</THead>
            <THead>Price</THead>
            <THead>Quantity</THead>
            <THead>Subtotal</THead>
            <THead>Remove</THead>
          </Row>
        </Head>
        <Body>
          {lines.map((item) => (
            <CartItem key={item?.node?.id} item={item.node} />
          ))}
        </Body>
      </Table>

      <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
    </div>
  );
};

export default CartTable;
