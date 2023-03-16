import styles from './Pagination.module.scss';
/* eslint-disable no-plusplus */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let index = 1; index <= totalPages; index++) {
    pageNumbers.push(index);
  }

  return (
    totalPages > 2 && (
      <nav>
        <ul className={styles.pagination}>
          {pageNumbers.map((number) => (
            <li key={number} className={`${styles.item} ${currentPage === number ? styles.active : ''}`}>
              <button type="button" onClick={() => onPageChange(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    )
  );
};

export default Pagination;
