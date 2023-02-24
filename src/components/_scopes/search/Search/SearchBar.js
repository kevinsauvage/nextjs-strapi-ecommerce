import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './SearchBar.module.scss';
import Search from './Search';

export default function SearchBar() {
  const { searchOpen } = useGlobalContext();

  return (
    <div className={`${styles.container} ${searchOpen && styles.expanded}`}>
      <Search size="medium" />
    </div>
  );
}
