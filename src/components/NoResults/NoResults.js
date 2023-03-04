import Image from 'next/image';

import notFound from '@/assets/Notfound.svg';

import styles from './NoResults.module.scss';

function NoResults() {
  return (
    <div className={styles.noResults}>
      <Image
        alt="No products were found."
        src={notFound.src}
        width={notFound.width}
        height={notFound.height}
      />
      <b>Result Not Found</b>
      <p>Whoops... No products were found.</p>
    </div>
  );
}

export default NoResults;
