import Button from '@/components/Button/Button';
import style from './Pagination.module.scss';

export default function Pagination({ handleNext, pageInfo }) {
  return (
    <div className={style.Pagination}>
      {pageInfo?.hasNextPage ? (
        <Button
          type="button"
          disabled={!pageInfo?.hasNextPage}
          onClick={handleNext}
          text="Load more"
          contrast
        />
      ) : (
        <p className={style.noResult}>No more results</p>
      )}
    </div>
  );
}
