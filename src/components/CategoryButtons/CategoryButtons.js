import Link from 'next/link';
import Container from '../Container/Container';
import styles from './CategoryButtons.module.scss';

function CategoryButtons({ categories = [] }) {
  return (
    <div className={styles.container}>
      <Container>
        {Array.isArray(categories) &&
          categories.map((_category) => (
            <Link href={`/categories/${_category.id}`} key={_category.id}>
              <a className={styles.button}>{_category.attributes.name}</a>
            </Link>
          ))}
      </Container>
    </div>
  );
}

export default CategoryButtons;
