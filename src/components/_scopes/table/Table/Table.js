import styles from './Table.module.scss';

const Table = ({ children }) => {
  return <table className={styles.table}>{children}</table>;
};

export const Body = ({ children }) => {
  return <tbody className={styles.body}>{children}</tbody>;
};

export const Head = ({ children }) => {
  return <thead className={styles.head}>{children}</thead>;
};

export const Row = ({ children }) => {
  return <tr className={styles.row}>{children}</tr>;
};

export const THead = ({ children }) => {
  return <th className={styles.tHead}>{children}</th>;
};

export const TData = ({ children }) => {
  return <td className={styles.tData}>{children}</td>;
};

export default Table;
