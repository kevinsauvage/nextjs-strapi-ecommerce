import { useEffect, useRef, useState } from 'react';
import Container from '@/components/Container/Container';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import config from '@/config/index';
import { useRouter } from 'next/router';
import styles from './SearchBar.module.scss';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { searchOpen } = useGlobalContext();
  const { push } = useRouter();
  const input = useRef();

  const handleChange = (event) => {
    const value = event?.target?.value;
    setQuery(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query?.trim()) return;
    push({
      pathname: config.routes.search,
      query: { query },
    });
  };

  useEffect(() => {
    if (searchOpen) input.current.focus();
  }, [searchOpen]);

  return (
    <div className={`${styles.container} ${searchOpen && styles.expanded}`}>
      <Container>
        <div className={styles.searchBar}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.header}>
              <input
                ref={input}
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
          </form>
        </div>
      </Container>
    </div>
  );
}
