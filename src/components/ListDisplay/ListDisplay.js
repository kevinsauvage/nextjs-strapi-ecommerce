// eslint-disable-next-line css-modules/no-unused-class
import styles from './ListDisplay.module.scss';

const ListDisplay = ({ children, layout, gap }) => (
  <ul className={`${styles['list-display']} ${styles[layout]}`} style={{ gap }}>
    {children}
  </ul>
);

export default ListDisplay;
