import styles from './Separator.module.scss';

export default function Separator({ margin }) {
  return (
    <div className={styles.Separator} style={{ margin: margin || '20px 0' }} />
  );
}
