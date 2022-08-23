import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';
import { GlobalStoreContext } from '../../contexts/GlobalContext/GlobalContext';
import Container from '../Container/Container';
import styles from './SearchBar.module.scss';

export default function SearchBar() {
  const { searchOpen, resetToggle } = useContext(GlobalStoreContext);
  const [query, setQuery] = useState('');

  const router = useRouter();

  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    router.push(`/search?query=${query}`);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (searchOpen) inputRef.current.focus();
  }, [searchOpen]);

  return (
    searchOpen && (
      <div
        className={`${styles.container}`}
        role="button"
        tabIndex="0"
        onClick={() => resetToggle()}
        onKeyDown={(e) => e.key === 'Escape' && resetToggle()}
      >
        <form
          className={`${styles.form}`}
          action="submit"
          onSubmit={handleSubmit}
        >
          <Container
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <label htmlFor="inputSearch" className={styles.label}>
              <header className={styles.header}>
                <p className={styles.labelText}> WHAT ARE YOU LOOKING FOR?</p>
              </header>

              <div className={styles.search}>
                <input
                  ref={inputRef}
                  placeholder="Search products"
                  id="inputSearch"
                  className={styles.input}
                  type="text"
                  onChange={handleChange}
                />
                <button className={styles.button} type="submit" tabIndex={0}>
                  <MdSearch />
                </button>
              </div>
            </label>
            <button
              tabIndex={0}
              type="button"
              className={styles.buttonClose}
              onClick={() => resetToggle()}
            >
              <MdClose />
            </button>
          </Container>
        </form>
      </div>
    )
  );
}
