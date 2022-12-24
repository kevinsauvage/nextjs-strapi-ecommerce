import styles from './AccountLayout.module.scss';

function AccountLayout({ children, title, subtitle }) {
  return (
    <div className={styles.AccountLayout}>
      <div className={styles.banner}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export default AccountLayout;
