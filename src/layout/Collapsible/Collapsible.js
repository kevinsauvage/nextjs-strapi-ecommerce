import { useState } from 'react';
import styles from './Collapsible.module.scss';

export default function Collapsible({ children, title, last }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${styles.Collapsible} ${open ? styles.open : styles.close} `}
    >
      <button
        type="button"
        className={`${styles.header} ${last && styles.last}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <strong className={styles.title}>{title}</strong>
        <div className={styles.icon}>
          <span />
          <span />
        </div>
      </button>
      <div
        className={`${styles.children} ${open ? styles.open : styles.close}`}
      >
        {children}
      </div>
    </div>
  );
}
