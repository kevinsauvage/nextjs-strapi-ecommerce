// eslint-disable-next-line css-modules/no-unused-class
import styles from './Container.module.scss';

const Container = ({
  children,
  extraClass,
  size,
  ...rest
}: {
  children?: React.ReactNode;
  extraClass?: string;
  size?: 'small' | 'medium' | 'large';
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`${styles.container} ${extraClass || ''} ${styles[size]}`} {...rest}>
    {children}
  </div>
);

export default Container;
