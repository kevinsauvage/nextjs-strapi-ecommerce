import { MdSearch } from 'react-icons/md';
import { useSearchBox } from 'react-instantsearch-hooks-web';
import debounce from '@/utils/debounce';
import styles from './CustomSearch.module.scss';

function CustomSearchBox(props) {
  const { query, refine } = useSearchBox(props);

  return (
    <label htmlFor="inputSearch" className={styles.label}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => {
          debounce(refine(e.target.value), 100000000);
        }}
      />
      <button className={styles.button} type="submit" tabIndex={0}>
        <MdSearch />
      </button>
    </label>
  );
}

export default CustomSearchBox;
