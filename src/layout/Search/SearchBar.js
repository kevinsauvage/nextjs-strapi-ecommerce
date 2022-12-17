import Image from 'next/legacy/image';
import Container from '@/layout/Container/Container';
import { MdClose } from 'react-icons/md';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import nextApiCall from '@/utils/apiNext';
import { useCallback, useEffect, useState } from 'react';
import limitStrLength from '@/utils/limitStringLength';
import config from '@/config/index';
import Link from 'next/link';
import useDebounce from '@/hooks/useDebounce';
import styles from './SearchBar.module.scss';

export default function SearchBar() {
  const { searchOpen, resetToggle } = useGlobalContext();
  const [search, setSearch] = useState([]);
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    const value = event?.target?.value;
    setQuery(value);
  };

  const handleSearch = useCallback(async (value) => {
    const response = await nextApiCall.searchProducts(value);
    console.log(response);
    setSearch(response);
  }, []);

  const debouncedSearchTerm = useDebounce(query, 800);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log(`call search with query ${debouncedSearchTerm}`);
      handleSearch(debouncedSearchTerm);
    } else {
      console.log('not debounce search term');
    }
  }, [debouncedSearchTerm, handleSearch]);

  return (
    searchOpen && (
      <div className={`${styles.container}`}>
        <div className={`${styles.form}`}>
          <Container>
            <header className={styles.header}>
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
              <button
                tabIndex={0}
                type="button"
                className={styles.buttonClose}
                onClick={() => resetToggle()}
              >
                <MdClose />
              </button>
            </header>
          </Container>
        </div>
        <div>
          <Container>
            <div className={styles.searchResult}>
              {search.map((item) => (
                <div key={item.id} className={styles.searchProductCard}>
                  <div className={styles.image}>
                    <Image
                      src={item?.images?.[0]?.sm}
                      alt={item?.images?.[0]?.alt || item?.title}
                      layout="fill"
                      blurDataURL={item?.images?.[0]?.blurDataURL}
                      placeholder="blur"
                      quality={70}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.details}>
                    <Link
                      href={`${config.routes.collection}/${item?.collections?.[0].handle}/${item?.handle}`}
                    >
                      <p className={styles.name}>{item?.title}</p>
                    </Link>

                    <div className={styles.description}>
                      {limitStrLength(item?.description, 40)}
                    </div>
                    <div className={styles.price}>
                      {item?.priceRange?.maxVariantPrice?.currencyCode}
                      {item?.priceRange?.maxVariantPrice?.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </div>
    )
  );
}
