import styles from './RatingDisplay.module.scss';

export default function RatingDisplay({ percentage = 90 }) {
  return (
    <div className={styles.rating}>
      <div className={styles.filled} style={{ width: `${percentage}%` }}>
        <span>★★★★★</span>
      </div>
      <div className={styles.empty}>
        <span>★★★★★</span>
      </div>
    </div>
  );
}
