import config from '@/config/index';
import Link from 'next/link';
import styles from './Banner1.module.scss';

export default function BannerHome({ data }) {
  const { title, description, upTitle, handle, image } = data || {};

  return (
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
            <Link href={`${config.routes.collection}/${handle}`} className={styles.link}>
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
