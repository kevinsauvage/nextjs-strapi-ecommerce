'use client';

import { useMemo, useState } from 'react';

import ProductsList from '@/components/ProductList/ProductsList';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import type { ProductFieldsFragment } from '@/shopify/storefront';

import styles from './ProductsDisplay.module.scss';

const ProductsDisplay = ({
  bestSelling,
  newArrival,
}: {
  bestSelling: ProductFieldsFragment[];
  newArrival: ProductFieldsFragment[];
}) => {
  const [index, setIndex] = useState(0);
  const nav = useMemo(() => [{ title: 'Best selling' }, { title: 'New Arrival' }], []);

  return (
    <div className={styles.products}>
      <div className={styles.header}>
        <SectionTitle first="OUR SELECTION OF" second="PRODUCTS" />
        <ul className={styles.nav}>
          {Array.isArray(nav) &&
            nav.map((item, index_) => (
              <li key={item.title + index_}>
                <button
                  className={`${styles.button} ${index_ === index && styles.active}`}
                  type="button"
                  onClick={() => setIndex(index_)}
                >
                  {item.title}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <ProductsList products={[bestSelling, newArrival][index]} layout="grid" />
    </div>
  );
};

export default ProductsDisplay;
