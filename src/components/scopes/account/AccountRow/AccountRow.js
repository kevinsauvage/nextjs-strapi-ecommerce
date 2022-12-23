import styles from './AccountRow.module.scss';

function AccountRow({ title, content }) {
  return (
    <div className={styles.accountRow}>
      <p className={styles.title}>{title}</p>
      <p className={styles.content}>{content}</p>
    </div>
  );
}

export default AccountRow;
