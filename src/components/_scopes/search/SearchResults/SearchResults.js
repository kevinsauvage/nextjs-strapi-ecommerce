import styles from './SearchResults.module.scss';
import ProductCardDefault from '../../product/ProductCardDefault/ProductCardDefault';

function SearchResults({ results }) {
  return (
    <div>
      <div className={styles.searchResult}>
        {results.map((product) => (
          <ProductCardDefault key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
