import { RiGridFill, RiListCheck2 } from 'react-icons/ri';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './LayoutButtons.module.scss';

const LayoutButtons = ({ handleChange, selected }) => (
  <div className={styles.buttons}>
    <button
      type="button"
      aria-label="Grid layout"
      className={`${styles.button}  ${styles[selected]}`}
      onClick={() => handleChange('grid')}
    >
      <RiGridFill size={24} />
    </button>
    <button
      type="button"
      aria-label="Row layout"
      className={` ${styles.button} ${styles[selected]}`}
      onClick={() => handleChange('row')}
    >
      <RiListCheck2 size={24} />
    </button>
  </div>
);

export default LayoutButtons;
