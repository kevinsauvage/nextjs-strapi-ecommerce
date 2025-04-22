// eslint-disable-next-line css-modules/no-unused-class
import styles from './ListDisplay.module.scss';

const ListDisplay = ({
  children,
  layout,
  gap,
}: {
  children: React.ReactNode;
  layout?: 'grid' | 'list';
  gap?: string;
}) => (
  <ul className={`${styles['list-display']} ${styles[layout]}`} style={{ gap }}>
    {children}
  </ul>
);

export default ListDisplay;
