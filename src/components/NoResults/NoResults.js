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
      <p>Whoops... There is no results.</p>
    </div>
  );
}

export default NoResults;
