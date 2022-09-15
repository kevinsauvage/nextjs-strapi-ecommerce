import { useContext } from 'react';
import { GlobalStoreContext } from '@/contexts/GlobalContext/GlobalContext';
import Container from '@/components/Container/Container';
import { MdClose } from 'react-icons/md';
import styles from './SearchBar.module.scss';
import Autocomplete from './Autocomplete/Autocomplete';

export default function SearchBar() {
  const { searchOpen, resetToggle } = useContext(GlobalStoreContext);

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
              <p className={styles.labelText}> WHAT ARE YOU LOOKING FOR?</p>
              <button
                tabIndex={0}
                type="button"
                className={styles.buttonClose}
                onClick={() => resetToggle()}
              >
                <MdClose />
              </button>
            </header>
            <div id="autocomplete" />
            <Autocomplete />
          </Container>
        </div>
      </div>
    )
  );
}
