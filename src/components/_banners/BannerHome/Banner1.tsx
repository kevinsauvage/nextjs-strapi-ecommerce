import Link from 'next/link';

import Container from '@/components/Container/Container';

import styles from './Banner1.module.scss';

const BannerHome = ({ data }: { data: BannerHomeType }) => {
  const { image, style = {} } = data || {};

  return (
    <section className={styles.banner} style={{ backgroundImage: `url(${image?.url})` }}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.container} style={{ ...style }}>
            {data?.items?.map((item, index) => (
              <div key={item.title + index} className={styles.content}>
                <p className={styles['up-title']}>
                  <span />
                  {item.upTitle}
                </p>
                <h1 className={`${styles.title} big`}>{item.title}</h1>
                <p className={styles.subtitle}>{item.description}</p>
                <Link href={item.handle} className={styles.link}>
                  Shop now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BannerHome;
