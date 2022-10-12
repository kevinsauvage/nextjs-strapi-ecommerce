import { useState } from 'react';
import Styles from './Collapsible.module.scss';

export default function Collapsible({ children, title }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${Styles.Collapsible} ${open ? Styles.open : Styles.close}`}
    >
      <button
        type="button"
        className={Styles.header}
        onClick={() => setOpen((prev) => !prev)}
      >
        <h6 className={Styles.title}>{title}</h6>
        <div className={Styles.icon}>
          <span />
          <span />
        </div>
      </button>
      <div
        className={`${Styles.children} ${open ? Styles.open : Styles.close}`}
      >
        {children}
      </div>
    </div>
  );
}
