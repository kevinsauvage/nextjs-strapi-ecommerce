import styles from './AccountRow.module.scss';

const AccountRow = ({ title, content }) => (
    <div className={styles.accountRow}>
      <b className={styles.title}>{title}:</b>
      <p className={styles.content}>{content}</p>
    </div>
  );

export default AccountRow;
