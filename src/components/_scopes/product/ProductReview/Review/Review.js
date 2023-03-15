import { remove } from '@/assets/svg';
import Tooltip from '@/components/Tooltip/Tooltip';
import useUserContext from '@/contexts/UserContext/useUserContext';

import RatingDisplay from '../RatingDisplay/RatingDisplay';

import styles from './Review.module.scss';

const Review = ({ review, handleRemoveProductReview }) => {
  const date = review?.createdAt && new Date(review?.createdAt);
  const rating = review?.review?.rating;
  const message = review?.review?.message;
  const { user } = useUserContext();

  return (
    rating && (
      <li className={styles.review}>
        <div className={styles.header}>
          <p className={styles.by}>
            By {review?.customerFirstName} {review?.customerLastName}{' '}
            <span>{date && `the ${date.toDateString()}`}</span>
          </p>
          {user?.id === review?.customerId && (
            <Tooltip text="Remove review">
              <button
                className={styles['button-remove']}
                type="button"
                onClick={() => handleRemoveProductReview(review)}
              >
                {remove}
              </button>
            </Tooltip>
          )}
        </div>
        <RatingDisplay percentage={(rating * 100) / 5} />
        {message && <p className={styles.message}>{message}</p>}
      </li>
    )
  );
};

export default Review;
