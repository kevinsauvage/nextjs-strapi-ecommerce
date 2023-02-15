import Link from 'next/link';
import Container from '@/components/Container/Container';
import styles from './Banner1.module.scss';

export default function BannerHome({ data }) {
  const { title, description, upTitle, handle, image } = data || {};

  return (
    <Container extraClass={styles.outer}>
      <section className={styles.banner} style={{ backgroundImage: `url(${image?.url})` }}>
        <div className={styles.inner}>
          <div className={styles.container}>
            <div className={styles.content}>
              <p className={styles.upTitle}>
                <span />
                {upTitle}
              </p>
              <h1 className={`${styles.title} big`}>{title}</h1>
              <p className={styles.subtitle}>{description}</p>
              <Link href={`${handle}`} className={styles.link}>
                <p>Shop now</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
