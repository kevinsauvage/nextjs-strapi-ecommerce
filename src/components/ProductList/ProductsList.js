import ProductCardDefault from '@/components/ProductCardDefault/ProductCardDefault';
import { useState } from 'react';
import { TbGridDots, TbListDetails } from 'react-icons/tb';
import styles from './ProductList.module.scss';

function ProductsList({ products }) {
  const [grid, setGrid] = useState(true);
  const [column, setColumn] = useState(false);

  const handleSetGrid = () => {
    setGrid(true);
    setColumn(false);
  };
  const handleSetColumn = () => {
    setGrid(false);
    setColumn(true);
  };
  return (
    <div>
      <div className={styles.header}>
        <p>Item 1 to {products.length} of 2300</p>
        <div className={styles.view}>
          <p>Select view </p>
          <button
            type="button"
            className={styles.btn}
            onClick={() => handleSetGrid()}
          >
            <TbGridDots />
          </button>

          <button
            type="button"
            className={styles.btn}
            onClick={() => handleSetColumn()}
          >
            <TbListDetails />
          </button>
        </div>
      </div>
      <ul className={grid ? styles.containerGrid : styles.listContainer}>
        {Array.isArray(products) &&
          products.map((product) => (
            <ProductCardDefault
              key={product.id}
              product={product}
              grid={grid}
              column={column}
            />
          ))}
      </ul>
    </div>
  );
}

export default ProductsList;
