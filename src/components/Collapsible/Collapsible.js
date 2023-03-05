import { useState } from 'react';

import { arrowRight } from '@/assets/svg';

import HeightAnimation from '../HeightAnimation/HeightAnimation';

import styles from './Collapsible.module.scss';

export default function Collapsible({ children, title, last }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.Collapsible} ${open ? styles.open : styles.close} `}>
      <button
        type="button"
        className={`${styles.header} ${last && styles.last}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <strong className={styles.title}>{title}</strong>
        <div className={`${styles.icon} ${open ? styles.open : styles.close}`}>{arrowRight}</div>
      </button>
      <HeightAnimation isOpen={open}>
        <div className={styles.children}>{children}</div>
      </HeightAnimation>
    </div>
  );
}
