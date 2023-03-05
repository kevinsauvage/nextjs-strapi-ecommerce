import RatingDisplay from '../RatingDisplay/RatingDisplay';

import styles from './Review.module.scss';

export default function Review({ review }) {
  const date = review?.createdAt && new Date(review?.createdAt);
  const rating = review?.review?.rating;
  const message = review?.review?.message;

  return (
    rating && (
      <li key={review.createdAt} className={styles.Review}>
        <p className={styles.by}>
          By {review?.customerFirstName} {review?.customerLastName}{' '}
          <span>{date && `the ${date.toDateString()}`}</span>
        </p>
        <RatingDisplay percentage={(rating * 100) / 5} />
        {message && <p className={styles.message}>{message}</p>}
      </li>
    )
  );
}
