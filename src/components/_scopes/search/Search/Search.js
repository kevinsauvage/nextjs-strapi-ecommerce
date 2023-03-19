/* eslint-disable simple-import-sort/imports */
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Container from '@/components/Container/Container';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { capitalizeFirstLetter } from '@/helpers/string';

import analytics from '@/helpers/analytics';
import styles from './Search.module.scss';

const Search = ({ size }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { searchOpen } = useGlobalContext();
  const { push } = useRouter();
  const input = useRef();

  useEffect(() => {
    setQuery(router.query.query);
  }, [router.query.query]);

  const handleChange = (event) => {
    const value = event?.target?.value;
    setQuery(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query?.trim()) return;
    analytics.event({
      action: 'search',
      params: {
        search_term: query,
      },
    });
    push({
      pathname: config.routes.search,
      query: { query },
    });
  };

  useEffect(() => {
    input.current.focus();
  }, [searchOpen]);

  return (
    <div className={styles.search}>
      <Container size={size}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            <input
              ref={input}
              className={styles.input}
              type="text"
              placeholder="Search"
              value={capitalizeFirstLetter(query)}
              onChange={handleChange}
              aria-label="Search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </label>
        </form>
      </Container>
    </div>
  );
};

export default Search;
