import Link from 'next/link';
import Container from '@/layout/Container/Container';
import config from '@/config/index';
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
                  href={`${config.routes.collection}/${category?.handle}`}
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
