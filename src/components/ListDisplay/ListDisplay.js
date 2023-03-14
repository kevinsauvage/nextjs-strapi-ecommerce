import styles from './ListDisplay.module.scss';

const ListDisplay = ({ children, layout, gap }) => {
  return (
    <ul className={`${styles.ListDisplay} ${styles[layout]}`} style={{ gap }}>
      {children}
    </ul>
  );
};

export default ListDisplay;
