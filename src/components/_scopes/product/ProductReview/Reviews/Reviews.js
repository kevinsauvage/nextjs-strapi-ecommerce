import { useCallback, useState } from 'react';

import Pagination from '@/components/Pagination/Pagination';

import Review from '../Review/Review';

export default function Reviews({ reviews, handleRemoveProductReview }) {
  console.log('🚀 ~ file: Reviews.js:9 ~ Reviews ~ reviews:', reviews);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / 5);
  const sliceFrom = (currentPage - 1) * 5;
  const sliceUntil = (currentPage - 1) * 5 + 5;

  const getAverage = useCallback(
    () =>
      reviews.reduce((acc, curr) => {
        let total = acc;
        total += curr.review.rating;
        return total;
      }, 0) / reviews.length,
    [reviews]
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {`${getAverage()} / 5`}
      {reviews.slice(sliceFrom, sliceUntil).map((review) => (
        <Review key={review?.id} review={review} handleRemoveProductReview={handleRemoveProductReview} />
      ))}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
