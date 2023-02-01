import { useState } from 'react';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import ListDisplay from '@/components/ListDisplay/ListDisplay';
import ProductCardDefault from '../../product/ProductCardDefault/ProductCardDefault';
import styles from './ProductsDisplay.module.scss';

function ProductsDisplay({ bestSelling, newArrival }) {
  const [index, setIndex] = useState(0);
  const [products] = useState([bestSelling.products, newArrival.products]);

  const nav = [{ title: 'Best selling' }, { title: 'New Arrival' }];

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
      <ListDisplay layout="grid">
        {Array.isArray(products[index]) &&
          products[index].map((product) => <ProductCardDefault product={product} key={product.id} />)}
      </ListDisplay>
    </div>
  );
}

export default ProductsDisplay;
