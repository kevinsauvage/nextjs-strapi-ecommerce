import { useState } from 'react';
import ListDisplay from '@/components/ListDisplay/ListDisplay';
import ProductCardDefault from '../../product/ProductCardDefault/ProductCardDefault';

function ProductsDisplay({ bestSelling, newArrival }) {
  const [index, setIndex] = useState(0);
  const [products] = useState([bestSelling.products, newArrival.products]);

  const nav = [{ title: 'Best selling' }, { title: 'newArrival' }];

  console.log(products);
  return (
    <div>
      <h2 className="big">OUR TRENDY PRODUCTS</h2>
      <div>
        {Array.isArray(nav) &&
          nav.map((item, i) => (
            <button key={item.title} type="button" onClick={() => setIndex(i)}>
              {item.title}
            </button>
          ))}
      </div>
      <ListDisplay layout="grid">
        {Array.isArray(products[index]) &&
          products[index].map((product) => (
            <ProductCardDefault key={product.id} product={product} />
          ))}
      </ListDisplay>
    </div>
  );
}

export default ProductsDisplay;
