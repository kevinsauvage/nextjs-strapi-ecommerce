import Link from 'next/link';
import Image from 'next/image';
import config from '@/config/index';
import styles from './SearchResults.module.scss';

function SearchResults({ results }) {
  return (
    <div>
      <div className={styles.searchResult}>
        {results.map((item) => (
          <div key={item.id} className={styles.searchProductCard}>
            <div className={styles.image}>
              <Image
                src={item?.images?.[0]?.sm}
                alt={item?.images?.[0]?.alt || item?.title}
                quality={70}
                fill
              />
            </div>
            <div className={styles.details}>
              <strong className={styles.type}>{item?.productType}</strong>
              <Link
                href={`${config.routes.collection}/${item?.collections?.[0].handle}/${item?.handle}`}
              >
                <p className={styles.name}>{item?.title}</p>
              </Link>

              <p className={styles.price}>
                {item?.priceRange?.maxVariantPrice?.currencyCode}
                {item?.priceRange?.maxVariantPrice?.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
