import config from '@/config/index';
import Link from 'next/link';
import Container from '../Container/Container';
import styles from './Banner1.module.scss';

export default function BannerHome({ collections }) {
  const date = new Date();
  const { title, description, handle, image } = collections?.[0] || {};

  return (
    <section
      className={styles.banner}
      style={{ backgroundImage: `url(${image?.src})` }}
    >
      <Container>
        <div className={styles.inner}>
          <div className={styles.container}>
            <div className={styles.content}>
              <p className={styles.upTitle}>
                <span />
                Trending {date?.getFullYear()}
              </p>
              <h1 className={`${styles.title} big`}>{title}</h1>
              <p className={styles.subtitle}>{description}</p>
              <Link
                href={`${config.routes.collection}/${handle}`}
                className={styles.link}
              >
                Shop now
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
