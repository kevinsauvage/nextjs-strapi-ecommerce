import HeightAnimation from '@/components/HeightAnimation/HeightAnimation';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';

import Search from './Search';

import styles from './SearchBar.module.scss';

export default function SearchBar() {
  const { searchOpen } = useGlobalContext();

  return (
    <HeightAnimation isOpen={searchOpen}>
      <div className={styles.container}>
        <Search size="medium" />
      </div>
    </HeightAnimation>
  );
}
