import styles from './AccountRow.module.scss';

const AccountRow = ({ title, content }) => (
  <div className={styles.row}>
    <b className={styles.title}>{title}:</b>
    <p>{content}</p>
  </div>
);

export default AccountRow;
