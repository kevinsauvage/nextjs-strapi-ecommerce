import { RiGridFill, RiListCheck2 } from 'react-icons/ri';
import styles from './LayoutButtons.module.scss';

export default function LayoutButtons({ handleChange, selected }) {
  return (
    <div className={styles.LayoutButtons}>
      <button
        type="button"
        className={`${styles.button} ${styles.buttonGrid} ${styles[selected]}`}
        onClick={() => handleChange('grid')}
      >
        <RiGridFill size={24} />
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.buttonRow} ${styles[selected]}`}
        onClick={() => handleChange('row')}
      >
        <RiListCheck2 size={24} />
      </button>
    </div>
  );
}
