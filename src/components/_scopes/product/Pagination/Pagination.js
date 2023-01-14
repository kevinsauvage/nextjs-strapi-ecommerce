import Button from '@/components/Button/Button';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import style from './Pagination.module.scss';

export default function Pagination() {
  const { handleNext, pageInfo } = useCollectionContext();

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
