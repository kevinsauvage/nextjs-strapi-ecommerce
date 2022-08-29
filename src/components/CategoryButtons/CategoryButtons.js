import Link from 'next/link';
import routes from '../../data/routes';
import Container from '../Container/Container';
import Image from '../Image/Image';
import styles from './CategoryButtons.module.scss';

function CategoryButtons({ collections = [] }) {
  console.log(collections);
  return (
    <div className={styles.container}>
      <Container>
        <header className={styles.header}>
          <span />
          <h2 className={styles.title}>SHOP BY PET</h2>
          <span />
        </header>
        <ul className={styles.list}>
          {Array.isArray(collections) &&
            collections.map((category) => (
              <li key={category?.id}>
                <Link
                  href={`${routes.base.collection}/${category?.handle}`}
                  key={category.id}
                >
                  <a className={styles.button}>
                    <div className={styles.img}>
                      <Image layout="fill" src={category?.image?.src} />
                    </div>
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
