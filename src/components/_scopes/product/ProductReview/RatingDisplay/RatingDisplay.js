import styles from './RatingDisplay.module.scss';

const RatingDisplay = ({ percentage = 90 }) => (
    <div className={styles.rating}>
      <div className={styles.filled} style={{ width: `${percentage}%` }}>
        <span>★★★★★</span>
      </div>
      <div className={styles.empty}>
        <span>★★★★★</span>
      </div>
    </div>
  );

export default RatingDisplay;
