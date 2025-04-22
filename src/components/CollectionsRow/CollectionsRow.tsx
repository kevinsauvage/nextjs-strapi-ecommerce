import Image from 'next/image';
import Link from 'next/link';

import SectionTitle from '@/components/SectionTitle/SectionTitle';

import styles from './CollectionsRow.module.scss';

const CollectionsRow = ({ collections }: { collections: BannerHomeCategories[] }) => (
  <div className={styles.row}>
    <SectionTitle first="Shop By" second="Category" />
    <ul className={styles.list}>
      {collections.map((collection, index) => (
        <li key={collection.title + index} className={styles.card}>
          <Link href={`${collection.handle}`}>
            <Image
              className={styles.image}
              src={collection.image.url}
              alt={collection.image.alt}
              width={300}
              height={300}
            />
            <b>{collection.title}</b>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default CollectionsRow;
