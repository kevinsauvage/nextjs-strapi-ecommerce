'use client';

import { useState } from 'react';

import { arrowRight } from '@/assets/svg';
import HeightAnimation from '@/components/HeightAnimation/HeightAnimation';
import type { Filter as FilterType } from '@/shopify/storefront';

import styles from './Filter.module.scss';

const Filter = ({ filter, children }: { filter: FilterType; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.filter} ${open && styles.open}`} key={filter.label}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen((previous) => !previous)}
      >
        <b className={styles.label}>{filter.label}</b>
        <span className={styles.arrow}>{arrowRight}</span>
      </button>
      <HeightAnimation initialHeight={0} isOpen={open}>
        <div className={styles.children}>{children}</div>
      </HeightAnimation>
    </div>
  );
};

export default Filter;
