/* eslint-disable jsx-a11y/control-has-associated-label */
import useCartContext from '@/contexts/CartContext/useCartContext';
import CartItem from '../CartItem/CartItem';
import Table, { Body, Head, Row, THead } from '../../table/Table/Table';

function CartTable({ handleChange }) {
  const { cart, removeFromCart } = useCartContext();
  return (
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
        {cart?.lines.map((item) => (
          <CartItem
            key={item?.id}
            product={item.variant?.product}
            collection={item.variant?.product?.collections?.nodes?.[0]}
            variant={item.variant}
            quantity={item?.quantity}
            title={item?.title}
            removeFromCart={removeFromCart}
            lineId={item.id}
            item={item}
            handleChange={handleChange}
          />
        ))}
      </Body>
    </Table>
  );
}

export default CartTable;
