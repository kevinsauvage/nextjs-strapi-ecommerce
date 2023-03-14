import styles from './Table.module.scss';

const Table = ({ children }) => <table className={styles.table}>{children}</table>;

export const Body = ({ children }) => <tbody className={styles.body}>{children}</tbody>;

export const Head = ({ children }) => <thead className={styles.head}>{children}</thead>;

export const Row = ({ children }) => <tr className={styles.row}>{children}</tr>;

export const THead = ({ children }) => <th className={styles.tHead}>{children}</th>;

export const TData = ({ children }) => <td className={styles.tData}>{children}</td>;

export default Table;
