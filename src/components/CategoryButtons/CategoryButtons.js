import Image from 'next/image';
import Link from 'next/link';
import routes from '@/data/routes';
import Container from '@/components/Container/Container';
import styles from './CategoryButtons.module.scss';

function CategoryButtons({ collections = [] }) {
  return (
    <div className={styles.container}>
      <Container>
        <ul className={styles.list}>
          {Array.isArray(collections) &&
            collections.map((category) => (
              <li key={category?.id}>
                <Link
                  href={`${routes.base.collection}/${category?.handle}`}
                  key={category.id}
                >
                  <a className={styles.button}>
                    <p className={styles.name}>{category?.title}</p>
                  </a>
                </Link>
              </li>
            ))}
        </ul>
      </Container>
    </div>
  );
}

export default CategoryButtons;
