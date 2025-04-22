'use client';

import styles from './Form.module.scss';

const Form = ({
  children,
  title,
  extraClass = '',
  ...rest
}: {
  children: React.ReactNode;
  title?: string;
  extraClass?: string;
} & React.FormHTMLAttributes<HTMLFormElement>) => {
  return (
    <form className={`${styles.form} ${extraClass}`} {...rest}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.children}>{children}</div>
    </form>
  );
};

export default Form;
