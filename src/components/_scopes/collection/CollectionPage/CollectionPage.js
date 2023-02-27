/* eslint-disable no-nested-ternary */
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import Loader from '@/components/_loaders/Loader/Loader';
import Container from '@/components/Container/Container';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import { actions } from '@/contexts/CollectionContext/CollectionReducer';
import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import notFound from '@/assets/Notfound.svg';
import Image from 'next/image';
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
        <Container size="medium" extraClass={styles.headerContainer}>
          <div className={styles.header}>
            <LayoutButtons
              handleChange={(payload) => dispatch({ type: actions.SET_LAYOUT, payload })}
              selected={layout}
            />
            <Sort handleChange={handleSort} />
          </div>
        </Container>
        <section>
          {loading ? (
            <BlockLoader />
          ) : Array.isArray(products) && products.length > 0 ? (
            <ProductsList
              handleNext={handleNext}
              hasNextPage={pageInfo?.hasNextPage}
              products={products}
              layout={layout}
              loading={loading}
              loader={<Loader />}
            />
          ) : (
            <div className={styles.noResults}>
              <Image
                alt="No products were found."
                src={notFound.src}
                width={notFound.width}
                height={notFound.height}
              />
              <b>Result Not Found</b>
              <p>Whoops... No products were found.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CollectionPage;
