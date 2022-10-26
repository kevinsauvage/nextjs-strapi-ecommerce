import Container from '@/layout/Container/Container';
import { MdClose } from 'react-icons/md';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './SearchBar.module.scss';

export default function SearchBar() {
  const { searchOpen, resetToggle } = useGlobalContext();

  return (
    searchOpen && (
      <div
        className={`${styles.container}`}
        role="button"
        tabIndex="0"
        onClick={() => resetToggle()}
        onKeyDown={(e) => e.key === 'Escape' && resetToggle()}
      >
        <div className={`${styles.form}`}>
          <Container
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <header className={styles.header}>
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
      </div>
    )
  );
}
