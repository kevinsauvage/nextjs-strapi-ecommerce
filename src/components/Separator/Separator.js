import styles from './Separator.module.scss';

export default function Separator({ margin }) {
  return (
    <div
      className={`${styles.Separator} Separator`}
      style={{ margin: margin || '20px 0' }}
    />
  );
}
