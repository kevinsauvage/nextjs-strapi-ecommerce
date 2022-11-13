import Button from '../../Button/Button';
import style from './Pagination.module.scss';

export default function Pagination({ handleNext, handlePrev, pageInfo }) {
  return (
    <div className={style.Pagination}>
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
    </div>
  );
}
