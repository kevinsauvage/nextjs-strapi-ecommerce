/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';

import Pagination from '@/components/Pagination/Pagination';

import Table, { Body, Head, Row, THead } from '../../table/Table/Table';
import CartItem from '../CartItem/CartItem';

function CartTable({ handleChange, handleRemove, cart }) {
  const [currentPage, setCurrentPage] = useState(1);
  const linesLength = cart?.lines.length || 0;

  const totalPages = Math.ceil(linesLength / 5);
  const sliceFrom = (currentPage - 1) * 5;
  const sliceUntil = (currentPage - 1) * 5 + 5;

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
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
          {cart?.lines.slice(sliceFrom, sliceUntil).map((item) => (
            <CartItem
              key={item?.id}
              product={item.variant?.product}
              collection={item.variant?.product?.collections?.nodes?.[0]}
              variant={item.variant}
              quantity={item?.quantity}
              title={item?.title}
              removeFromCart={handleRemove}
              lineId={item.id}
              item={item}
              handleChange={handleChange}
            />
          ))}
        </Body>
      </Table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  );
}

export default CartTable;
