import Image from 'next/image';
import { Highlight } from 'react-instantsearch-hooks-web';
import styles from './Hit.module.scss';

function Hit({ hit }) {
  console.log(hit);
  return (
    <a href={`/shop/${hit.handle}`} className={styles.hit}>
      <div className={styles.image}>
        <Image src={hit.image} layout="responsive" width="100%" height="100%" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Highlight attribute="title" hit={hit} />
        </h3>
        <p>{hit.price}€</p>
      </div>
    </a>
  );
}

export default Hit;
