import styles from './Table.module.scss';

export function Body({ children }) {
  return <tbody className={styles.body}>{children}</tbody>;
}

export function Head({ children }) {
  return <thead className={styles.head}>{children}</thead>;
}

export function Row({ children }) {
  return <tr className={styles.row}>{children}</tr>;
}

export function THead({ children }) {
  return <th className={styles.tHead}>{children}</th>;
}

export function TData({ children }) {
  return <td className={styles.tData}>{children}</td>;
}

function Table({ children }) {
  return <table className={styles.table}>{children}</table>;
}

export default Table;
