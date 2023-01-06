import { useCallback, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import Container from '@/layout/Container/Container';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import nextApiCall from '@/utils/apiNext';
import useDebounce from '@/hooks/useDebounce';
import styles from './SearchBar.module.scss';
import SearchResults from '../SearchResults/SearchResults';

export default function SearchBar() {
  const { searchOpen, resetToggle } = useGlobalContext();
  const [search, setSearch] = useState([]);
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    const value = event?.target?.value;
    setQuery(value);
  };

  const handleSearch = useCallback(async (value) => {
    if (!value || value?.length < 3) return;
    const response = await nextApiCall.searchProducts(value);
    setSearch(response);
  }, []);

  const debouncedSearchTerm = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedSearchTerm) handleSearch(debouncedSearchTerm);
    else setSearch([]);
  }, [debouncedSearchTerm, handleSearch]);

  return (
    searchOpen && (
      <div className={styles.container}>
        <Container>
          <div className={styles.searchBar}>
            <div className={styles.form}>
              <button
                tabIndex={0}
                type="button"
                className={styles.buttonClose}
                onClick={() => resetToggle()}
              >
                <MdClose />
              </button>
              <p className={styles.title}>WHAT ARE YOU LOOKING FOR?</p>
              <label className={styles.header}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={handleChange}
                  aria-label="Search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </label>
            </div>
            <SearchResults results={search} />
          </div>
        </Container>
      </div>
    )
  );
}
