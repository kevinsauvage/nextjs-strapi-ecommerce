import { useHits } from 'react-instantsearch-hooks-web';
import Hit from '../Hit/Hit';
import styles from './Hits.module.scss';

function CustomHits(props) {
  const { hits, results, refine, hasMore } = useHits(props);

  if (!results.query.length) return null;

  return (
    <>
      <div className={styles.hits}>
        {hits.length > 0 ? (
          hits.map((hit) => <Hit key={hit.id} hit={hit} />)
        ) : (
          <p>No matching results</p>
        )}
      </div>
      {hasMore && (
        <button type="button" className="" onClick={refine}>
          Load more
        </button>
      )}
    </>
  );
}
export default CustomHits;
