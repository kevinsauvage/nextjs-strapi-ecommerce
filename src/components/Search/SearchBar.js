import { useContext } from 'react';
import { GlobalStoreContext } from '@/contexts/GlobalContext/GlobalContext';
import Container from '@/components/Container/Container';
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
import { MdClose } from 'react-icons/md';
import styles from './SearchBar.module.scss';
import CustomSearchBox from './CustomSearch/CustomSearchBox';
import CustomHits from './Hits/Hits';
import Autocomplete from './Autocomplete/Autocomplete';

const searchClient = algoliasearch(
  'DD9FI7P48Z',
  '3a6d58200005df1baa528946d412c1b8'
);

export default function SearchBar() {
  const { searchOpen, resetToggle } = useContext(GlobalStoreContext);

  return (
    searchOpen && (
      <div
        className={`${styles.container}`}
        role="button"
        tabIndex="0"
        onClick={() => resetToggle()}
        onKeyDown={(e) => e.key === 'Escape' && resetToggle()}
      >
        <form className={`${styles.form}`} action="submit">
          <Container
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <InstantSearch
              searchClient={searchClient}
              indexName="shopify_products"
            >
              <Configure hitsPerPage={16} />{' '}
              <header className={styles.header}>
                <p className={styles.labelText}> WHAT ARE YOU LOOKING FOR?</p>
                <button
                  tabIndex={0}
                  type="button"
                  className={styles.buttonClose}
                  onClick={() => resetToggle()}
                >
                  <MdClose />
                </button>
              </header>
              <CustomSearchBox />
              <Autocomplete />
              <CustomHits />
            </InstantSearch>
          </Container>
        </form>
      </div>
    )
  );
}
