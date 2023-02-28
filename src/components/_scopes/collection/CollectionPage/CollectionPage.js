/* eslint-disable no-nested-ternary */
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import { actions } from '@/contexts/CollectionContext/CollectionReducer';
import Filters from '../Filters/Filters';
import styles from './collectionNav.module.scss';
import Sort from '../../product/Sort/Sort';

function CollectionPage() {
  const { loading, products, layout, handleNext, pageInfo, handleSort, dispatch } = useCollectionContext();

  return (
    <div className={styles.CollectionPage}>
      <aside className={styles.aside}>
        <Filters />
      </aside>
      <main className={styles.main}>
        <div size="medium" extraClass={styles.headerContainer}>
          <div className={styles.header}>
            <LayoutButtons
              handleChange={(payload) => dispatch({ type: actions.SET_LAYOUT, payload })}
              selected={layout}
            />
            <Sort handleChange={handleSort} />
          </div>
        </div>
        <ProductsList
          handleNext={handleNext}
          hasNextPage={pageInfo?.hasNextPage}
          products={products}
          layout={layout}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default CollectionPage;
