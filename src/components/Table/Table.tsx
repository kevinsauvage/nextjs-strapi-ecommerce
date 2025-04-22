import styles from './Table.module.scss';

const Table = ({ children }: { children: React.ReactNode }) => (
  <table className={styles.table}>{children}</table>
);

export const Body = ({ children }: { children: React.ReactNode }) => (
  <tbody className={styles.body}>{children}</tbody>
);

export const Head = ({ children }: { children: React.ReactNode }) => (
  <thead className={styles.head}>{children}</thead>
);

export const Row = ({ children }: { children: React.ReactNode }) => (
  <tr className={styles.row}>{children}</tr>
);

export const THead = ({ children }: { children: React.ReactNode }) => (
  <th className={styles['t-head']}>{children}</th>
);

export const TData = ({ children }: { children: React.ReactNode }) => (
  <td className={styles['t-data']}>{children}</td>
);

export default Table;
