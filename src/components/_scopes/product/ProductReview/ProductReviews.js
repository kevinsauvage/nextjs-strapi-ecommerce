import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

import AbsoluteLoader from '@/components/_loaders/AbsoluteLoader/AbsoluteLoader';
import Button from '@/components/Button/Button';
import Collapsible from '@/components/Collapsible/Collapsible';
import config from '@/config/index';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { nextApiHelper } from '@/helpers/apiNext';
import { handleGetTokenCookies } from '@/helpers/cookies';

import Form from '../../forms/Form/Form';
import TextArea from '../../forms/TextArea/TextArea';

import Rating from './Ratings/Ratings';
import Reviews from './Reviews/Reviews';

import styles from './ProductReviews.module.scss';

export default function ProductReviews({ product }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState();

  const { push, asPath } = useRouter();
  const { showToast } = useToastContext();
  const { user } = useUserContext();

  useEffect(() => {
    const productReview = product?.metafields?.filter((metafield) => metafield?.key === 'reviews');
    const value = productReview?.[0]?.value;
    setReviews(value ? JSON.parse(value) : []);
  }, [product?.metafields]);

  const handleSetProductReview = useCallback(
    async (formData) => {
      if (typeof rating === 'undefined') return showToast.error('Please select a rating');
      const shopifyToken = handleGetTokenCookies(config.cookies.shopifyToken);

      if (!shopifyToken) {
        return push({
          pathname: config.routes.login,
          query: { redirectUrl: asPath },
        });
      }

      const date = new Date();

      const reviewObj = {
        customerId: user.id,
        review: { message: formData.message, rating },
        customerFirstName: user.firstName,
        customerLastName: user.lastName,
        createdAt: date,
        id: uuidv4(),
      };

      const newReviews = [...reviews, reviewObj];

      const metafields = {
        metafields: [
          {
            key: 'reviews',
            namespace: 'custom',
            ownerId: product.id,
            type: 'json',
            value: JSON.stringify(newReviews),
          },
        ],
      };

      setLoading(true);
      const response = await nextApiHelper(`/api/reviews`, metafields, 'POST');
      setLoading(false);

      if (response?.response) {
        setReviews(response.response);
        setRating();
        return showToast.success('Review correctly added');
      }
      return showToast.error("Couldn't add the review, please try again later");
    },
    [asPath, product?.id, push, rating, reviews, showToast, user?.firstName, user?.id, user?.lastName]
  );

  const handleRemoveProductReview = useCallback(
    async (review) => {
      const shopifyToken = handleGetTokenCookies(config.cookies.shopifyToken);

      if (!shopifyToken) {
        return push({
          pathname: config.routes.login,
          query: { redirectUrl: asPath },
        });
      }

      if (!review?.id) return null;
      if (user?.id !== review.customerId) return null;

      const newReviews = reviews.filter((rev) => rev.id !== review.id);

      const metafields = {
        metafields: [
          {
            key: 'reviews',
            namespace: 'custom',
            ownerId: product.id,
            type: 'json',
            value: JSON.stringify(newReviews),
          },
        ],
      };

      setLoading(true);
      const response = await nextApiHelper(`/api/reviews`, metafields, 'POST');
      setLoading(false);

      if (response?.response) {
        setReviews(response.response);
        return showToast.success('Review correctly removed');
      }
      return showToast.error("Couldn't remove the review, please try again later");
    },
    [asPath, product.id, push, reviews, showToast, user?.id]
  );
  return (
    <div className={styles.ProductReviews}>
      {loading && <AbsoluteLoader />}
      <Collapsible title="Reviews">
        <div className={styles.ProductReviewsContent}>
          <div className={styles.customerReviews}>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              <Reviews reviews={reviews} handleRemoveProductReview={handleRemoveProductReview} />
            ) : (
              <p>No reviews</p>
            )}
          </div>

          <div className={styles.addReview}>
            <Collapsible title="Add a review">
              {user?.id ? (
                <>
                  <div className={styles.rating}>
                    <h6>Leave a review</h6>
                    <Rating rating={rating} onChange={(payload) => setRating(payload)} />
                  </div>
                  <Form
                    extraClass={styles.reviewForm}
                    onSubmit={handleSetProductReview}
                    initialValues={{ message: '' }}
                  >
                    <TextArea
                      placeholder="Amazing product"
                      name="message"
                      id="message"
                      label="message"
                      input="true"
                    />
                    <Button extraClass={styles.buttonSubmit} primary type="submit">
                      Publish review
                    </Button>
                  </Form>
                </>
              ) : (
                <div className={styles.login}>
                  <b>Login to you account to leave a review</b>
                  <Button
                    extraClass={styles.loginButton}
                    contrast
                    href={`${config.routes.login}?redirectUrl=${asPath}`}
                  >
                    Go to login page
                  </Button>
                </div>
              )}
            </Collapsible>
          </div>
        </div>
      </Collapsible>
    </div>
  );
}
