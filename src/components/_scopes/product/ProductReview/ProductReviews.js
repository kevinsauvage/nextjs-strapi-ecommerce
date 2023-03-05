import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Button from '@/components/Button/Button';
import Collapsible from '@/components/Collapsible/Collapsible';
import config from '@/config/index';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { nextApiHelper } from '@/helpers/apiNext';
import { handleGetTokenCookies } from '@/helpers/cookies';

import Form from '../../forms/Form/Form';
import TextArea from '../../forms/TextArea/TextArea';

import styles from './ProductReviews.module.scss';

export default function ProductReviews({ product }) {
  const [reviews, setReviews] = useState([]);
  const { push, asPath } = useRouter();
  const { showToast } = useToastContext();
  const { user } = useUserContext();

  useEffect(() => {
    const productReview = product?.metafields?.filter((metafield) => metafield?.key === 'reviews');

    const value = productReview?.[0]?.value;
    if (value) {
      setReviews(JSON.parse(value));
    }
  }, [product]);

  const handleSetProductReview = useCallback(
    async (formData) => {
      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      if (!shopifyToken) {
        return push({
          pathname: config.routes.login,
          query: { redirectUrl: asPath },
        });
      }

      const date = new Date();

      const reviewObj = {
        customerId: user.id,
        review: formData,
        customerFirstName: user.firstName,
        customerLastName: user.lastName,
        creatadeAt: date,
      };

      const metafields = {
        metafields: [
          {
            key: 'reviews',
            namespace: 'custom',
            ownerId: product.id,
            type: 'json',
            value: JSON.stringify([...reviews, reviewObj]),
          },
        ],
      };

      const response = await nextApiHelper(`/api/reviews`, metafields, 'POST');

      console.log('🚀 ~ file: ProductPresenter.js:50 ~ response:', response);

      if (response?.response) {
        setReviews(response.response);
        return showToast.success('Product correctly added a review');
      }
      return showToast.error("Couldn't set product to user wishlist");
    },
    [asPath, product.id, push, reviews, showToast, user]
  );
  return (
    <div className={styles.ProductReviews}>
      <Collapsible title="Reviews">
        <div className={styles.ProductReviewsContent}>
          <div className={styles.customerReviews}>
            <h6>Customer reviews</h6>
            {Array.isArray(reviews) &&
              reviews.map((review) => (
                <li key={review.creatadeAt} className={styles.review}>
                  <p>{review?.review?.review}</p>
                </li>
              ))}
          </div>

          <div className={styles.reviewForm}>
            <Collapsible title={<>Add a review</>}>
              <h6>Add a review</h6>
              <Form
                onSubmit={handleSetProductReview}
                requiredFields={['review']}
                initialValues={{ review: '' }}
              >
                <TextArea
                  placeholder="Review"
                  name="review"
                  id="review"
                  label="review"
                  input="true"
                  required="true"
                />
                <Button primary type="submit">
                  Submit
                </Button>
              </Form>
            </Collapsible>
          </div>
        </div>
      </Collapsible>
    </div>
  );
}
