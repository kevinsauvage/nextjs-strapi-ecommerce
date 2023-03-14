import { useState } from 'react';

import { arrowRight } from '@/assets/svg';

import HeightAnimation from '../HeightAnimation/HeightAnimation';

import styles from './Collapsible.module.scss';

const Collapsible = ({ children, title, last, extraClass = {} }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.Collapsible} ${open ? styles.open : styles.close} ${extraClass.container}`}>
      <button
        type="button"
        className={`${styles.header} ${last && styles.last} ${extraClass.header}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <strong className={styles.title}>{title}</strong>
        <div className={`${styles.icon} ${open ? styles.open : styles.close}`}>{arrowRight}</div>
      </button>
      <HeightAnimation isOpen={open}>
        <div className={`${styles.children} ${extraClass.children}`}>{children}</div>
      </HeightAnimation>
    </div>
  );
};

export default Collapsible;
