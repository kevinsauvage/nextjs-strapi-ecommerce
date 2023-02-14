import { useEffect, useState } from 'react';
import Container from '@/components/Container/Container';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import styles from './CollectionBanner.module.scss';

function CollectionBanner({ title, description }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleIsOpen = () => {
    if (isOpen) {
      window.localStorage.setItem('isOpen', isOpen);
    } else {
      window.localStorage.removeItem('isOpen');
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const storageState = window.localStorage.getItem('isOpen');

    if (storageState) setIsOpen(false);
    else setIsOpen(true);
  }, []);

  return (
    <div className={styles.CollectionBanner}>
      <Container>
        <div className={`${styles.inner} ${!isOpen && styles.close}`}>
          <button type="button" className={styles.button} onClick={handleIsOpen}>
            {isOpen ? <FaArrowUp /> : <FaArrowDown />}
          </button>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </Container>
    </div>
  );
}

export default CollectionBanner;
