import config from '@/config/index';
import Link from 'next/link';
import styles from './Banner1.module.scss';

export default function BannerHome({ collections }) {
  const date = new Date();
  const { title, description, handle, image } = collections?.[0] || {};

  return (
    <section className={styles.banner}>
      <div className={styles.inner} style={{ backgroundImage: `url(${image?.src})` }}>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.upTitle}>
              <span />
              Trending {date?.getFullYear()}
            </p>
            <h1 className={`${styles.title} big`}>{title}</h1>
            <p className={styles.subtitle}>{description}</p>
            <Link href={`${config.routes.collection}/${handle}`} className={styles.link}>
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
