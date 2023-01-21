import styles from './AccountRow.module.scss';

function AccountRow({ title, content }) {
  return (
    <div className={styles.accountRow}>
      <b className={styles.title}>{title}:</b>
      <p className={styles.content}>{content}</p>
    </div>
  );
}

export default AccountRow;
