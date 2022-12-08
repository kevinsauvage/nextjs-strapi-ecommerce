import Button from '@/components/Button/Button';
import style from './Pagination.module.scss';

export default function Pagination({ handleNext, handlePrev, pageInfo }) {
  return (
    <div className={style.Pagination}>
      {pageInfo?.hasPreviousPage || pageInfo?.hasNextPage ? (
        <>
          <Button
            type="button"
            text="Previous page"
            disabled={!pageInfo?.hasPreviousPage}
            onClick={handlePrev}
            tertiary
          />
          <Button
            type="button"
            disabled={!pageInfo?.hasNextPage}
            onClick={handleNext}
            text="Next page"
            tertiary
          />
        </>
      ) : (
        <p className={style.noResult}>No more results</p>
      )}
    </div>
  );
}
