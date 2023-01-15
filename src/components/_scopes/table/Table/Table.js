import styles from './Table.module.scss';

export function Body({ items }) {
  return (
    <tbody>
      <tr className={styles.container}>
        {items.map((item) => (
          <td key={item.value} {...item.args} className={styles.itemBody}>
            {item.value}
          </td>
        ))}
      </tr>
    </tbody>
  );
}

export function Head({ items }) {
  return (
    <thead className={styles.head}>
      <tr>
        {items.map((item) => (
          <th key={item.value} {...item.args}>
            {item.value}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Table({ head, body, foot }) {
  return (
    <table className={styles.table}>
      {head}
      {body}
      {foot && foot}
    </table>
  );
}

export default Table;
