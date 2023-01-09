import styles from './AccountRow.module.scss';

function AccountRow({ title, content }) {
  return (
    <div className={styles.accountRow}>
      <strong className={styles.title}>{title}</strong>
      <p className={styles.content}>{content}</p>
    </div>
  );
}

export default AccountRow;
