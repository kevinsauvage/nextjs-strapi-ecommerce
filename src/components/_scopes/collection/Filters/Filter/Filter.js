import { useState } from 'react';
import { arrowRight } from '@/assets/svg';
import styles from './Filter.module.scss';

function Filter({ filter, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.filter} ${open && styles.open}`} key={filter.label}>
      <button type="button" className={styles.header} onClick={() => setOpen((prev) => !prev)}>
        <b className={styles.label}>{filter.label}</b>
        <span className={styles.arrow}>{arrowRight}</span>
      </button>
      <div className={styles.children}>{children}</div>
    </div>
  );
}

export default Filter;
