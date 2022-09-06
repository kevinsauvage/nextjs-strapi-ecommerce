import routes from '@/data/routes';
import Button from '@/components/Button/Button';
import styles from './Banner2.module.scss';

export default function BannerHome2() {
  return (
    <section className={styles.bannerHome2}>
      <div className={styles.container}>
        <h2 className={styles.title}>Keep Your Pets</h2>
        <p className={styles.subtitle}>Happy, Healthy and Safe!</p>
        <p className={styles.text}>
          You’ll enjoy knowing our dedicated team will do whatever is needed to
          keep your pets happy, healthy and safe.
        </p>
        <Button text="Buy now" secondary href={routes.base.shop} />
      </div>
    </section>
  );
}
