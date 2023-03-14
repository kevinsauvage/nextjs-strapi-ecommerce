import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';

import Search from './Search';

import styles from './SearchBar.module.scss';

const SearchBar = () => {
  const { searchOpen } = useGlobalContext();

  return (
    <div className={`${styles.container} ${searchOpen && styles.expanded}`}>
      {searchOpen && <Search size="medium" />}
    </div>
  );
};

export default SearchBar;
