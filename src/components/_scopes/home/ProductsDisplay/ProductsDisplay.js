import { useMemo, useState } from 'react';

import SectionTitle from '@/components/SectionTitle/SectionTitle';

import ProductsList from '../../product/ProductList/ProductsList';

import styles from './ProductsDisplay.module.scss';

function ProductsDisplay({ bestSelling, newArrival }) {
  const [index, setIndex] = useState(0);
  const [products] = useState([bestSelling.products, newArrival.products]);
  const nav = useMemo(() => [{ title: 'Best selling' }, { title: 'New Arrival' }], []);

  return (
    <div className={styles.productsDisplay}>
      <div className={styles.header}>
        <SectionTitle first="OUR SELECTION OF" second="PRODUCTS" />
        <ul className={styles.nav}>
          {Array.isArray(nav) &&
            nav.map((item, i) => (
              <li key={item.title}>
                <button
                  className={`${styles.button} ${i === index && styles.active}`}
                  type="button"
                  onClick={() => setIndex(i)}
                >
                  {item.title}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <ProductsList products={products[index]} layout="grid" />
    </div>
  );
}

export default ProductsDisplay;
