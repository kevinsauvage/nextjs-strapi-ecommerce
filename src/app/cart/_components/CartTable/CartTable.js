'use client';

import { useState } from 'react';

import Pagination from '@/components/Pagination/Pagination';
import Table, { Body, Head, Row, THead } from '@/components/Table/Table';

import CartItem from '../CartItem/CartItem';

import styles from './CartTable.module.scss';

const CartTable = ({ cart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const linesLength = cart?.lines.length || 0;

  const totalPages = Math.ceil(linesLength / 5);
  const sliceFrom = (currentPage - 1) * 5;
  const sliceUntil = (currentPage - 1) * 5 + 5;

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
          {cart?.lines.slice(sliceFrom, sliceUntil).map((item) => (
            <CartItem key={item?.id} item={item} />
          ))}
        </Body>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CartTable;
