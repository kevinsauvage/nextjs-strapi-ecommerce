import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';

import Search from './Search';

import styles from './SearchBar.module.scss';

export default function SearchBar() {
  const { searchOpen } = useGlobalContext();

  return (
    <div className={`${styles.container} ${searchOpen && styles.expanded}`}>
      <Search size="medium" />
    </div>
  );
}
